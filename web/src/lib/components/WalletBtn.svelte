<script lang="ts">
  import { ethProvider, currentAccount } from "$lib/stores/ethProvider";

  const connect = () => {
    if ($ethProvider) {
      $ethProvider.provider
        .request({ method: "eth_requestAccounts" })
        .then(([account]) => ($currentAccount = account))
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("Please connect to MetaMask.");
          } else {
            console.error(error);
          }
        });
    } else {
      console.error("Provider not found.");
    }
  };

  $: connected = $currentAccount !== "";
</script>

{#if connected}
  <div class="px-4 py-3 rounded-md text-sm border border-blue-300 text-blue-500">Wallet Connected</div>
{:else}
  <button
    class="px-4 py-3 rounded-md text-blue-600 bg-blue-50 uppercase text-sm hover:bg-blue-600 hover:text-white focus:outline-none"
    on:click={connect}>Connect Wallet</button
  >
{/if}
