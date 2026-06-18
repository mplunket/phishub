import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Guard: If user is authenticated, enforce the private-beta allowlist and
    // profile completion before letting them into the app.
    if (user.data?.user) {
      const path = request.nextUrl.pathname;
      // Routes that an authenticated-but-not-yet-admitted user must still reach
      // (auth flow, the "you're on the list" page, static assets, etc.).
      const isOpenPath =
        path.startsWith("/api") ||
        path.startsWith("/auth") ||
        path.startsWith("/sign-in") ||
        path.startsWith("/sign-up") ||
        path.startsWith("/pending") ||
        path.startsWith("/public") ||
        path.startsWith("/_next");

      if (!isOpenPath) {
        // Private-beta gate: only allowlisted emails may enter the app. The RLS
        // policy on beta_allowlist limits this to the user's own email, so this
        // returns at most their own row.
        const email = user.data.user.email?.toLowerCase();
        const { data: allowed } = email
          ? await supabase
              .from("beta_allowlist")
              .select("email")
              .eq("email", email)
              .maybeSingle()
          : { data: null };

        if (!allowed) {
          return NextResponse.redirect(new URL("/pending", request.url));
        }

        // Profile completion guard (allowlisted users only). /create-profile is
        // itself gated by the allowlist above but must not require a profile.
        if (!path.startsWith("/create-profile")) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("user_id", user.data.user.id)
            .single();
          if (!profile) {
            return NextResponse.redirect(
              new URL("/create-profile", request.url)
            );
          }
        }
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
