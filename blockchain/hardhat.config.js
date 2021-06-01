require("@nomiclabs/hardhat-waffle");
const fs = require("fs/promises");
const { task } = require("hardhat/config");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploys specified contract")
  .addParam("name", "The contract's name")
  .setAction(async (taskArgs, hre) => {
    await run("compile");
    const { name } = taskArgs;
    console.log("Deploying:", name);
    const factory = await hre.ethers.getContractFactory(name);
    const contract = await factory.deploy();
    await contract.deployed();
    const info = deploymentInfo(hre, contract);
    await saveDeploymentInfo(info, name);
    console.log("Deployed to:", contract.address);
  });

task("mint", "Mints an NFT")
  .addParam("type", "Either Ticket or Highlight")
  .addParam("ownerAddress", "Owner of the newly minted NFT")
  .addParam("contentHash", "IPFS content hash of the newly minted NFT")
  .setAction(async taskArgs => {
    const { contentHash, ownerAddress, type } = taskArgs;
    if (!["Ticket", "Highlight"].includes(type)) {
      throw new Error("Only minting of Tickets and Highlights supported");
    }
    const {
      contract: { address, abi },
    } = await loadDeploymentInfo(`${type}s`);
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    await mintToken(contract, ownerAddress, contentHash);
  });

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

async function saveDeploymentInfo(info, name) {
  const filename = deploymentInfoFilename(name);
  console.log(`Writing deployment info to ${filename}`);
  const content = JSON.stringify(info, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
  return true;
}

async function loadDeploymentInfo(name) {
  const filename = deploymentInfoFilename(name);
  const content = await fs.readFile(filename, { encoding: "utf8" });
  return JSON.parse(content);
}

const deploymentInfoFilename = name => `${name}ABI.json`;

async function mintToken(contract, ownerAddress, metadataURI) {
  const tx = await contract.mintToken(ownerAddress, metadataURI);
  const receipt = await tx.wait();
  for (const event of receipt.events) {
    if (event.event !== "Transfer") {
      console.log("ignoring unknown event type ", event.event);
      continue;
    }
    return event.args.tokenId.toString();
  }

  throw new Error("unable to get token id");
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
};
