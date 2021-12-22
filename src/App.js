import * as React from "react";
import './App.css';
import { useEffect, useState } from "react";
require("dotenv").config();

export default function App() {
  //variable for save current user account
  const [currentAccount, setCurrentAccount] = useState("");
  const [inputValue, setInputValue] = useState("");


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      //ask metamask if eth account exist
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum){
        alert("Get Metamask");
        return;
      }

      //ask metamask to connect
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (err){
      console.log(err);
    }
  }

  useEffect(() => {
      checkIfWalletIsConnected();
  }, []);

  const onInputChange = (event) => {
    // recover value inside input and call useEffect
    const { value }= event.target;
    setInputValue(value);
  }

  const searchValue = () => {
    const wantNft = "true";
    const chainID = "137";
    fetch(`https://api.covalenthq.com/v1/${chainID}/address/${currentAccount}/balances_v2/?nft=${wantNft}&key=${process.env.covalentApiKey}`)
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(err => console.error(err));
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey! 👋
        </div>
        <div className="bio">
          You want to show all TOKEN and NFT are in your wallet, or some other, just enter public or connect your wallet (only metamask)
        </div>
        {/* if no current wallet connect */}
        {!currentAccount && (
          <>
            <div className="input-container"> 
              <input type="text" placeholder="Enter a wallet address" value={inputValue} onChange={onInputChange}/>
              <button type="submit" className="waveButton">Show me</button>
            </div>
            <div className="sized-box"></div>
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          </>
        )}

        {currentAccount && (
          <>
            <p>Wich chain?</p> {/* menu déroulant */}
            <p>NFT yes no</p>
            <button className="waveButton" onClick={searchValue}>Search</button>
          </>
        )

        }
      </div>
    </div>
  );
}
