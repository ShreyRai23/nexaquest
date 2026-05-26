import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useAuth } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { Camera, Save, User, Mail, Star, Zap, Shield, Loader2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — NexaQuest AI" }] }),
  component: ProfilePage,
});

const AVATAR_EMOJIS = ["🦊", "🐉", "🦁", "🐺", "🦅", "🐸", "🦋", "🐬", "🦄", "🦖", "🐙", "🐻", "🐨", "🦝", "🦘", "🦩"];

function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [heroName, setHeroName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("🦊");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // On mount: check auth and always fetch fresh user data from the API.
  // This prevents stale cached URLs (from localStorage) from being used.
  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Sync form fields whenever the user object is updated (e.g. after refreshUser)
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setHeroName(user.profile?.hero_name || "");
      setAge(user.profile?.age ? String(user.profile.age) : "");
      setGrade((user.profile as any)?.grade || "");
      setAvatarEmoji(user.avatar_emoji || "🦊");
      // Only set imagePreview from the URL when no local file is staged
      if (user.profile_image_url && !imageFile) {
        setImagePreview(user.profile_image_url);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("name", name);
      form.append("avatar_emoji", avatarEmoji);
      if (user?.role === "child") {
        form.append("hero_name", heroName);
        if (age) form.append("age", age);
        if (grade) form.append("grade", grade);
      }
      if (imageFile) form.append("profile_image", imageFile);

      const res = await api.post("/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Immediately apply the returned profile_image_url so the preview
      // doesn't briefly disappear while refreshUser() is in-flight
      if (res.data.user?.profile_image_url) {
        setImagePreview(res.data.user.profile_image_url);
      }

      await refreshUser();
      setSuccess(true);
      setImageFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const level = user.profile?.level ?? 1;
  const xp = user.profile?.xp ?? 0;
  const xpNext = user.profile?.xp_to_next_level ?? 500;
  const pct = user.profile?.level_progress_percent ?? 0;

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 mt-8">

        {/* Page header */}
        <div className="mb-6">
          <div className="font-pixel text-[10px] text-[color:var(--cherry)] mb-1">MY PROFILE</div>
          <h1 className="font-pixel text-xl text-[color:var(--ink)]">Hero Settings</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Hero Card */}
          <div
            className="pixel-card-flat p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--ink) 0%, #2d2d2d 100%)" }}
          >
            {/* BG decor */}
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none text-[120px] leading-none overflow-hidden">
              ✨🌟⚡🎮
            </div>

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar uploader */}
              <div className="relative shrink-0">
                <div
                  className="w-28 h-28 rounded-full border-4 border-[color:var(--sunny)] shadow-[6px_6px_0_0_rgba(255,200,0,0.3)] overflow-hidden bg-[color:var(--orange-pop)] flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{avatarEmoji}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[color:var(--sunny)] border-3 border-[color:var(--ink)] flex items-center justify-center shadow-[2px_2px_0_0_var(--ink)] hover:-translate-y-0.5 transition"
                >
                  <Camera size={14} className="text-[color:var(--ink)]" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Name & stats */}
              <div className="flex-1 text-center sm:text-left">
                <div className="font-pixel text-[10px] text-[color:var(--teal-pop)] mb-1">WELCOME BACK</div>
                <div className="font-pixel text-2xl text-white">{user.profile?.hero_name || user.name}</div>
                <div className="text-[color:var(--cream)]/70 text-sm mt-1">{user.email}</div>

                {/* Mini stats row */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
                    <Zap size={13} className="text-[color:var(--sunny)]" />
                    <span className="font-pixel text-[9px] text-white">LVL {level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
                    <Star size={13} className="text-[color:var(--orange-pop)]" />
                    <span className="font-pixel text-[9px] text-white">{xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
                    <Shield size={13} className="text-[color:var(--teal-pop)]" />
                    <span className="font-pixel text-[9px] text-white capitalize">{user.role}</span>
                  </div>
                </div>

                {/* XP bar */}
                {user.role === "child" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-[color:var(--cream)]/60 mb-1">
                      <span>Level {level}</span>
                      <span>{xp}/{xpNext} XP → Level {level + 1}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-[color:var(--sunny)] to-[color:var(--orange-pop)] rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emoji picker */}
          <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
            <div className="font-pixel text-[10px] text-[color:var(--ink)] mb-3">🎭 PICK YOUR SPIRIT ANIMAL</div>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`text-2xl w-11 h-11 rounded-xl border-3 transition hover:scale-110 ${avatarEmoji === emoji
                    ? "border-[color:var(--ink)] bg-[color:var(--sunny)] shadow-[3px_3px_0_0_var(--ink)] scale-110"
                    : "border-transparent bg-white hover:border-[color:var(--ink)]/30"
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div className="pixel-card-flat bg-[color:var(--cream)] p-5 space-y-4">
            <div className="font-pixel text-[10px] text-[color:var(--ink)] mb-1">📋 YOUR DETAILS</div>

            <ProfileField
              icon={User}
              label="Full Name"
              value={name}
              onChange={(v) => setName(v)}
              placeholder="e.g. Aarav Mehta"
            />
            <ProfileField
              icon={Mail}
              label="Email Address"
              value={user.email}
              onChange={() => {}}
              placeholder=""
              disabled
            />

            {user.role === "child" && (
              <>
                <ProfileField
                  icon={Star}
                  label="Hero Name"
                  value={heroName}
                  onChange={(v) => setHeroName(v)}
                  placeholder="e.g. PixelFox"
                />
                <div className="grid grid-cols-2 gap-4">
                  <ProfileField
                    icon={Zap}
                    label="Age"
                    value={age}
                    onChange={(v) => setAge(v)}
                    placeholder="e.g. 12"
                    type="number"
                  />
                  <ProfileField
                    icon={Shield}
                    label="Grade"
                    value={grade}
                    onChange={(v) => setGrade(v)}
                    placeholder="e.g. 7th"
                  />
                </div>
              </>
            )}
          </div>

          {/* Feedback */}
          {error && (
            <div className="pixel-card bg-red-50 border-2 border-red-400 p-3 text-red-700 text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="pixel-card bg-green-50 border-2 border-green-400 p-3 text-green-700 text-sm font-semibold">
              ✅ Profile saved successfully!
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="btn-game orange w-full flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Profile</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProfileField({
  icon: Icon, label, value, onChange, placeholder, disabled, type = "text"
}: {
  icon: any; label: string; value: string; onChange: (v: string) => void;
  placeholder: string; disabled?: boolean; type?: string;
}) {
  return (
    <label className="block">
      <span className="font-pixel text-[9px] text-[color:var(--ink)]/70">{label.toUpperCase()}</span>
      <div className={`mt-1 flex items-center gap-2 rounded-xl border-4 border-[color:var(--ink)] bg-white px-3 py-2 shadow-[3px_3px_0_0_var(--ink)] ${!disabled ? "focus-within:-translate-y-0.5 transition" : "opacity-60"}`}>
        <Icon size={15} className="text-[color:var(--ink)]/50 shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 outline-none font-semibold bg-transparent"
        />
      </div>
    </label>
  );
}
