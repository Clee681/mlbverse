<script lang="ts">
  import type { StatsApiNS } from "$lib/types";

  let classNames = "";

  export let team: StatsApiNS.Team;
  export { classNames as class };
</script>

<img
  class={classNames}
  src={`https://www.mlbstatic.com/team-logos/team-cap-on-light/${team.id}.svg`}
  alt={`${team.abbreviation} Logo`}
/>
