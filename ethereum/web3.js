import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // in the browser and metamask is running
    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else {
    // in the server or user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
    web3 = new Web3(provider);
}

// console.log(web3);
export default web3;