import { createClient } from "@/utils/supabase/server";

export default async function Songs() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return (
            <>
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold md:text-2xl">Songs</h1>
                </div>
                <div
                    className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                >
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z
                        </h3>
                    </div>
                </div>
            </>
        )
    }

}