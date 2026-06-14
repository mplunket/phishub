"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect("error", "/reset-password", "Password update failed");
  }

  return encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function createSong(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const song = (formData.get("song") as string)?.trim();
  const artist = (formData.get("artist") as string)?.trim();
  const debut = formData.get("debut") as string;
  const lyrics = formData.get("lyrics") as string;

  if (!song) throw new Error("Song title is required");

  // Derive a URL-safe slug from the title.
  const slug = song
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { error } = await supabase.from("songs").insert({
    song,
    slug,
    artist: artist || null,
    debut: debut || null,
    lyrics: lyrics || null,
  });

  if (error) throw error;

  revalidatePath("/songs");
}

export async function createTab(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Contributor license acknowledgement (see /content-policy). Enforced here as
  // well as in the UI so the grant can't be bypassed by a crafted request.
  if (formData.get("agree") !== "yes") {
    throw new Error("You must accept the content policy to submit a tab");
  }

  const songId = formData.get("songId") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase.from("tabs").insert({
    song_id: songId,
    content,
    type,
    author_id: user.id,
  });

  if (error) throw error;

  if (slug) revalidatePath(`/songs/${slug}`);
  revalidatePath("/tabs");
}

export async function updateTab(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (formData.get("agree") !== "yes") {
    throw new Error("You must accept the content policy to save a tab");
  }

  const tabId = formData.get("tabId") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;
  const revalidate = formData.get("revalidate") as string;

  if (!tabId) throw new Error("Missing tab id");

  // The author_id filter mirrors the RLS update policy — only the author can
  // edit their own tab.
  const { error } = await supabase
    .from("tabs")
    .update({ content, type })
    .eq("id", tabId)
    .eq("author_id", user.id);

  if (error) throw error;

  if (revalidate) revalidatePath(revalidate);
  revalidatePath("/tabs");
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const content = formData.get("content") as string;
  const songId = formData.get("songId") as string;
  const slug = formData.get("slug") as string;
  const tabId = formData.get("tabId") as string;
  const parentId = formData.get("parentId") as string;

  const { error } = await supabase.from("comments").insert({
    content,
    author_id: user.id,
    song_id: songId || null,
    tab_id: tabId || null,
    parent_id: parentId || null,
  });

  if (error) throw error;

  if (slug) {
    revalidatePath(`/songs/${slug}`);
  } else if (tabId) {
    revalidatePath(`/tabs/${tabId}`);
  }
}

export async function toggleFavorite(tabId: string, revalidate?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("tab_id", tabId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, tab_id: tabId });
    if (error) throw error;
  }

  if (revalidate) revalidatePath(revalidate);
}

export async function createSetlist(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const venue = formData.get("venue") as string;
  const songIds = formData.getAll("songIds[]") as string[];

  const { data: setlist, error: setlistError } = await supabase
    .from("setlists")
    .insert({
      name,
      date: date || null,
      venue: venue || null,
      creator_id: user.id,
    })
    .select()
    .single();

  if (setlistError) throw setlistError;

  // Add songs to the setlist
  const setlistSongs = songIds.map((songId, index) => ({
    setlist_id: setlist.id,
    song_id: songId,
    position: index + 1,
  }));

  const { error: songsError } = await supabase
    .from("setlist_songs")
    .insert(setlistSongs);

  if (songsError) throw songsError;

  revalidatePath("/setlists");
}

export async function deleteSetlist(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("setlists")
    .delete()
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) throw error;

  revalidatePath("/setlists");
  redirect("/setlists");
}

// Extract the platform + video id from a YouTube or Vimeo URL.
function parseVideoUrl(
  url: string
): { platform: "youtube" | "vimeo"; videoId: string } | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? { platform: "youtube", videoId: id } : null;
    }
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return { platform: "youtube", videoId: v };
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx >= 0 && parts[idx + 1]) {
        return { platform: "youtube", videoId: parts[idx + 1] };
      }
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return { platform: "vimeo", videoId: id };
    }
  } catch {
    // fall through
  }
  return null;
}

export async function createVideo(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const songId = formData.get("songId") as string;
  const slug = formData.get("slug") as string;
  const url = formData.get("url") as string;
  const type = formData.get("type") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name) throw new Error("Name is required");
  const parsed = parseVideoUrl(url ?? "");
  if (!parsed) throw new Error("Unsupported video URL (YouTube or Vimeo only)");

  const { error } = await supabase.from("videos").insert({
    song_id: songId,
    type,
    platform: parsed.platform,
    video_id: parsed.videoId,
    name,
    description: description || null,
    created_by: user.id,
  });

  if (error) throw error;

  if (slug) revalidatePath(`/songs/${slug}`);
  revalidatePath("/videos");
}

export async function deleteVideo(videoId: string, revalidate?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", videoId)
    .eq("created_by", user.id);

  if (error) throw error;

  if (revalidate) revalidatePath(revalidate);
  revalidatePath("/videos");
}
