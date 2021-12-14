const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const MNEMONIC_PHRASE = 'suffer eight thank loud dose explain vote legend together inflict grow lesson';
const INFURA_API_KEY = 'https://rinkeby.infura.io/v3/2e5d5b3653fb4f408c5305b7b5490a42';

const provider = new HDWalletProvider(MNEMONIC_PHRASE, INFURA_API_KEY);
const web3 = new Web3(provider);

//solcjs --bin --abi ./ethereum/contracts/Campaign.sol --> compile the sol files

const bytecode = fs.readFileSync('__ethereum_contracts_Campaign_sol_Factory.bin').toString();

const abi = JSON.parse(fs.readFileSync('__ethereum_contracts_Campaign_sol_Factory.abi').toString());

const factoryContract = new web3.eth.Contract(abi);

// deploy to rinkeby
factoryContract.deploy({data:bytecode})
                .send({from:'0xdf4ff9023cf13cd918598e14d37b02c25350ff5f', gas:1500000, gasPrice:web3.utils.toWei('0.0000001', 'ether')})
                .then((newContractInstance) => {factoryContract.deploy.options.address = newContractInstance.options.address});