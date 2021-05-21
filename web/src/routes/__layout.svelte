<script>
  import "../app.postcss";
  import WalletBtn from "$lib/components/WalletBtn.svelte";
</script>

<svelte:head>
  <title>MLBverse</title>
</svelte:head>

<nav class="h-16 border-b border-gray-100 shadow-sm flex items-center justify-center relative">
  <div class="text-2xl font-semibold text-gradient">MLBverse</div>
  <div class="absolute right-8">
    <WalletBtn />
  </div>
</nav>

<slot />

<style>
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500;
  }
</style>
