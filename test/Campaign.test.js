const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const CAMPAIGN_FACTORY_CONTRACT = 'Factory.json'
const CAMPAIGN_CONTRACT = 'Campaign.json'

const web3 = new Web3(ganache.provider());
const compiledCampaignFactoryCode = require(`../ethereum/build/${CAMPAIGN_FACTORY_CONTRACT}`);
const compiledCampaignCode = require(`../ethereum/build/${CAMPAIGN_CONTRACT}`);

let accounts, factory, campaignAddress, campaign;
let minContribution = '100';
let minFundingAmount = '1000';

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactoryCode.interface))
                            .deploy({ data : compiledCampaignFactoryCode.bytecode })
                            .send({ from : accounts[0], gas : '1000000' }); 
    
    await factory.methods.createCampaign(minContribution, minFundingAmount)
                         .send({ from : accounts[0], gas : '1000000' });

    const [campaignAddress] = await factory.methods.getDeployedCampaigns()
                                                   .call();
    
    // campaign contract is already deployed, needs to parse json and retrieve addresss
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaignCode.interface), campaignAddress);
});

const convertToEth = (balance) => {
    balance = web3.utils.fromWei(balance, 'ether');
    return parseFloat(balance);
}

describe('Campaign', () => {
    it('Deployed a factory and a campaign contract', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Check if manager is the owner of campaign contract', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Check if contribution is sucessful', async() => {
        await campaign.methods.contribute().send({ value : '100', from : accounts[1]});
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        const aprroverCount = await campaign.methods.approverCount().call();
        assert.equal(true, isContributor);
        assert.equal(1, aprroverCount);
    });

    it('Check if minimum contribution is needed', async() => {
        try {
            await campaign.methods.contribute()
                                  .send({ value : '99', from : accounts[1]});
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it ('Manager can make a payment request', async() => {
        const description = "Buy batteries";
        const value = "100";
        await campaign.methods.createRequest(description, value, accounts[1])
                              .send({ from : accounts[0], gas : '1000000' });
        
        const request = await campaign.methods.requests(0).call();
        assert.equal(description, request.description);
        assert.equal(value, request.value);
    });

    it ('Processes request successful', async() => {
        let oldBalance = await web3.eth.getBalance(accounts[2]);
        oldBalance = convertToEth(oldBalance);

        await campaign.methods.contribute()
                              .send({ from : accounts[1], value : web3.utils.toWei('10', 'ether')});
        
        const description = "Buy batteries";
        const value = web3.utils.toWei('5', 'ether');
        await campaign.methods.createRequest(description, value, accounts[2])
                              .send({ from : accounts[0], gas : '1000000' });
        
        await campaign.methods.approveRequest(0)
                              .send({ from : accounts[1], gas : '1000000'});
        
        await campaign.methods.finalizeRequest(0)
                              .send({ from : accounts[0], gas : '1000000'});
        
        let newBalance = await web3.eth.getBalance(accounts[2]);
        newBalance = convertToEth(newBalance);
        
        assert(newBalance > oldBalance);
        assert(newBalance > 104);
    });
})