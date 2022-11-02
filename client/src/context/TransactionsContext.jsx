import React, {useState, useContext} from "react";

import {ethers} from 'ethers'
import { contractABI, contractAddress } from "../utils/Constants";
import { useEffect } from "react";



export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumCotract= () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer);
    return transactionContract
}




export const TransactionProvider = ({children}) =>{
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setisLoading] = useState(false);
    const [transactionCount, settransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions,setTransactions] = useState([]);

    const handleChange = (e,name) => {
        setformData((prevState)=>({...prevState, [name]: e.target.value}))
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please install metamask mister!")
            const transactionContract = getEthereumCotract();
            const availableTransactions = await transactionContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction)=>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18) 
                 
            }))
            console.log(structuredTransactions)
            setTransactions(structuredTransactions)
            


        } catch (error) {
            console.log(error)
        }
    }



   const checkIfWalletsIsConnected = async () => {
    try {
        

    if(!ethereum) return alert("Please install metamask mister!")

    const accounts = await ethereum.request({method: 'eth_accounts'})
    
    if(accounts.length){
        setCurrentAccount(accounts[0])
        getAllTransactions();
    }else{
        console.log('No accounts found')
    }
    console.log(accounts)
    } catch (error) {
        console.log(error);
        throw new Error("No ethereum object.")
    }




    ;

   }

   const checkIfTransactionsExist = async () => {
   
    try {
        const transactionContract = getEthereumCotract();
        const currentTransactionCount = await transactionContract.getTransactionCount();
        window.localStorage.setItem("transactionCount", currentTransactionCount)
    } catch (error) {
        console.log(error);
        throw new Error("No ethereum object.")
    }






   }








   const connectWallet = async () => {
    try{
        if(!ethereum) return alert("Please install metamask mister!")

        const accounts = await ethereum.request({method: 'eth_requestAccounts'})

        setCurrentAccount(accounts[0])
    } catch(error){
        console.log(error);
        throw new Error("No ethereum object.")
    }
   }

   const sendTransaction = async () => {
    try {
        if(!ethereum) return alert("Please install metamask mister!")
        console.log('1')


        const {addressTo,amount,keyword,message} = formData;
        console.log(formData)
        const transactionContract = getEthereumCotract();
        const parsedAmount = ethers.utils.parseEther(amount);
        console.log(addressTo)
        await ethereum.request({
            method: "eth_sendTransaction",
            params: [{
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            }]
          });
        console.log('1')
        const transactionHash= await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
        console.log('1')
        setisLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait()
        setisLoading(false);
        console.log(`Success - ${transactionHash.hash}`);
        const transactionCount = await transactionContract.getTransactionCount();
        settransactionCount(transactionCount.toNumber());
    } catch (error) {
        console.log(error);
    }
   }

   useEffect(()=>{
    checkIfWalletsIsConnected();
    checkIfTransactionsExist();
   },[]);



    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData,handleChange,sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}