import { data } from "$lib/contractData";

export async function get({ params }) {
  const { gamePk } = params;

  return {
    body: {
      gamePk,
      contract: data.tickets,
    },
  };
}
