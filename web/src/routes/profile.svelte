<script lang="ts">
  import { connected, currentAccount, ticketsContract, highlightsContract } from "$lib/stores/ethProvider";
  import type { MLBverseNS } from "$lib/types";
  import PleaseConnect from "$lib/components/PleaseConnect.svelte";
  import { ipfsUrl } from "$lib/utils";

  let tickets: MLBverseNS.TicketWithRedemptionStatus[] = [];

  $: {
    if ($connected) {
      getTickets();
    }
  }

  async function getTickets() {
    const ownedSupply = await $ticketsContract.balanceOf($currentAccount);
    let tokens = [];
    for (let i = 0; i < ownedSupply; i++) {
      const tokenId = await $ticketsContract.tokenOfOwnerByIndex($currentAccount, i);
      const tokenURI = await $ticketsContract.tokenURI(tokenId);
      const isRedeemed = await $highlightsContract.redeemedTickets(tokenId);
      tokens.push({ tokenId, tokenURI, isRedeemed });
    }
    const ticketPromises = tokens.map(({ tokenId, tokenURI, isRedeemed }) =>
      fetch(ipfsUrl(tokenURI))
        .then((r) => r.json())
        .then((j) => ({ ...j, tokenId, isRedeemed }))
    );
    Promise.all(ticketPromises).then((ts) => (tickets = ts));
  }
</script>

<h2 class="text-3xl mt-12 mb-8 text-center font-bold text-gray-700">My Tickets</h2>
{#if $connected}
  <div class="flex flex-col w-full md:w-160 sm:mx-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="table-header">Section</th>
          <th scope="col" class="table-header">Row</th>
          <th scope="col" class="table-header">Seat</th>
          <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Redeemed
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each tickets as ticket}
          <tr>
            <td class="td">{ticket.section}</td>
            <td class="td">{ticket.row}</td>
            <td class="td">{ticket.seat}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
              {ticket.isRedeemed ? "Yes" : "No"}
            </td>
          </tr>
        {/each}
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
  .td {
    @apply px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800;
  }
</style>
