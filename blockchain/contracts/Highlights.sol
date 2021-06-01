// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Tickets.sol";

contract Highlights is ERC721URIStorage, ERC721Enumerable, ERC721Holder, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  Tickets private _ticketsContract;

  constructor() ERC721("Highlights", "FIELD_VISION") {
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return "ipfs://";
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function mintToken(address owner, string memory metadataURI) public returns (uint256) {
    _tokenIds.increment();

    uint256 id = _tokenIds.current();
    _safeMint(owner, id);
    _setTokenURI(id, metadataURI);

     return id;
  }

  // Custom

  mapping (uint256 => bool) public redeemedTickets;

  function redeem(uint256 _ticketId, uint256 _tokenId) external {
    require(!redeemedTickets[_ticketId], "Ticket has already been redeemed");
    require(ownerOf(_tokenId) == address(this), "Token is not available for redemption");
    require(_ticketsContract.ownerOf(_ticketId) == msg.sender, "Not ticket owner");
    redeemedTickets[_ticketId] = true;

    _approve(msg.sender, _tokenId);
    safeTransferFrom(address(this), msg.sender, _tokenId);
  }

  function setTicketsContract(address _ticketsContractAddress) public onlyOwner {
    _ticketsContract = Tickets(_ticketsContractAddress);
  }
}
