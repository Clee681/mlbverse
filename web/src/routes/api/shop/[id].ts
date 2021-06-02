import { data } from "$lib/contractData";

export async function get({ params }) {
  return {
    body: {
      data,
    },
  };
}
