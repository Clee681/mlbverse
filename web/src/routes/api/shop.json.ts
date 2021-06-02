import { data } from "$lib/contractData";

export async function get() {
  return {
    body: {
      contract: data.highlights,
    },
  };
}
