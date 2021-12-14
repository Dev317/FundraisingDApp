# FundraisingDApp
Online fundraising has always been plagued with scams where donation/contributions are often being misused. With the use of blockchain, fund usages are transparent to all contributors and they have the power of whether to approve a fund request by campaign owner. Overall, this is just one small yet effective application of blockchain in solving the issue of fund misuse.

# Tech Stack
* Solidity for smart contracts writing 
* Truffle for contracts compiling and deployment to Binance testnet
* Web3.js as library for interaction with Ethereum node
* Next.js as a framework for server-side rendering of React web-application

# How to deploy
Please follow this article:
https://medium.com/coinmonks/creating-deploying-a-smart-contract-using-truffle-framework-ganache-cli-part-2-f2dcf400fbde on how to compile and deploy contracts via Truffle.

Remeber to take note of the contract address to traceback the node for writing logic later on.

# How to run
Before running the app, please run `node test` to do testing on the smart contracts
Based on the config, `"dev": "node server.js"`, in the terminal run this command `node run dev`.
