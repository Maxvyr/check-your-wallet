import * as React from "react";
import './App.css';
import { ethers } from "ethers"; 
import { useEffect, useState } from "react";
import axios from 'axios';

export default function App() {
  //variable for save current user account
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokens, setTokens]= useState([]);
  const [errorTokenCall, setErrorTokenCall] = useState("");


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

  const searchValue = () => {
    const wantNft = "true";
    const chainID = "137";
    axios.get(`https://api.covalenthq.com/v1/${chainID}/address/${currentAccount}/balances_v2/?nft=${wantNft}&key=${process.env.REACT_APP_COVALENT_API_KEY}`)
	.then((res) => {
    console.log(res.data.data.items);
    const list = res.data.data.items.filter(token => token.balance !== "0")
    console.log("list", list);
    setTokens(list);
  })
	.catch((err) => {
    console.error(err);
    setErrorTokenCall(err)
  });
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
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          </>
        )}

        {currentAccount && (
          <>
            <p>Add a desc</p> {/* menu déroulant */}
            <button className="waveButton" onClick={searchValue}>Search</button>
          </>
        )}

        {tokens.map((token, index) => {
          let balance = 0;
          let images = [];

          //filter diff token decimals for good showing
          if(token.contract_decimals === 18){
            balance = ethers.utils.formatEther(token.balance);
          } else if (token.contract_decimals === 6) {
            balance = token.balance / 1000000;
          } else {
            balance = token.balance;

          }
          
          //generate image list for nfts
          if(token.nft_data !== null) {
            console.log("So ->", token.nft_data[0].external_data.image);
            token.nft_data.forEach((nft) => {
              console.log(nft.external_data.image_256);
              images.push(nft.external_data.image_256);
            });
          } else {
            images.push(token.logo_url);
          }
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Token Name: {token.contract_name}</div>
              <div>{token.contract_ticker_symbol}</div>
              {images.map((img, index) => {
                return (
                  <img src={img} alt={token.contract_address} />
                )
              })}
              <div>Value: {balance}</div>
              </div>
          )
        })}
      </div>
    </div>
  );
}
