"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function WaitlistForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const referrer_url = typeof window !== "undefined" ? document.referrer : "";
    const { error } = await supabase.from("waitlist").insert({
      email,
      source,
      referrer_url,
    });
    setStatus(error ? "error" : "success");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 mt-6 w-80"
    >
      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="waitlist-email" className="text-lg text-left">
          Email Address
        </Label>
        <Input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to join the waitlist"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Join Waitlist
      </Button>
      {status === "success" && (
        <span className="text-green-600 mt-2">You're on the list!</span>
      )}
      {status === "error" && (
        <span className="text-red-600 mt-2">Error, try again.</span>
      )}
    </form>
  );
}
