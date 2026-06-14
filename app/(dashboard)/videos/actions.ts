"use server";

import { getVideosPage } from "@/lib/api";

// Read action used by the videos infinite-scroll grid to fetch the next page
// from a Client Component.
export async function fetchVideosPage(page: number, pageSize: number) {
  return getVideosPage(page, pageSize);
}
