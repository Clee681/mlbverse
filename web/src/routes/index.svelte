<script context="module" lang="ts">
  export async function load({}) {
    const res = await fetch("http://statsapi.mlb.com/api/v1/teams?sportId=1");
    if (res.ok) {
      const json = await res.json();
      return { props: { teams: json.teams } };
    }
    return { status: res.status, error: new Error(`Failed to load teams`) };
  }
</script>

<script lang="ts">
  import type { StatsApiNS } from "$lib/types";
  export let teams: StatsApiNS.Team[];

  console.log(teams);
</script>

<h2 class="text-center mt-12 text-4xl font-semibold text-gray-700">Get Your Tickets Now</h2>
<h4 class="text-center mt-2 mb-4 text-2xl text-gray-400">Choose a team</h4>
<div class="w-10/12 mx-auto pt-8">
  <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 2xl:gap-10 mb-14">
    {#each teams as team}
      <div
        class="w-full px-4 py-6 border border-gray-200 rounded-md cursor-pointer hover:shadow transform hover:-translate-y-1"
      >
        <img
          class="w-16 h-16 mx-auto"
          src={`https://www.mlbstatic.com/team-logos/team-cap-on-light/${team.id}.svg`}
          alt={`${team.abbreviation} Logo`}
        />
        <div class="mt-4 text-center text-gray-700">{team.name}</div>
      </div>
    {/each}
  </div>
</div>
