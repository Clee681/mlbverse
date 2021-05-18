const { expect } = require("chai");

describe("Tickets", function () {
  xit("should be able to mint new tickets", async function () {
    const Tickets = await ethers.getContractFactory("Tickets");
    const tickets = await Tickets.deploy();
    // TODO: Figure out how to get actual ETH address in test
    const addr = "0x123";

    await tickets.deployed();

    expect(await tickets.balanceOf(addr)).to.equal(0);
    // TODO: use a real IPFS content hash
    await tickets.mintToken(addr, "123");
    expect(await tickets.balanceOf(addr)).to.equal(1);
  });
});
