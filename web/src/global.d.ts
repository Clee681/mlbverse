/// <reference types="@sveltejs/kit" />

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

export interface Ethereum {
  isMetaMask?: boolean;
  networkVersion: string;
  selectedAddress?: string;
}
