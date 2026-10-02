"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

type TurnstileFieldProps = {
  /** Optional Turnstile action label for analytics (e.g. "sign-up"). */
  action?: string;
};

/**
 * Renders Cloudflare Turnstile and writes the token into a hidden
 * `captchaToken` field for the parent form's server action.
 *
 * Fail-closed when NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing outside
 * development: shows an error and no widget (parent should also hide submit).
 * In NODE_ENV=development with no site key, shows a bypass notice so local
 * signup still works without Cloudflare credentials.
 */
export function TurnstileField({ action }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [token, setToken] = useState("");

  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      return (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Turnstile site key not set. CAPTCHA is bypassed in development only
          (set <code className="font-mono">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>{" "}
          to test the widget locally).
        </p>
      );
    }

    return (
      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        Authentication is temporarily unavailable — CAPTCHA is not configured.
        Please try again later.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Turnstile
        siteKey={siteKey}
        onSuccess={setToken}
        onExpire={() => setToken("")}
        onError={() => setToken("")}
        options={action ? { action } : undefined}
      />
      <input type="hidden" name="captchaToken" value={token} />
    </div>
  );
}
