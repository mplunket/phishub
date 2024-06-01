import { getSongFromSlug, getTabsFromSong } from "@/lib/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Song({ params }: { params: { slug: string } }) {

    const { slug } = params;

    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Retrieve Song data
    const song = await getSongFromSlug(slug);

    if (song) {

        // Retrieve Tab data
        const tabs = await getTabsFromSong(song.id);
        console.log(tabs);
        let tabContent = null;

        if (tabs && tabs.length > 0) {
            tabContent = JSON.stringify(tabs);
            if (tabs[0].content) {
                // Fetch content of Tab
                const res = await fetch(tabs[0]?.content);
                if (!res.ok) {
                    throw new Error('Failed to fetch tab content');
                }
                tabContent = (await res.text()).replace('\n', '');
            }
        }

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
                {tabContent ? <div className="font-mono whitespace-pre-wrap text-[0.55rem] md:text-base">{tabContent}</div> : <h3 className=" py-20 text-center">This song has no content yet.</h3>}
            </>
        )

    }

}