<script context="module">
  export async function load({ page, fetch }) {
    const resp = await fetch(`/api/games/${page.params.gamePk}/tickets`);
    if (resp.ok) {
      const body = await resp.json();
      return { props: { data: body } };
    } else {
      return { props: { error: "Failed to fetch /api/games/:gamePk/tickets" } };
    }
  }
</script>

<script lang="ts">
  import { ethProvider, connected } from "$lib/stores/ethProvider";
  import { ethers } from "ethers";
  import type { MLBverseNS } from "$lib/types";
  import TicketTableRow from "$lib/components/TicketTableRow.svelte";
  import PleaseConnect from "$lib/components/PleaseConnect.svelte";
  import { ipfsUrl } from "$lib/utils";

  export let data: MLBverseNS.TicketsData;

  let tickets: MLBverseNS.Ticket[] = [];
  let signer: ethers.providers.JsonRpcSigner;
  let contract: ethers.Contract;

  $: {
    if ($connected && data.contract) {
      signer = $ethProvider.getSigner();
      contract = new ethers.Contract(data.contract.address, data.contract.abi, signer);
      setTickets();
    }
  }

  async function setTickets() {
    const totalSupply = await contract.totalSupply();
    let tokens = [];
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.tokenByIndex(i);
      const tokenURI = await contract.tokenURI(tokenId);
      const owner = await contract.ownerOf(tokenId);
      tokens.push({ tokenId, tokenURI, owner });
    }
    const ticketPromises = tokens
      .filter((t) => t.owner === data.contract.address)
      .map(({ tokenId, tokenURI }) =>
        fetch(ipfsUrl(tokenURI))
          .then((r) => r.json())
          .then((j) => ({ ...j, tokenId }))
      );
    Promise.all(ticketPromises).then((ts) => (tickets = ts));
  }

  async function buyTicket(tokenId: string) {
    const r = await contract.buyTicket(tokenId, { value: ethers.utils.parseEther("1.0") });
    console.log(r);
  }
</script>

{#if $connected}
  <h2 class="text-center mt-20 text-4xl font-semibold text-gray-700">Tickets</h2>
  <h4 class="text-center mt-2 mb-14 text-2xl text-gray-400">Choose your seat</h4>
  <div class="flex flex-col w-full md:w-160 sm:mx-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="table-header">Section</th>
          <th scope="col" class="table-header">Row</th>
          <th scope="col" class="table-header">Seat</th>
          <th scope="col" class="table-header">Price</th>
          <th scope="col" class="relative px-6 py-3 w-16">
            <span class="sr-only">Add to cart</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each tickets as ticket}
          <TicketTableRow {ticket} buyCallback={() => buyTicket(ticket.tokenId)} />
        {/each}
        {#if tickets.length === 0}
          <tr>
            <td class="py-8 text-center text-gray-500" colspan="5">No tickets available</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
{:else}
  <PleaseConnect />
{/if}

<style lang="postcss">
  .table-header {
    @apply px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider;
  }
</style>
