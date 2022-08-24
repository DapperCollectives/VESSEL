const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
const { updateContractAddresses } = require("./updateContractAddresses");

// emulator, testnet, mainnet
const NETWORK = process.env.NETWORK ?? "emulator";
const FLOW_JSON = path.resolve(__dirname, "flow.json");
const FIAT_TX = "transactions/deploy_contract_with_auth.cdc";

const execPromise = (command) => new Promise((resolve, reject) => {
  exec(command, (error, stdout) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(stdout.trim());
  });
});

const addAccounts = async () => {
  await execPromise(`flow accounts create -f ${FLOW_JSON}`);
};

const deployFiatToken = async () => {
  const transactionArgs = [
    { type: "String", value: "FiatToken" }, // contractName
    { type: "String", value: "USDC" }, // tokenName
    { type: "String", value: "0.1.0" }, // version
    { type: "UFix64", value: "1000000000.00000000" }, // initTotalSupply
    { type: "Bool", value: false }, // initPaused,
  ];

  const txArgs = transactionArgs.map(ta => ta.value).join(" ");
  const execStr = `flow transactions send ${FIAT_TX} ${txArgs}`;

  await execPromise(execStr);
};

const deployContracts = () => {
  exec(`flow project deploy --network=${NETWORK}`, async (error, stdout, stderr) => {
    if (error?.message || stderr) {
      console.log(`error: ${error.message}`);
      return;
    }

    updateContractAddresses(NETWORK);

    console.log(stdout);
    // create accounts / deploy fiat if using emulator
    if (NETWORK === "emulator") {
      await addAccounts();
      await deployFiatToken();
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
