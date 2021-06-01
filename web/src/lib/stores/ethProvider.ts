import { derived, writable } from "svelte/store";
import { browser } from "$app/env";
import { ethers } from "ethers";
import type { Web3Provider } from "@ethersproject/providers";

export const ethProvider = writable<Web3Provider | undefined>(undefined);
export const currentAccount = writable<string>("");
export const connected = derived(currentAccount, ($currentAccount) => $currentAccount !== "");

if (browser) {
  if (typeof window.ethereum !== "undefined") {
    console.log("isMetaMask:", window.ethereum.isMetaMask);
    console.log("Network:", window.ethereum.networkVersion);
    console.log("Current Account:", window.ethereum.selectedAddress);
    if (window.ethereum.selectedAddress) {
      currentAccount.set(window.ethereum.selectedAddress);
    }
    ethProvider.set(new ethers.providers.Web3Provider(window.ethereum));
  } else {
    console.error("Please install MetaMask");
  }
}
