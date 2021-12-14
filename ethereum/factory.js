import web3 from './web3.js';
import Factory from './build/Factory.json';
// require('dotenv').config()
// const ethers = require('ethers');

const CONTRACT_ADDRESS =  '0xbb1c0Aa47fa09A895AbF508bc8FEB19Cb7Dbd412';
const instance = new web3.eth.Contract(JSON.parse(Factory.interface), CONTRACT_ADDRESS);
export default instance;