pragma solidity ^0.4.17;

contract Factory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, uint fundingAmount) public {
        address newCampaign = new Campaign(minimum, fundingAmount, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address=>bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    uint public proposedFundingAmount;
    uint public currentFundingAmount;
    mapping(address=>bool) public approvers;
    uint public approverCount;
    Request[] public requests;

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, uint fundingAmount, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        proposedFundingAmount = fundingAmount;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approverCount++;
        currentFundingAmount += msg.value;
    }

    function createRequest(string description, 
                           uint value, 
                           address recipient) public onlyManager {
        Request memory newRequest = Request({
                        description   : description, 
                        value         : value, 
                        recipient     : recipient,
                        complete      : false,
                        approvalCount : 0
                        });

        // alternative instance creation
        // Request(description, value, recipient, false);
        
        // memory -> create a new copy
        // storage -> use an existing variable

        requests.push(newRequest);
    }

    function approveRequest(uint requestIdx) public {
        Request storage currentRequest = requests[requestIdx];
        
        require(approvers[msg.sender]);
        require(!currentRequest.approvals[msg.sender]);

        currentRequest.approvals[msg.sender] = true;
        currentRequest.approvalCount++;
    }

    function finalizeRequest(uint requestIdx) public onlyManager {
        Request storage currentRequest = requests[requestIdx];
        
        require(currentFundingAmount >= proposedFundingAmount);
        require(currentRequest.approvalCount > (approverCount/2));
        require(!currentRequest.complete);

        currentRequest.complete = true;
        currentRequest.recipient.transfer(currentRequest.value);
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approverCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}