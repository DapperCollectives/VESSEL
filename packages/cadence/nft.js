const { exec } = require("child_process");
const path = require("path");

const deployNFTCollection = () => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];

  const sendCollection = path.resolve(
    __dirname,
    "transactions/send_collection_to_treasury.cdc"
  );
  const mintNFT = path.resolve(__dirname, "transactions/mint_nft.cdc");
  const sendNFT = path.resolve(
    __dirname,
    "transactions/send_nft_to_treasury.cdc"
  );

  exec(
    `flow transactions send ${sendCollection} 0x${address}`,
    (error, stdout, stderr) => {
      if (error?.message || stderr) {
        console.log(`error sending collection: ${error.message}`);
        return;
      }

      console.log(stdout);

      exec(
        `flow transactions send ${mintNFT} 0x${address} testName testDescription testThumbnail.jpg`,
        (error, stdout, stderr) => {
          if (error?.message || stderr) {
            console.log(`error minting nft: ${error.message}`);
            return;
          }

          console.log(stdout);

          exec(
            `flow transactions send ${sendNFT} 0x${address} 0`,
            (error, stdout, stderr) => {
              if (error?.message || stderr) {
                console.log(`error sending nft: ${error.message}`);
                return;
              }

              console.log(stdout);
            }
          );
        }
      );
    }
  );
};

deployNFTCollection();
