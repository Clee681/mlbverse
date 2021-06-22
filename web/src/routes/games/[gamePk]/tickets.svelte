<script context="module">
  import { STATS_API_BASE_URL } from "$lib/constants";

  export async function load({ page, fetch }) {
    const resp = await fetch(`/api/games/${page.params.gamePk}/tickets`);
    const gameResp = await fetch(`${STATS_API_BASE_URL}/api/v1.1/game/${page.params.gamePk}/feed/live`);
    if (resp.ok && gameResp.ok) {
      const body = await resp.json();
      const gameBody = await gameResp.json();
      return { props: { data: body, game: gameBody } };
    } else {
      return { props: { error: "Failed to fetch /api/games/:gamePk/tickets" } };
    }
  }
</script>

<script lang="ts">
  import { ethProvider, connected } from "$lib/stores/ethProvider";
  import { ethers } from "ethers";
  import type { MLBverseNS } from "$lib/types";
  import PleaseConnect from "$lib/components/PleaseConnect.svelte";
  import { ipfsUrl } from "$lib/utils";
  import { format, parseISO } from "date-fns";
  import TeamLogo from "$lib/components/TeamLogo.svelte";
  import Loading from "$lib/icons/loading.svelte";

  export let data: MLBverseNS.TicketsData;
  export let game: any;

  let tickets: MLBverseNS.Ticket[] = [];
  let signer: ethers.providers.JsonRpcSigner;
  let contract: ethers.Contract;
  let redeemLoading = false;
  let code = "";

  const fmt = (d: Date): string => format(d, "MMMM d, yyyy");
  const fmtTime = (d: Date): string => format(d, "h:mmaaa");

  $: {
    if ($connected && data.contract) {
      signer = $ethProvider.getSigner();
      contract = new ethers.Contract(data.contract.address, data.contract.abi, signer);
      setTickets();
    }
  }
  $: awayTeam = game?.gameData?.teams?.away;
  $: homeTeam = game?.gameData?.teams?.home;
  $: gameDate = parseISO(game?.gameData?.datetime?.dateTime);
  $: gameTime = fmtTime(gameDate);
  $: gameDay = fmt(gameDate);
  $: console.log("tickets available for redemption", tickets);

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
      .filter((t) => t.tokenId.toNumber() >= 12)
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

  async function redeemTicket() {
    redeemLoading = true;

    // Just grab the first available ticket for sale
    console.log("tickets available for redemption", tickets);

    if (tickets.length === 0) {
      console.error("there are no tickets available for redemption. are you sure you have the right code?");
    } else {
      const ticket = tickets[0];
      try {
        await buyTicket(ticket.tokenId);
      } catch (e) {
        console.error(e);
      }
    }

    redeemLoading = false;
  }
</script>

{#if $connected}
  <h2 class="text-center mt-20 text-4xl font-semibold text-gray-700">Redeem Your NFT Ticket</h2>
  <h4 class="text-center my-4 text-2xl text-gray-400 flex justify-center">
    <TeamLogo class="w-8 h-8 mr-2" team={awayTeam} />
    @
    <TeamLogo class="w-8 h-8 ml-2" team={homeTeam} />
  </h4>
  <h4 class="text-center mt-2 mb-8 text-xl text-gray-400">{gameTime} • {gameDay}</h4>
  <p class="text-center text-gray-700">Enter your code to redeem your NFT ticket now</p>
  <div class="flex justify-center mt-4">
    <input
      class="w-96 block bg-transparent border border-gray-300 rounded-md px-2 py-2 focus:outline-none"
      placeholder="Code"
      bind:value={code}
    />
    <button
      class="flex items-center bg-blue-500 px-4 py-2 ml-2 text-white rounded-lg border border-transparent focus:outline-none"
      disabled={redeemLoading}
      on:click={redeemTicket}
    >
      {#if redeemLoading}
        <Loading />
      {/if}
      Redeem
    </button>
  </div>
{:else}
  <PleaseConnect />
{/if}
