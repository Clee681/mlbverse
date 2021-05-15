export namespace StatsApiNS {
  export type Team = {
    id: number;
    abbreviation?: string;
    name: string;
  };

  export type Game = {
    gamePk: number;
    gameDate: string;
    venue: Venue;
    teams: {
      away: TeamRecord;
      home: TeamRecord;
    };
  };

  export type Venue = {
    id: number;
    name: string;
  };

  export type TeamRecord = {
    team: Team;
  };
}
