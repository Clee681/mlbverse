<script context="module">
  export async function load({ fetch }) {
    const resp = await fetch(`/api/shop.json`);
    if (resp.ok) {
      const body = await resp.json();
      return { props: { data: body } };
    } else {
      return { props: { error: "Failed to fetch /api/shop" } };
    }
  }
</script>

<script lang="ts">
  import type { MLBverseNS } from "$lib/types";
  import { ipfsUrl } from "$lib/utils";
  import { ethProvider, connected } from "$lib/stores/ethProvider";
  import { ethers } from "ethers";
  import { goto } from "$app/navigation";

  export let data: MLBverseNS.ShopData;

  let highlights = [];
  let signer: ethers.providers.JsonRpcSigner;
  let contract: ethers.Contract;

  $: {
    if ($connected && data.contract) {
      signer = $ethProvider.getSigner();
      contract = new ethers.Contract(data.contract.address, data.contract.abi, signer);
      getHighlights();
    }
  }

  async function getHighlights() {
    const totalSupply = await contract.totalSupply();
    let tokens = [];
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.tokenByIndex(i);
      const tokenURI = await contract.tokenURI(tokenId);
      const owner = await contract.ownerOf(tokenId);
      tokens.push({ tokenId, tokenURI, owner });
    }
    const promises = tokens
      .filter((t) => t.owner === data.contract.address)
      .map(({ tokenId, tokenURI }) =>
        fetch(ipfsUrl(tokenURI))
          .then((r) => r.json())
          .then((j) => ({ ...j, tokenId }))
      );
    Promise.all(promises).then((ts) => (highlights = ts));
  }
</script>

<h2 class="text-3xl mt-12 mb-8 text-center font-bold text-gray-700">Shop</h2>

<div class="flex flex-wrap px-8 lg:px-32 gap-8">
  {#each highlights as highlight}
    <div
      class="w-72 flex flex-col justify-between border border-gray-300 rounded-md p-2 hover:transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
      on:click={() => goto(`/shop/${highlight.tokenId.toNumber()}`)}
    >
      <img class="mb-2 h-5/6 object-cover" src={highlight["image"]} alt={highlight["description"]} />
      <div>
        <p class="text-sm text-gray-400 w-full overflow-ellipsis whitespace-nowrap overflow-hidden">
          {highlight["name"]}
        </p>
        <p class="text-sm font-semibold text-gray-700">FieldVision #{highlight.tokenId.toNumber()}</p>
      </div>
    </div>
  {/each}
</div>
