const { exec } = require("child_process");
const { stdout, stderr } = require("process");

const deployNFTCollection = () => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];

  const basePath = "./transactions";
  const createCollection = `${basePath}/create_collection.cdc`;
  const mintNFT = `${basePath}/mint_nft.cdc`;
  const sendNFT = `${basePath}/send_nft_to_treasury.cdc`;

  exec(`flow transactions send ${createCollection}`,
    (error, stdout, stderr) => {
      if (error?.message || stderr) {
        console.log(`error creating collection: ${error.message}`);
        return;
      }
      
      console.log(stdout);

      exec(
        `flow transactions send ${mintNFT} 0x${address} testName testDescription https://i.natgeofe.com/n/46b07b5e-1264-42e1-ae4b-8a021226e2d0/domestic-cat_thumb.jpg`,
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
    });
};

deployNFTCollection();
