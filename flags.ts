import { flag } from "flags/next";

export const waitlistDisabled = flag({
  key: "waitlist-disabled",
  description: "Disable waitlist mode for go-live",
  decide() {
    // Default: false. Set to true in Vercel dashboard or by targeting.
    return false;
  },
});
