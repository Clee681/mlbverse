import { derived, writable } from "svelte/store";
import { browser } from "$app/env";
import { ethers } from "ethers";
import { data } from "$lib/contractData";
import type { Web3Provider } from "@ethersproject/providers";

export const ethProvider = writable<Web3Provider | undefined>(undefined);
export const currentAccount = writable<string>("");
export const connected = derived(currentAccount, ($currentAccount) => $currentAccount !== "");
export const signer = derived(ethProvider, ($ethProvider) => {
  return $ethProvider ? $ethProvider.getSigner() : undefined;
});
export const ticketsContract = derived(signer, ($signer) => {
  return $signer ? new ethers.Contract(data.tickets.address, data.tickets.abi, $signer) : undefined;
});
export const highlightsContract = derived(signer, ($signer) => {
  return $signer ? new ethers.Contract(data.highlights.address, data.highlights.abi, $signer) : undefined;
});

if (browser) {
  if (typeof window.ethereum !== "undefined") {
    console.log("isMetaMask:", window.ethereum.isMetaMask);
    console.log("Network:", window.ethereum.networkVersion);
    console.log("Current Account:", window.ethereum.selectedAddress);
    if (window.ethereum.selectedAddress) {
      currentAccount.set(window.ethereum.selectedAddress);
    }
    ethProvider.set(new ethers.providers.Web3Provider(window.ethereum));
    window.ethereum.on("accountsChanged", ([newAccount]) => {
      newAccount = newAccount || "";
      currentAccount.set(newAccount);
    });
    window.ethereum.on("chainChanged", (chainId) => {
      console.log("chainChanged event occured", chainId);
      window.location.reload();
    });
  } else {
    console.error("Please install MetaMask");
  }
}
