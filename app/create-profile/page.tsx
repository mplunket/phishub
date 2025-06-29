"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import AvatarEditor from "react-avatar-editor";

export default function CreateProfile() {
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "available" | "taken" | "checking" | null
  >(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [country, setCountry] = useState<any>(null);
  const [currentState, setCurrentState] = useState<any>(null);
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const editorRef = useRef<AvatarEditor>(null);
  const router = useRouter();
  const supabase = createClient();

  // Username availability check
  async function checkUsername(name: string) {
    setUsernameStatus("checking");
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name)
      .single();
    setUsernameStatus(data ? "taken" : "available");
  }

  // Upload and crop avatar
  async function uploadAvatarCropped(user: User, file: File, userId: string) {
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
        resolve(publicUrl);
      }, "image/png");
    });
  }

  // Fetch current avatar_url if user has one (e.g. from social login)
  useEffect(() => {
    async function fetchAvatar() {
      const user = (await supabase.auth.getUser()).data.user;
      if (user?.user_metadata?.avatar_url) {
        setAvatarPreview(user.user_metadata.avatar_url);
      }
    }
    fetchAvatar();
  }, []);

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
    let avatar_url = null;
    try {
      if (avatarFile && editorRef.current) {
        avatar_url = await uploadAvatarCropped(user, avatarFile, user.id);
        // Update user metadata with avatar_url (storage path)
        const { error: metaError } = await supabase.auth.updateUser({
          data: { avatar_url },
        });
        if (metaError) {
          setErrorMsg(metaError.message || "Failed to update user metadata.");
          setLoading(false);
          return;
        }
      } else if (avatarPreview && avatarPreview.startsWith("http")) {
        // If using existing avatar from social, store the URL
        avatar_url = avatarPreview;
      }
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        username,
        avatar_url,
        country: country?.name || null,
        state: currentState?.name || null,
        city: currentCity?.name || null,
      });
      if (error) {
        setErrorMsg(error.message || "Failed to create profile.");
        setLoading(false);
        return;
      }
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err?.message || JSON.stringify(err));
      setLoading(false);
    }
    setLoading(false);
  }

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <form
        className="w-full max-w-md mx-auto p-8 bg-white/90 rounded-2xl shadow-xl flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-2">Create Your Profile</h1>
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
            {usernameStatus === "available" && (
              <span className="text-green-600 text-sm">is available</span>
            )}
            {usernameStatus === "taken" && (
              <span className="text-red-600 text-sm">is taken</span>
            )}
            {usernameStatus === "checking" && (
              <span className="text-gray-400 text-sm">checking...</span>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="avatar">Avatar (optional)</Label>
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
                  className="rounded-full w-32 h-32 object-cover"
                />
              )}
            </div>
          )}
          {avatarFile && (
            <div className="flex items-center gap-2 mb-2">
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
        <Button
          type="submit"
          disabled={loading || usernameStatus !== "available"}
        >
          {loading ? "Creating..." : "Create Profile"}
        </Button>
        {errorMsg && (
          <div className="text-red-600 text-sm mt-2">{errorMsg}</div>
        )}
      </form>
    </div>
  );
}
