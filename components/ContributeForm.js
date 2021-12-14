import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react'; 
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';


class ContributeForm extends Component {
    state = {
        value : '',
        loading : false,
        errorMessage : ''
    };
    
    onSubmit = async (event) => {
        event.preventDefault();
        
        const campaignAddress = this.props.address;
        const campaign = Campaign(campaignAddress)

        this.setState({ loading : true, errorMessage : '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute()
                                .send({ from : accounts[0], value : web3.utils.toWei(this.state.value, 'ether') });
            Router.replaceRoute(`/campaigns/${campaignAddress}`);
        } catch (error) {
            this.setState({ errorMessage : error.message});
        }

        this.setState({ loading : false, value : '' });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        value = {this.state.value}
                        onChange = {event => this.setState({ value : event.target.value})}
                        label='ether'
                        labelPosition='right'
                    />
                </Form.Field>
                <Message error heder="Oops!" content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>Contribute!</Button>
            </Form>
        );
    }
}

export default ContributeForm;