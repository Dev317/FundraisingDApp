import React, { Component } from 'react';
import factory from '../ethereum/factory.js';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns : campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(
            address => {
                return {
                    header      : address,
                    description : (<Link route={`/campaigns/${address}`}><a>View Campaign</a></Link>),
                    fluid       : true
                };
            }
        );

        return <Card.Group items={items} />;
    }

    render() {
        return(
            <Layout>
                <div >
                    <h3>Active campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button content="Create campaign" icon="add circle" primary style={{ marginBottom : 10}}/>
                        </a>
                    </Link>

                    {this.renderCampaigns()}
                    
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;