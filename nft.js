const { exec } = require("child_process");

const deployNFTCollection = () => {
  const flowJson = require("./flow.json");
  const accountName = Object.keys(flowJson.accounts)[0];
  const { address } = flowJson.accounts[accountName];

  const basePath = "./transactions";
  const mintNFT = `${basePath}/mint_nft.cdc`;
  const sendNFT = `${basePath}/send_nft_to_treasury.cdc`;

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
};

deployNFTCollection();
