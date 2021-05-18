// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const fs = require("fs/promises");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const TicketsFactory = await hre.ethers.getContractFactory("Tickets");
  const tickets = await TicketsFactory.deploy();

  await tickets.deployed();
  const info = deploymentInfo(hre, tickets);
  await saveDeploymentInfo(info);

  console.log("Tickets deployed to:", tickets.address);
}

function deploymentInfo(hardhat, contract) {
  return {
    network: hardhat.network.name,
    contract: {
      name: contract.name,
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };
}

async function saveDeploymentInfo(info) {
  const filename = "deployment.json";
  console.log(`Writing deployment info to ${filename}`);
  const content = JSON.stringify(info, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
  return true;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
