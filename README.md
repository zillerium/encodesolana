Hackathon - Solana - Encode

Team
====


Trevor Oakley worked on this problem. It is an extension of the original peac.io problem which solves an escrow payment problem. The original 
solution is in solidity and polygon. This hackathon started the work to extend the solution to Solana.

Problem and Use Case
====================

The current solution in solidity need several steps to secure a full settlement - 
1. Contract deployment (time locked)
2. ERC20 and Escrow contracts have to get approvals and allowances to allow settlements.
3. Actual payments from the buyer to the contract an then the contract to the seller.

This process is long winded and needs to be improved; also the current solution is aimed at evm wallets but this should be widened.

This hackathon solution started the work to -

1. Connect to the Phantom wallet (browser initially but mobile is planned)
2. Interactions with the wallet - initially getbalance but later contract interactions via @solana/web3
3. Deloyment of the Solana program (smart contract in other systems) via the Solana Playground.
4. Client testing of the Solana program.

How the Project Works
=====================

Solana/web3 is used with ReactJS, and the Solana Playground for Rust deployment (devnet).

The ReactJS UI manages a connection to the wallet via the window object. Then a connection object allows interaction to the wallet. The SystemProgram is code for transfers (part of testing but the final solution does not need this). 

Demo UI
=======

See video.

Code
====

React - v18 and js - connection and window objects
Rust - not tested - escrow contract

Next Steps
==========

1. React can be used as the main UI but mobile wallets should be tested.
2. The actual Rust code could be deployed from the Playground but the web3 part needs to be done.
3. Escrow testing to see what improvements can be done.

