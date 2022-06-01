const fs = require("fs");
const { spawn } = require("child_process");

let chain;
const chainArgs = ["emulator", "--dev-wallet", "--verbose"];

if (fs.existsSync("./flow.json")) {
  chain = spawn("flow", chainArgs);
} else {
  console.log("No existing flow file found, creating new one...");
  exec("flow init", (error, stdout, stderr) => {
    if (error?.message || stderr) {
      console.log(`error: ${error.message || stderr}`);
      return;
    }

    console.log(stdout);
    chain = spawn("flow", chainArgs);
  });
}

chain.stdout.on("data", (data) => console.log(data.toString()));

chain.stderr.on("data", (data) => console.log(data.toString()));

chain.on("exit", (code) =>
  console.log("flow chain process exited with code " + code.toString())
);
