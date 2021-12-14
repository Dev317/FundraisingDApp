require('dotenv').config()
const ethers = require('ethers');
const compiledCampaign = require('./build/Factory.json');
const PRIVATE_KEY = `0x${process.env.PRIVATE_KEY}`;
const ETHERSCAN_API_KEY = `${process.env.ETHERSCAN_API_KEY}`;
const INFURA_API_KEY = `${process.env.INFURA_API_KEY}`;

// The Contract interface
let abi = [
    "function createCampaign(uint minimum, uint fundingAmount) public",
    "function getDeployedCampaigns() public view returns(address[])",
];

// The bytecode from Solidity, compiling the above source
let bytecode = compiledCampaign.bytecode;

// Connect to the network
// let provider = ethers.getDefaultProvider(testNetworkName);
let provider = new ethers.providers.EtherscanProvider("rinkeby", ETHERSCAN_API_KEY);

// let provider = new ethers.providers.InfuraProvider(testNetworkName, INFURA_API_KEY);

// Load the wallet to deploy the contract with
let wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Deployment is asynchronous, so we use an async IIFE
(async function() {

    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, wallet);

    let contract = await factory.deploy();

    // The address the Contract WILL have once mined
    // See: https://rinkeby.etherscan.io/address/0xA3bE80A4479331447deCc2F1dCe7750c4c46E4F5
    let contractAddress = contract.address;
    console.log(`Contract is at address: ${contractAddress}`);
    // "0xA3bE80A4479331447deCc2F1dCe7750c4c46E4F5"

    // The transaction that was sent to the network to deploy the Contract
    // See: https://rinkeby.etherscan.io/tx/0x06fb42cb2900bd316daf1f71ff10b828dfd84acce1080d633e56ecd72db28fee
    console.log(`Contract creation transaction hash is: ${contract.deployTransaction.hash}`);
    // "0x06fb42cb2900bd316daf1f71ff10b828dfd84acce1080d633e56ecd72db28fee"

    // The contract is NOT deployed yet; we must wait until it is mined
    contract.deployed();
    // Done! The contract is deployed.
})();