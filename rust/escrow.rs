use solana_sdk::{
    account::{self, Account},
    program::{invoke_signed, invoke_signed_expect_success, AccountMeta, ProgramResult},
    pubkey::Pubkey,
};
use std::time::Duration;

// Define the struct to represent the state of the escrow contract
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
struct EscrowState {
    buyer: Pubkey,
    seller: Pubkey,
    amount: u64,
    deadline: i64,
    status: EscrowStatus,
}

// Define the enum to represent the status of the escrow contract
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
enum EscrowStatus {
    Pending,
    Cancelled,
    Completed,
}

// Implement the functions for the escrow contract
impl EscrowState {
    // Function to initiate an escrow contract
    pub fn create_contract(
        buyer: &Pubkey,
        seller: &Pubkey,
        amount: u64,
        deadline: Duration,
    ) -> Self {
        EscrowState {
            buyer: *buyer,
            seller: *seller,
            amount,
            deadline: solana_sdk::timing::timestamp() + deadline.as_secs() as i64,
            status: EscrowStatus::Pending,
        }
    }

    // Function to cancel an escrow contract
    pub fn cancel_contract(&mut self) -> Result<(), &'static str> {
        if self.status != EscrowStatus::Pending {
            return Err("Cannot cancel contract as it has already been completed or cancelled");
        }
        if solana_sdk::timing::timestamp() >= self.deadline {
            return Err("Cannot cancel contract as deadline has passed");
        }
        self.status = EscrowStatus::Cancelled;
        Ok(())
    }

    // Function to complete an escrow contract
    pub fn complete_contract(&mut self) -> Result<(), &'static str> {
        if self.status != EscrowStatus::Pending {
            return Err("Cannot complete contract as it has already been completed or cancelled");
        }
        if solana_sdk::timing::timestamp() < self.deadline {
            return Err("Cannot complete contract as deadline has not yet passed");
        }
        self.status = EscrowStatus::Completed;
        Ok(())
    }
}

// Define the program ID for the escrow contract
const ESCROW_PROGRAM_ID: [u8; 32] = [0; 32];

// Define the entry point function for the escrow contract
#[no_mangle]
pub extern "C" fn entrypoint(input: &[u8]) -> ProgramResult {
    let (params, account_metas) = solana_sdk::program_utils::split_into_params_and_account_metas(input);
    let (buyer, seller, amount, deadline, status) = deserialize_state(&params);
    let mut escrow_account = Account::unpack(&account_metas[0].data).unwrap();
    let mut buyer_account = Account::unpack(&account_metas[1].data).unwrap();
    let mut seller_account = Account::unpack(&account_metas[2].data).unwrap();
    let escrow_state = match escrow_account.state().unwrap() {
        Some(data) => EscrowState::deserialize(&data).unwrap(),
        None => EscrowState::create_contract(&buyer, &seller, amount, deadline),
    };

    match status {
        EscrowStatus::Pending => {
            if let Err(err) = escrow_state.complete_contract() {
                return Err(err);
            }
            account::transfer(&buyer_account, &seller_account, amount).unwrap();
        }
        EscrowStatus::Cancelled => {
            if let Err(err) = escrow_state.cancel_contract() {
                return Err(err);
            }
            account::transfer(&escrow_account, &buyer_account, amount).unwrap();
        }
        EscrowStatus::Completed => {
            return Err("Contract has already been completed");
        }
    }

    escrow_account.set_state(&escrow_state.serialize().unwrap()).unwrap();
    Ok(vec![
        AccountMeta::new(buyer, true),
        AccountMeta::new(seller, true),
        AccountMeta::new(ESCROW_PROGRAM_ID, false),
    ])
}
