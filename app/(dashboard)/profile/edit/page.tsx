"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import AvatarEditor from "react-avatar-editor";

export default function EditProfile() {
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "available" | "taken" | "checking" | null
  >(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [country, setCountry] = useState<any>(null);
  const [currentState, setCurrentState] = useState<any>(null);
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [zoom, setZoom] = useState(1.2);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const editorRef = useRef<AvatarEditor>(null);
  const router = useRouter();
  const supabase = createClient();

  // Load the existing profile to prefill the form.
  useEffect(() => {
    async function load() {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        router.push("/sign-in");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url, country, state, city")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        setUsername(profile.username ?? "");
        setOriginalUsername(profile.username ?? "");
        setAvatarPreview(profile.avatar_url ?? null);
        setCurrentLocation(
          [profile.city, profile.state, profile.country]
            .filter(Boolean)
            .join(", ")
        );
      }
      setLoaded(true);
    }
    load();
  }, []);

  async function checkUsername(name: string) {
    if (name === originalUsername) {
      setUsernameStatus("available");
      return;
    }
    setUsernameStatus("checking");
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name)
      .single();
    setUsernameStatus(data ? "taken" : "available");
  }

  async function uploadAvatarCropped(user: User, file: File) {
    if (!editorRef.current) return null;
    const canvas = editorRef.current.getImageScaledToCanvas();
    return new Promise<string>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return reject("Failed to crop avatar");
        const filePath = `${user.id}/${file.name}`;
        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, blob, { upsert: true, contentType: "image/png" });
        if (error) return reject(error.message);
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);
        // Cache-bust so the new crop shows immediately at the same path.
        resolve(`${publicUrl}?v=${Date.now()}`);
      }, "image/png");
    });
  }

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setErrorMsg("User not authenticated.");
      setLoading(false);
      return;
    }
    try {
      const updates: Record<string, any> = { username };

      if (avatarFile && editorRef.current) {
        const avatar_url = await uploadAvatarCropped(user, avatarFile);
        updates.avatar_url = avatar_url;
        await supabase.auth.updateUser({ data: { avatar_url } });
      }

      // Only overwrite location if a new country was picked, so saving the form
      // without touching location doesn't wipe it.
      if (country) {
        updates.country = country.name || null;
        updates.state = currentState?.name || null;
        updates.city = currentCity?.name || null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
      if (error) {
        setErrorMsg(error.message || "Failed to update profile.");
        setLoading(false);
        return;
      }
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || JSON.stringify(err));
      setLoading(false);
    }
  }

  if (!loaded) {
    return (
      <div className="container max-w-md py-10 text-muted-foreground">
        Loading…
      </div>
    );
  }

  const usernameUnchanged = username === originalUsername;
  const canSave =
    username.length >= 3 &&
    (usernameUnchanged || usernameStatus === "available") &&
    !loading;

  return (
    <div className="container max-w-md py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/profile">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to profile
        </Link>
      </Button>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Edit profile</h1>

      <form
        className="flex flex-col gap-6 rounded-2xl border bg-card p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center gap-2">
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (e.target.value.length > 2) checkUsername(e.target.value);
                else setUsernameStatus(null);
              }}
              required
              minLength={3}
              maxLength={32}
              autoComplete="off"
            />
            {!usernameUnchanged && usernameStatus === "available" && (
              <span className="text-sm text-green-600">is available</span>
            )}
            {usernameStatus === "taken" && (
              <span className="text-sm text-red-600">is taken</span>
            )}
            {usernameStatus === "checking" && (
              <span className="text-sm text-gray-400">checking...</span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="avatar">Avatar</Label>
          {avatarPreview && (
            <div className="mb-2 flex justify-center">
              {avatarFile ? (
                <AvatarEditor
                  ref={editorRef}
                  image={avatarPreview}
                  width={120}
                  height={120}
                  border={30}
                  borderRadius={60}
                  color={[255, 255, 255, 0.6]}
                  scale={zoom}
                  rotate={0}
                />
              ) : (
                <img
                  src={avatarPreview}
                  alt="Current avatar"
                  className="h-32 w-32 rounded-full object-cover"
                />
              )}
            </div>
          )}
          {avatarFile && (
            <div className="mb-2 flex items-center gap-2">
              <label htmlFor="zoom">Zoom:</label>
              <input
                id="zoom"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>
          )}
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
          />
        </div>

        <div>
          <Label>Location</Label>
          {currentLocation && (
            <p className="mb-2 text-sm text-muted-foreground">
              Current: {currentLocation}. Pick a country below to update it.
            </p>
          )}
          <CountrySelect
            onChange={setCountry}
            placeHolder="Select Country"
            value={country}
          />
          <StateSelect
            countryid={country?.id}
            onChange={setCurrentState}
            placeHolder="Select State"
            value={currentState}
          />
          <CitySelect
            countryid={country?.id}
            stateid={currentState?.id}
            onChange={setCurrentCity}
            placeHolder="Select City"
            value={currentCity}
          />
        </div>

        <Button type="submit" disabled={!canSave}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
      </form>
    </div>
  );
}
