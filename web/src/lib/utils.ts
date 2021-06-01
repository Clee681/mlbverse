import { format } from "date-fns";

export const fmtDate = (d: Date) => format(d, "MM/dd/yyyy");

export const ipfsUrl = (tokenURI: string): string => `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
