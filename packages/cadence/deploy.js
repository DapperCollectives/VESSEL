const fs = require("fs");
const { exec } = require("child_process");

// emulator, testnet, mainnet
const NETWORK = "emulator";

const deployContracts = (address, contractNames) => {
  exec(`flow project deploy --network=${NETWORK}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    const deployedContracts = {};
    contractNames.forEach((cn) => {
      deployedContracts[`0x${cn}`] = `0x${address}`;
    });
    fs.writeFileSync(
      "../client/src/contracts.json",
      JSON.stringify(deployedContracts, 0, 2)
    );

    console.log(stdout);
  });
};

const getContractNames = (dir) => {
  const contractNames = [];
  let dirent;
  while ((dirent = dir.readSync()) !== null) {
    if (dirent.name.includes(".cdc")) {
      const contractName = dirent.name.replace(".cdc", "");
      contractNames.push(contractName);
    }
  }
  dir.closeSync();

  return contractNames;
};

const addContracts = () => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];

  const dir = fs.opendirSync("./contracts");
  const contractNames = getContractNames(dir);
  deployContracts(address, contractNames);
};

const deploy = () => {
  if (fs.existsSync("./flow.json")) {
    addContracts();
  } else {
    console.log("No existing flow file found, creating new one...");
    exec("flow init", (error, _, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log("Initialized flow.json ...");
      addContracts();
    });
  }
};

deploy();
