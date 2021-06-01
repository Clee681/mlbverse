<script context="module">
  export async function load({ page, fetch }) {
    const resp = await fetch(`/api/games/123/tickets`);
    if (resp.ok) {
      const body = await resp.json();
      return { props: { data: body } };
    } else {
      return { props: { data: { not: "found" } } };
    }
  }
</script>

<script lang="ts">
  import { ethProvider, connected, currentAccount } from "$lib/stores/ethProvider";
  import type { MLBverseNS } from "$lib/types";
  import { ipfsUrl } from "$lib/utils";
  import { ethers } from "ethers";

  export let data: MLBverseNS.TicketsData;

  let tickets: MLBverseNS.Ticket[] = [];
  let signer: ethers.providers.JsonRpcSigner;
  let contract: ethers.Contract;

  $: {
    if ($connected && data.contract) {
      signer = $ethProvider.getSigner();
      contract = new ethers.Contract(data.contract.address, data.contract.abi, signer);
      getTickets(contract);
    }
  }

  async function getTickets(contract: ethers.Contract) {
    const ownedSupply = await contract.balanceOf($currentAccount);
    let tokens = [];
    for (let i = 0; i < ownedSupply; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex($currentAccount, i);
      const tokenURI = await contract.tokenURI(tokenId);
      tokens.push({ tokenId, tokenURI });
    }
    const ticketPromises = tokens.map(({ tokenId, tokenURI }) =>
      fetch(ipfsUrl(tokenURI))
        .then((r) => r.json())
        .then((j) => ({ ...j, tokenId }))
    );
    Promise.all(ticketPromises).then((ts) => (tickets = ts));
  }
</script>

<h2 class="text-center mt-20 text-4xl font-semibold text-gray-700">My Tickets</h2>

{#each tickets as ticket}
  <div class="text-center py-4 mt-4 mx-auto border border-gray-500 rounded-md w-52 text-gray-500">
    {ticket.section}-{ticket.row}-{ticket.seat}
  </div>
{/each}
