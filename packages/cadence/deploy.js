const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// emulator, testnet, mainnet
const NETWORK = "emulator";

const addAccounts = () => {
  exec(
    `flow accounts create -f ${path.resolve(__dirname, "flow.json")}`,
    (error, stdout, stderr) => {
      if (error?.message || stderr) {
        console.log(`error: ${error.message}`);
        return;
      }
      console.log(stdout);
    }
  );
};

const deployContracts = () => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];

  exec(`flow project deploy --network=${NETWORK}`, (error, stdout, stderr) => {
    if (error?.message || stderr) {
      console.log(`error: ${error.message}`);
      return;
    }

    const deployedContracts = {};
    const contractNames = Object.keys(flowJson.contracts);
    contractNames.forEach((cn) => {
      const cnAddress =
        flowJson.contracts[cn]?.aliases?.emulator ?? `0x${address}`;
      deployedContracts[`0x${cn}`] = cnAddress;
    });
    fs.writeFileSync(
      "../client/src/contracts.json",
      JSON.stringify(deployedContracts, 0, 2)
    );

    console.log(stdout);
    // create accounts if using emulator
    if (NETWORK === "emulator") {
      addAccounts();
    }
  });
};

const deploy = () => {
  if (fs.existsSync("./flow.json")) {
    deployContracts();
  } else {
    console.log("No existing flow file found, creating new one...");
    exec("flow init", (error, _, stderr) => {
      if (error?.message || stderr) {
        console.log(`error: ${error.message}`);
        return;
      }

      console.log("Initialized flow.json ...");
      deployContracts();
    });
  }
};

deploy();
