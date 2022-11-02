// SPDX-license-Identifier: UNLICENSED


pragma solidity ^0.8.0;


contract Transactions {
    uint256 transcationCounter;



    event Transfer(address from, address receiver, uint amount,string message, uint256 timestamp, string keyword);

    struct  TrasferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;

    } 
    TrasferStruct[] transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transcationCounter += 1;
        transactions.push(TrasferStruct(msg.sender, receiver, amount ,message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount ,message, block.timestamp, keyword);
    }

     function getAllTransactions() public view returns (TrasferStruct[] memory) {
        return transactions; 
    }

     function getTransactionCount() public view returns (uint256) {
        return transcationCounter;
    }



}