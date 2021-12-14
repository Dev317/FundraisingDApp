const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/Factory.json');

const MNEMONIC_PHRASE = 'suffer eight thank loud dose explain vote legend together inflict grow lesson';
const INFURA_API_KEY = 'https://rinkeby.infura.io/v3/2e5d5b3653fb4f408c5305b7b5490a42';

const provider = new HDWalletProvider(MNEMONIC_PHRASE, INFURA_API_KEY);
const web3 = new Web3(provider);

// let gasprice;
// let gaslimit;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from account address: ${accounts[0]}`);
  // console.log(compiledFactory.interface);
  // gasprice = await web3.eth.getGasPrice() * 100 + 10;
  // let block = await web3.eth.getBlock("latest");
  // gaslimit = block.gasLimit / 10 + 10;
  // gaslimit = Number(gaslimit);
  // console.log(`Gas price: ${gasprice}`);
  // console.log(`Gas limit: ${gaslimit}`);


  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas : 650000, gasPrice : '100000000000'});

  console.log(`Contract deployed at address: ${result.options.address}`);
};

deploy();