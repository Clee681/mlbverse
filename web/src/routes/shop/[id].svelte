<script context="module">
  export async function load({ page, fetch }) {
    const resp = await fetch(`/api/shop/${page.params.id}`);
    if (resp.ok) {
      const body = await resp.json();
      return { props: { data: body.data, highlightTokenId: page.params.id } };
    } else {
      return { props: { error: "Failed to fetch /api/shop/:id" } };
    }
  }
</script>

<script lang="ts">
  import type { MLBverseNS } from "$lib/types";
  import { ipfsUrl } from "$lib/utils";
  import { ethProvider, connected, currentAccount } from "$lib/stores/ethProvider";
  import PleaseConnect from "$lib/components/PleaseConnect.svelte";
  import { ethers } from "ethers";

  export let data: MLBverseNS.ShopItemData;
  export let highlightTokenId: number;

  let tickets = [];
  let highlight: MLBverseNS.Highlight;
  let highlightOwner;
  let signer: ethers.providers.JsonRpcSigner;
  let highlightsContract: ethers.Contract;
  let ticketsContract: ethers.Contract;

  $: {
    if ($connected && data) {
      signer = $ethProvider.getSigner();
      highlightsContract = new ethers.Contract(data.highlights.address, data.highlights.abi, signer);
      ticketsContract = new ethers.Contract(data.tickets.address, data.tickets.abi, signer);
      getUnredeemedTickets();
      setHighlight();
    }
  }

  async function getUnredeemedTickets() {
    const currentAccountTicketCount = await ticketsContract.balanceOf($currentAccount);
    let ticketTokens = [];
    for (let i = 0; i < currentAccountTicketCount; i++) {
      const tokenId = await ticketsContract.tokenOfOwnerByIndex($currentAccount, i);
      const alreadyRedeemed = await highlightsContract.redeemedTickets(tokenId);
      if (alreadyRedeemed) {
        continue;
      }
      const tokenURI = await ticketsContract.tokenURI(tokenId);
      ticketTokens.push({ tokenId, tokenURI });
    }
    const promises = ticketTokens.map(({ tokenId, tokenURI }) =>
      fetch(ipfsUrl(tokenURI))
        .then((r) => r.json())
        .then((j) => ({ ...j, tokenId }))
    );
    Promise.all(promises).then((ts) => (tickets = ts));
  }

  async function setHighlight() {
    const tokenURI = await highlightsContract.tokenURI(highlightTokenId);
    const owner = await highlightsContract.ownerOf(highlightTokenId);
    highlightOwner = owner;
    const resp = await fetch(ipfsUrl(tokenURI));
    if (resp.ok) {
      highlight = await resp.json();
    }
  }

  async function redeem(ticketTokenId: ethers.BigNumber) {
    const r = await highlightsContract.redeem(ticketTokenId, highlightTokenId);
    console.log(r);
  }
</script>

{#if $connected}
  <div class="px-32 flex flex-col lg:flex-row gap-4 my-12">
    <div class="flex flex-col flex-1 gap-4">
      <div class="w-full border border-gray-300 rounded-md">
        {#if highlight}
          <img class="w-full rounded-md" src={highlight.image} alt="Field Vision" />
        {:else}
          <img
            class="w-full rounded-md"
            src="https://lh3.googleusercontent.com/iJoQL40UzY-pBR7ijC7fXYYiKCqHnLo24_WLmwFsItCv3q5K3Mya0wMDy32fUvO9pHg0KBfrnpaU2Cf-pptQOzhO1dZJ-w89FyqP=w600"
            alt="Field Vision"
          />
        {/if}
      </div>
      {#if highlight}
        <div>
          <h2 class="text-3xl text-gray-700 font-semibold my-2">{highlight.name}</h2>
          <h6 class="text-sm text-gray-500 font-semibold">
            <span>Owned By:</span>
            <span class="text-blue-400">{highlightOwner}</span>
          </h6>
        </div>
      {/if}
      <div class="w-full border border-gray-300 rounded-md">
        <h2 class="p-4 font-semibold text-gray-700 border-b border-gray-300">Description</h2>
        {#if highlight}
          <p class="p-4 text-sm text-gray-500">{highlight.description}</p>
        {/if}
      </div>
    </div>
    <div class="flex flex-col flex-1">
      <div class="w-full border border-gray-300 rounded-md">
        <h2 class="p-4 font-semibold text-gray-700 border-b border-gray-300">Redeem With Tickets</h2>
        {#if tickets.length === 0}
          <p class="p-4 text-sm text-gray-500">
            Sorry, you have no redeemible tickets. You can purchase ticket stubs in our marketplace or get your own
            ticket stub from attending a game.
          </p>
        {:else}
          {#each tickets as t}
            <div class="flex items-baseline justify-between px-6 py-4 text-sm">
              <div class="text-gray-400">{`${t.section}-${t.row}-${t.seat}`}</div>
              <button class="uppercase text-purple-500 focus:outline-none" on:click={() => redeem(t.tokenId)}
                >Redeem</button
              >
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{:else}
  <PleaseConnect />
{/if}
