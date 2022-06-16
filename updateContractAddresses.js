const fs = require("fs");

module.exports.updateContractAddresses = (network) => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];
  const contractNames = Object.keys(flowJson.contracts);
  const deployedContracts = {};

  contractNames.forEach((cn) => {
    const cnAddress =
      flowJson.contracts[cn]?.aliases?.[network] ?? `0x${address}`;

    deployedContracts[`0x${cn}`] = cnAddress;
  });

  fs.writeFileSync(
    "./packages/client/src/contracts.json",
    JSON.stringify(deployedContracts, 0, 2)
  );
};

if (require.main === module) {
  // emulator, testnet, mainnet
  const NETWORK = process.env.NETWORK ?? "emulator";

  module.exports.updateContractAddresses(NETWORK);
}
