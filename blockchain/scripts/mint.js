const fs = require("fs/promises");
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function loadDeploymentInfo() {
  const content = await fs.readFile("deployment.json", { encoding: "utf8" });
  return JSON.parse(content);
}

async function mintToken(contract, ownerAddress, metadataURI) {
  // the smart contract adds an ipfs:// prefix to all URIs, so make sure it doesn't get added twice
  // metadataURI = stripIpfsUriPrefix(metadataURI);

  // Call the mintToken method to issue a new token to the given address
  // This returns a transaction object, but the transaction hasn't been confirmed
  // yet, so it doesn't have our token id.
  const tx = await contract.mintToken(ownerAddress, metadataURI);

  // The OpenZeppelin base ERC721 contract emits a Transfer event when a token is issued.
  // tx.wait() will wait until a block containing our transaction has been mined and confirmed.
  // The transaction receipt contains events emitted while processing the transaction.
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

async function main() {
  const {
    contract: { address, abi },
  } = await loadDeploymentInfo();
  const provider = new ethers.providers.JsonRpcProvider();
  const contract = new ethers.Contract(address, abi, provider.getSigner());
  // console.log(
  //   await contract.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc")
  // );
  // console.log(await contract.tokenURI("1"));
  // const id = await mintToken(
  //   contract,
  //   "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
  //   "QmVt96Z4Kb7i2zNtrk9JEkonRMLfEdrV2tUqH2ncbsWFhi"
  // );
  const id = await mintToken(
    contract,
    "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    "QmQynbxTVqtv8d41SNKJjZozTGAtsz2B3s69BUpzMxLSsx"
  );

  // console.log(id);
  // console.log(await contract.name());
  // console.log(await contract.ownerOf("1"));
  // await mintToken(
  //   contract,
  //   "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
  //   "Qmce7YNMSSRTyhmfziAXtcrQwqHj7aRhib2rMcKdeLRe29"
  // );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
