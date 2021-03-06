const localhostData = {
  highlights: {
    address: "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1",
    signerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    abi: [
      "constructor()",
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
      "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "function approve(address to, uint256 tokenId)",
      "function balanceOf(address owner) view returns (uint256)",
      "function getApproved(uint256 tokenId) view returns (address)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function mintToken(address owner, string metadataURI) returns (uint256)",
      "function name() view returns (string)",
      "function onERC721Received(address, address, uint256, bytes) returns (bytes4)",
      "function owner() view returns (address)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function redeem(uint256 _ticketId, uint256 _tokenId)",
      "function redeemedTickets(uint256) view returns (bool)",
      "function renounceOwnership()",
      "function safeTransferFrom(address from, address to, uint256 tokenId)",
      "function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)",
      "function setApprovalForAll(address operator, bool approved)",
      "function setTicketsContract(address _ticketsContractAddress)",
      "function supportsInterface(bytes4 interfaceId) view returns (bool)",
      "function symbol() view returns (string)",
      "function tokenByIndex(uint256 index) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function transferFrom(address from, address to, uint256 tokenId)",
      "function transferOwnership(address newOwner)",
    ],
  },
  tickets: {
    address: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    signerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    abi: [
      "constructor()",
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
      "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "function approve(address to, uint256 tokenId)",
      "function balanceOf(address owner) view returns (uint256)",
      "function buyTicket(uint256 _tokenId) payable",
      "function getApproved(uint256 tokenId) view returns (address)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function mintToken(address owner, string metadataURI) returns (uint256)",
      "function name() view returns (string)",
      "function onERC721Received(address, address, uint256, bytes) returns (bytes4)",
      "function owner() view returns (address)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function renounceOwnership()",
      "function safeTransferFrom(address from, address to, uint256 tokenId)",
      "function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)",
      "function setApprovalForAll(address operator, bool approved)",
      "function supportsInterface(bytes4 interfaceId) view returns (bool)",
      "function symbol() view returns (string)",
      "function tokenByIndex(uint256 index) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function transferFrom(address from, address to, uint256 tokenId)",
      "function transferOwnership(address newOwner)",
      "function withdraw()",
    ],
  },
};

const rinkebyData = {
  highlights: {
    address: "0x1e7716c9154581C2f06f018aAEbA7498895AE153",
    signerAddress: "0xbb2F91fEA03fabD291Cd8741B2D2B497763B21A5",
    abi: [
      "constructor()",
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
      "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "function approve(address to, uint256 tokenId)",
      "function balanceOf(address owner) view returns (uint256)",
      "function getApproved(uint256 tokenId) view returns (address)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function mintToken(address owner, string metadataURI) returns (uint256)",
      "function name() view returns (string)",
      "function onERC721Received(address, address, uint256, bytes) returns (bytes4)",
      "function owner() view returns (address)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function redeem(uint256 _ticketId, uint256 _tokenId)",
      "function redeemedTickets(uint256) view returns (bool)",
      "function renounceOwnership()",
      "function safeTransferFrom(address from, address to, uint256 tokenId)",
      "function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)",
      "function setApprovalForAll(address operator, bool approved)",
      "function setTicketsContract(address _ticketsContractAddress)",
      "function supportsInterface(bytes4 interfaceId) view returns (bool)",
      "function symbol() view returns (string)",
      "function tokenByIndex(uint256 index) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function transferFrom(address from, address to, uint256 tokenId)",
      "function transferOwnership(address newOwner)",
    ],
  },
  tickets: {
    address: "0x26C41d7fA2Ae0984B5941d20aEB010A1Cfa51F78",
    signerAddress: "0xbb2F91fEA03fabD291Cd8741B2D2B497763B21A5",
    abi: [
      "constructor()",
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
      "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "function approve(address to, uint256 tokenId)",
      "function balanceOf(address owner) view returns (uint256)",
      "function buyTicket(uint256 _tokenId) payable",
      "function getApproved(uint256 tokenId) view returns (address)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function mintToken(address owner, string metadataURI) returns (uint256)",
      "function name() view returns (string)",
      "function onERC721Received(address, address, uint256, bytes) returns (bytes4)",
      "function owner() view returns (address)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function renounceOwnership()",
      "function safeTransferFrom(address from, address to, uint256 tokenId)",
      "function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)",
      "function setApprovalForAll(address operator, bool approved)",
      "function supportsInterface(bytes4 interfaceId) view returns (bool)",
      "function symbol() view returns (string)",
      "function tokenByIndex(uint256 index) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function transferFrom(address from, address to, uint256 tokenId)",
      "function transferOwnership(address newOwner)",
      "function withdraw()",
    ],
  },
};

export const data = import.meta.env.VITE_ETH_NETWORK === "rinkeby" ? rinkebyData : localhostData;
