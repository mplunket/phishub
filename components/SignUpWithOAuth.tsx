"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function SignInWithOAuth() {

    const supabase = createClient();

    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                'redirectTo': `${origin}/auth/callback`,
            }
        })
    }

    return (
        <Button variant="outline" className="w-full"
            onClick={signInWithGoogle}>
            Sign In with Google
        </Button>
    );
}