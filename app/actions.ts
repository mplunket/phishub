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
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
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
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/reset-password", "Password updated");
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

  const title = formData.get("title") as string;
  const composers = (formData.get("composers") as string)
    .split(",")
    .map((c) => c.trim());
  const debutDate = formData.get("debutDate") as string;
  const history = formData.get("history") as string;
  const lyrics = formData.get("lyrics") as string;

  const { error } = await supabase.from("songs").insert({
    title,
    composer: composers,
    debut_date: debutDate || null,
    history: history || null,
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

  const songId = formData.get("songId") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase.from("tabs").insert({
    song_id: songId,
    content,
    type,
    author_id: user.id,
  });

  if (error) throw error;

  revalidatePath(`/songs/${songId}`);
  revalidatePath(`/songs/${songId}/tabs`);
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const content = formData.get("content") as string;
  const songId = formData.get("songId") as string;
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

  if (songId) {
    revalidatePath(`/songs/${songId}`);
  } else if (tabId) {
    revalidatePath(`/tabs/${tabId}`);
  }
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
