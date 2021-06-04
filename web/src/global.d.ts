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
  on(event: string, callback: (a: string | array) => void);
}
