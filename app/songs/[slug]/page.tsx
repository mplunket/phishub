import { getSongFromSlug } from "@/lib/actions";
import { createClient } from "@/utils/supabase/server";

export default async function Song({ params }: { params: { slug: string } }) {

    const { slug } = params;

    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {

        const song = await getSongFromSlug(slug);

        if (song) {

            return (
                <>
                    <div className="flex items-center">
                        <div className="block">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">{song.song_name}</h1>
                            </div>
                            <div>
                                <h2 className="text-sm uppercase text-slate-400">{song.artist_name}</h2>
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                    >
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                This song does not have any content yet.
                            </h3>
                        </div>
                    </div>
                </>
            )

        }

    }

}