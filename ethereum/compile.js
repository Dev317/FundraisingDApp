const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const BUILD_FOLDER_NAME = 'build';
const CONTRACTS_FOLER_NAME = 'contracts';
const CAMPAIGN_CONTRACT_NAME = 'Campaign.sol';

const buildPath = path.resolve(__dirname, BUILD_FOLDER_NAME);
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, CONTRACTS_FOLER_NAME, CAMPAIGN_CONTRACT_NAME);
const sourceCode = fs.readFileSync(campaignPath, 'utf8');
const compiledCode = solc.compile(sourceCode, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in compiledCode) {
    fs.outputJsonSync(
        path.resolve(buildPath, `${contract.replace(':','')}.json`),
        compiledCode[contract]
    );

    console.log(compiledCode[contract]);

}