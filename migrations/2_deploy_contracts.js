var Factory = artifacts.require("Factory");
// var Campaign = artifacts.require("Campaign");

module.exports = function(deployer) {
  deployer.deploy(Factory);
};

// module.exports = function(deployer) {
//   deployer.deploy(Campaign);
// };