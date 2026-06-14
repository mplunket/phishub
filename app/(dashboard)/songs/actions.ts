"use server";

import { getSongsPage } from "@/lib/api";

// Read action used by the songs infinite-scroll list to fetch the next page
// from a Client Component.
export async function fetchSongsPage(page: number, pageSize: number) {
  return getSongsPage(page, pageSize);
}
