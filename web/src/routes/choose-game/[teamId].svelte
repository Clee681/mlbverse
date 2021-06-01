<script context="module" lang="ts">
  import { add } from "date-fns";
  import { STATS_API_BASE_URL } from "$lib/constants";
  import { fmtDate } from "$lib/utils";

  export async function load({ page }) {
    const teamId = page.params["teamId"];
    const start = new Date();
    const end = add(start, { days: 21 });
    const teamReq = fetch(`${STATS_API_BASE_URL}/teams/${teamId}`);
    const scheduleReq = fetch(
      `${STATS_API_BASE_URL}/schedule?sportId=1&startDate=${fmtDate(start)}&endDate=${fmtDate(end)}&teamId=${teamId}`
    );
    return Promise.all([teamReq, scheduleReq]).then(async ([teamResp, scheduleResp]) => {
      if (teamResp.ok && scheduleResp.ok) {
        const { teams } = await teamResp.json();
        const schedule = await scheduleResp.json();
        const games = schedule.dates.flatMap((d) => d.games).filter((g) => g.venue.id === teams[0].venue.id);
        return { props: { games } };
      }
      return { error: new Error(`Failed to load games`) };
    });
  }
</script>

<script lang="ts">
  import type { StatsApiNS } from "$lib/types";
  import { goto } from "$app/navigation";
  import { format, parseISO } from "date-fns";

  type Game = StatsApiNS.Game & { gameDate: Date };

  export let games: StatsApiNS.Game[];

  const fmt = (d: Date): string => format(d, "MMM d");
  const fmtDayOfWeek = (d: Date): string => format(d, "EEE");
  const fmtTime = (d: Date): string => format(d, "h:mmaaa");

  $: _games = games.map((g) => ({ ...g, gameDate: parseISO(g.gameDate) }));
</script>

<div class="max-w-4xl mx-auto mt-16">
  <button
    class="border border-gray-200 p-2 mb-4 rounded-md flex items-center text-gray-500 focus:outline-none"
    on:click={() => goto("/")}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    <span class="pl-1">Choose Team</span>
  </button>
  <div class="grid grid-cols-1 gap-4 mb-14">
    {#each _games as g}
      <div class="border border-gray-200 rounded-md p-4 flex items-center">
        <div class="pl-2 pr-8 w-40">
          <h4 class="font-medium">{fmt(g.gameDate)}</h4>
          <p class="text-gray-400 text-sm uppercase">
            <span>{fmtDayOfWeek(g.gameDate)}</span>
            <span>&middot;</span>
            <span>{fmtTime(g.gameDate)}</span>
          </p>
        </div>
        <div class="flex-grow">
          <h4 class="font-medium">{g.teams.away.team.name} @ {g.teams.home.team.name}</h4>
          <h6 class="text-gray-400 text-sm uppercase">{g.venue.name}</h6>
        </div>
        <div class="">
          <a
            href="/games/{g.gamePk}/tickets"
            class="px-4 py-2 text-sm text-white border rounded-md bg-gradient-to-r from-purple-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none"
            >View Tickets</a
          >
        </div>
      </div>
    {/each}
  </div>
</div>
