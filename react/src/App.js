import React, {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
import logo from './logo.svg';
import './App.css';
import {Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, 
	ConnectionConfig, PublicKey, Keypair } from '@solana/web3.js';


function App() {

 const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );

      /*
       * Set the user's publicKey in state to be used later!
       */
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻 ');
    }
  };

const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

async function getBalance(connWalletAddress) {
  let connection;
  if (window?.solana?.isPhantom) {
//    if (!publicKey) {
    console.log('Phantom wallet found!');
   const response = await window.solana.connect({ onlyIfTrusted: true });
  console.log('Connected with Public Key:', response.publicKey.toString());
console.log("response ", response);
    connection = new Connection('https://api.devnet.solana.com');
	  console.log("conn == ", connection);
  } else {
    console.log('Solana object not found! Get a Phantom Wallet 👻 ');
  }

	console.log("connWalletAddress ", connWalletAddress);
	console.log("keypair ", Keypair);
//	console.log("keypair ", Keypair.connWalletAddress);
	//const publicKey = new PublicKey(Buffer.from(connWalletAddress, 'utf8'));
	const publicKey = new PublicKey(connWalletAddress.walletAddress);
	console.log(publicKey);
	console.log(connection);
	const balance = await connection.getBalance(publicKey);
// const account = new Account(connection, new PublicKey(publicKey));
	//
 // const balance = await account.getBalance();
  console.log(`Balance of account ${publicKey}: ${balance}`);
}


async function payWallet(connWalletAddress) {
console.log("buffer - ", Buffer);
	let connection;
  if (window?.solana?.isPhantom) {
//    if (!publicKey) {
    console.log('Phantom wallet found!');
   const response = await window.solana.connect({ onlyIfTrusted: true });
  console.log('Connected with Public Key:', response.publicKey.toString());
console.log("response ", response);
    connection = new Connection('https://api.devnet.solana.com');
	  console.log("conn == ", connection);
  } else {
    console.log('Solana object not found! Get a Phantom Wallet 👻 ');
  }

	console.log("connWalletAddress ", connWalletAddress);
	console.log("keypair ", Keypair);
//	console.log("keypair ", Keypair.connWalletAddress);
	//const publicKey = new PublicKey(Buffer.from(connWalletAddress, 'utf8'));
	const publicKey = new PublicKey(connWalletAddress.walletAddress);
	console.log(publicKey);
	console.log(connection);
	const toPublicKey1 = "4dGDp3BuTaXiqJwwJhh9abUBBm6hMhRkidttr5N4Cemm";
        const toPublicKey = new PublicKey(toPublicKey1);
	console.log("to public key ", toPublicKey);
	console.log(Buffer);
	const testbuffer = Buffer.from('hello', 'utf8');
	console.log(testbuffer, 'test');
	let transaction = new Transaction();
	transaction.add(
           SystemProgram.transfer({
               fromPubKey: publicKey,
	       toPubKey: toPublicKey1,
	       lamports: 1000	   
	   }),
	);
//	const balance = await connection.getBalance(publicKey);
// const account = new Account(connection, new PublicKey(publicKey));
	//
 // const balance = await account.getBalance();
 // console.log(`Balance of account ${publicKey}: ${balance}`);
}

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
	     {!walletAddress && renderNotConnectedContainer()}
	     {walletAddress && <div> wallet address connected {walletAddress}</div>}
             {walletAddress && <div><button onClick={()=>getBalance({walletAddress})}>balance </button></div>}
             {walletAddress && <div><button onClick={()=>payWallet({walletAddress})}>pay </button></div>}

      </header>
    </div>
  );
}

export default App;
