## MLB in the Metaverse

This is a proof of concept spike that explores tickets as NFTs. Tickets can be redeemed for highlights from the same game (also NFTs).

### Smart Contracts

Currently, there are 2 core concepts:

1. Tickets to a game
2. Highlights from a game

Both tickets and highlights are implemented as ERC-721 tokens.

#### Tickets

The general end-to-end flow for tickets is as follows:

- From an admin page, deploy a new NFT contract for a given game
- From an admin page, mint tickets for relevant seats
- From a public page, select a game to attend and view tickets
- From a public page, purchase a ticket
- At the gate, verify the ticket

#### Highlights

The general end-to-end flow for highlights is as follows:

- From an admin page, deploy a new NFT contract for a given game
- From an admin page, mint highlights for plays
- From a public page, allow ticket holders to redeem a highlight from the same game
- From a public page, allow highlight owners to list their highlights for sale
- From a public page, allow anyone to buy a listed highlight for sale
