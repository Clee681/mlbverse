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

export namespace MLBverseNS {
  export type TicketsData = {
    gamePk: string;
    contract: Contract;
  };

  export type ShopData = {
    contract: Contract;
  };

  export type ShopItemData = {
    highlights: Contract;
    tickets: Contract;
  };

  export type Contract = {
    address: string;
    signerAddress: string;
    abi: string[];
  };

  export type Ticket = {
    tokenId: string;
    attributes: Attribute[];
    section: number;
    row: number;
    seat: number;
  };

  export type Attribute = {
    trait_type: string;
    value: string;
  };

  export type TicketWithRedemptionStatus = Ticket & { isRedeemed: boolean };

  export type Highlight = {
    name: string;
    description: string;
    external_url: string;
    animation_url: string;
    image: string;
  };
}
