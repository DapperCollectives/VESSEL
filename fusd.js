const { exec } = require("child_process");

const setupFUSD = () => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];

  const basePath = "./transactions";
  const setupFusdVault = `${basePath}/setup_fusd_vault.cdc`;
  const setupFusdMinter = `${basePath}/setup_fusd_minter.cdc`;
  const depositFusdMinter = `${basePath}/deposit_fusd_minter.cdc`;
  const mintFUSD = `${basePath}/mint_fusd.cdc`;

  exec(`flow transactions send ${setupFusdVault}`, (error, stdout, stderr) => {
    if (error?.message || stderr) {
      console.log(`error setting up fusd vault: ${error.message}`);
      return;
    }

    console.log(stdout);

    exec(
      `flow transactions send ${setupFusdMinter}`,
      (error, stdout, stderr) => {
        if (error?.message || stderr) {
          console.log(`error setting up fusd minter: ${error.message}`);
          return;
        }

        console.log(stdout);

        exec(
          `flow transactions send ${depositFusdMinter} 0x${address}`,
          (error, stdout, stderr) => {
            if (error?.message || stderr) {
              console.log(`error depositing fusd minter: ${error.message}`);
              return;
            }

            console.log(stdout);

            exec(
              `flow transactions send ${mintFUSD} 9999999.0 0x${address}`,
              (error, stdout, stderr) => {
                if (error?.message || stderr) {
                  console.log(`error mint fusd: ${error.message}`);
                  return;
                }

                console.log(stdout);
              }
            );
          }
        );
      }
    );
  });
};

setupFUSD();
