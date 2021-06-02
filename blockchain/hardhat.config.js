require("@nomiclabs/hardhat-waffle");
const fs = require("fs/promises");
const { task } = require("hardhat/config");

// Load secrets
require("dotenv").config();

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
    await saveDeploymentInfo(info, name, hre.network.name);
    console.log("Deployed to:", contract.address);
  });

task("mint", "Mints an NFT")
  .addParam("type", "Either Ticket or Highlight")
  .addParam("ownerAddress", "Owner of the newly minted NFT")
  .addParam("contentHash", "IPFS content hash of the newly minted NFT")
  .setAction(async (taskArgs, hre) => {
    const { contentHash, ownerAddress, type } = taskArgs;
    if (!["Ticket", "Highlight"].includes(type)) {
      throw new Error("Only minting of Tickets and Highlights supported");
    }
    const {
      contract: { address, abi },
    } = await loadDeploymentInfo(`${type}s`, hre.network.name);
    const provider = ethers.provider;
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    await mintToken(contract, ownerAddress, contentHash);
  });

task(
  "setTicketsContract",
  "Set the tickets contract address in the highlights contract"
)
  .addParam("contractAddress", "Address of the deployed tickets contract")
  .setAction(async (taskArgs, hre) => {
    const { contractAddress } = taskArgs;
    const {
      contract: { address, abi },
    } = await loadDeploymentInfo("Highlights", hre.network.name);
    const provider = ethers.provider;
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    const result = await contract.setTicketsContract(contractAddress);
    console.log(result);
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

async function saveDeploymentInfo(info, name, networkName) {
  const filename = deploymentInfoFilename(name, networkName);
  console.log(`Writing deployment info to ${filename}`);
  const content = JSON.stringify(info, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
  return true;
}

async function loadDeploymentInfo(name, networkName) {
  const filename = deploymentInfoFilename(name, networkName);
  console.log("Loading file:", filename);
  const content = await fs.readFile(filename, { encoding: "utf8" });
  return JSON.parse(content);
}

const deploymentInfoFilename = (name, networkName) =>
  `${name}ABI_${networkName}.json`;

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
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: {
        mnemonic: process.env.ACCOUNT_MNEMONIC,
      },
    },
  },
};
