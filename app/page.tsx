import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import Splash from "@/components/Splash";


export default async function Index() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">My Favorites</h1>
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no favorites
            </h3>
            <p className="text-sm text-muted-foreground px-4 py-2">
              Click the <HeartIcon className="inline h-4 w-4 hover:fill-red-400 cursor-pointer" /> button by any song, tab, performance, or lesson to add it to your My Favorites list.
            </p>
            <Button className="mt-4">View Songs</Button>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <Splash />
    )
  }

}