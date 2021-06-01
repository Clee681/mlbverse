<script lang="ts">
  import { ethProvider, currentAccount, connected } from "$lib/stores/ethProvider";
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";

  let hideUserProfile = true;
  let menuEl: HTMLDivElement;

  const connect = () => {
    if ($ethProvider) {
      if ($connected) {
        console.log("You are already connected!");
      } else {
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
      }
    } else {
      console.error("Provider not found.");
    }
  };

  const toggleUserProfile = () => (hideUserProfile = !hideUserProfile);

  onMount(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!hideUserProfile && !menuEl.contains(event.target as Node)) {
        hideUserProfile = true;
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (!hideUserProfile && event.key === "Escape") {
        hideUserProfile = true;
      }
    };

    // add events when element is added to the DOM
    document.addEventListener("click", handleOutsideClick, false);
    document.addEventListener("keyup", handleEscape, false);

    // remove events when element is removed from the DOM
    return () => {
      document.removeEventListener("click", handleOutsideClick, false);
      document.removeEventListener("keyup", handleEscape, false);
    };
  });
</script>

{#if $connected}
  <div class="flex items-center">
    <span class="rounded-full h-2 w-2 bg-green-400 mr-2" />
    <div class="text-sm text-green-400 mr-5">Wallet Connected</div>
    <div class="relative inline-block text-right text-gray-500" bind:this={menuEl}>
      <div>
        <button
          type="button"
          class="p-2 rounded-md hover:bg-gray-50 focus:outline-none"
          id="menuEl-button"
          on:click={toggleUserProfile}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>

      {#if !hideUserProfile}
        <div
          class="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          in:scale={{ duration: 100, start: 0.95 }}
          out:scale={{ duration: 75, start: 0.95 }}
        >
          <div class="py-1" role="none">
            <a href="/profile" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem"> Profile </a>
            <a href="/" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem"> Sign out </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <button
    class="px-4 py-3 rounded-md text-blue-600 bg-blue-50 uppercase text-sm hover:bg-blue-600 hover:text-white focus:outline-none"
    on:click={connect}>Connect Wallet</button
  >
{/if}
