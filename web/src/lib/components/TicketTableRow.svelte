<script lang="ts">
  import type { MLBverseNS } from "$lib/types";

  export let ticket: MLBverseNS.Ticket;
  export let buyCallback: () => Promise<any>;

  let loading = false;

  async function buy() {
    loading = true;
    try {
      await buyCallback();
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => (loading = false), 5000);
  }
</script>

<tr>
  <td class="td">{ticket.section}</td>
  <td class="td">{ticket.row}</td>
  <td class="td">{ticket.seat}</td>
  <td class="td">1 Ether</td>
  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <button
      class="text-indigo-600 w-16 hover:text-indigo-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
      on:click={buy}
    >
      {#if loading}
        <svg
          class="animate-spin mr-1 h-4 w-4 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      {/if}
      <span>Buy</span>
    </button>
  </td>
</tr>

<style lang="postcss">
  .td {
    @apply px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800;
  }
</style>
