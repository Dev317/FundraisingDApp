import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes'; 

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        
        return {
            minimumContribution : summary[0],
            contractBalance     : summary[1],
            requestCount        : summary[2],
            approverCount       : summary[3],
            managerAddress      : summary[4],
            address             : props.query.address
        };
    }

    renderCards() {
        const {minimumContribution, contractBalance, requestCount, approverCount, managerAddress, address} = this.props;

        const items = [
            {
                header      :  address,
                meta        :  'Address of contract',
                description :  'This is the address of the contract',
                style       :  {overflowWrap : 'break-word'}
            },
            {
                header      :  managerAddress,
                meta        :  'Address of manager',
                description :  'Manager created the campaign',
                style       :  {overflowWrap : 'break-word'}
            },
            {
                header      :  minimumContribution,
                meta        :  'Minimum contribution (wei)',
                description :  'You must contribute at least this much wei to become an approver'
            },
            {
                header      :  requestCount,
                meta        :  'Number of requests',
                description :  'A request tries to withdraw money from the contract. Requests must be approved by approvers',
                style       :  {overflowWrap : 'break-word'}
            },
            {
                header      :  approverCount,
                meta        :  'Number of approvers',
                description :  'Number of people who have contributed to this campaign'
            },
            {
                header      :  web3.utils.fromWei(contractBalance, 'ether'),
                meta        :  'Campaign balance (ether)',
                description :  'Amount of money campaign has left to spend'
            },
        ];

        return <Card.Group items={items} />
    }
    
    render() {
        return (
            <Layout>
                <h3>Campaign details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}> {this.renderCards()} </Grid.Column>
                        <Grid.Column width={6}> <ContributeForm address={this.props.address} /> </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;