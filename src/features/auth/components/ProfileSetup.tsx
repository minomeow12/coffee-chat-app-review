import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { apiClient } from "../../../lib/apiClient";
import { useUser } from "../../../context/UserContext";

const AVATAR_OPTIONS = [
  { id: "cat1", src: "/pfp/cat1.png", label: "Cat 1", fallbackColor: 0 },
  { id: "cat2", src: "/pfp/cat2.png", label: "Cat 2", fallbackColor: 1 },
  { id: "dog1", src: "/pfp/dog1.png", label: "Dog 1", fallbackColor: 2 },
  { id: "dog2", src: "/pfp/dog2.png", label: "Dog 2", fallbackColor: 3 },
  {
    id: "ham1",
    src: "/pfp/hamster1.png",
    label: "Hamster",
    fallbackColor: 4,
  },
  {
    id: "chip1",
    src: "/pfp/chip1.png",
    label: "Chipmunk",
    fallbackColor: 5,
  },
] as const;

export function ProfileSetup() {
  const { user, refreshUser, logout } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // selected avatar option id (frontend)
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    AVATAR_OPTIONS[0].id,
  );

  const [isSaving, setIsSaving] = useState(false);

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0;

  const selectedAvatar = useMemo(
    () =>
      AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId) ??
      AVATAR_OPTIONS[0],
    [selectedAvatarId],
  );

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || isSaving) return;

    setIsSaving(true);
    try {
      // ✅ Blackbox-safe payload (known working)
      await apiClient.post("/api/auth/update-profile", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        color: selectedAvatar.fallbackColor, // number index
      });

      // ✅ Store avatar choice locally (since backend may not support avatarUrl)
      if (user?.id) {
        localStorage.setItem(`meowclub_avatar_${user.id}`, selectedAvatar.src);
      }

      await refreshUser();
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Could not update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-foreground">
          Set up your profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>

        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="h-11 rounded-xl"
              required
            />
          </div>

          {/* ✅ Cute avatar picker */}
          <div className="space-y-2">
            <Label>Choose an avatar</Label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_OPTIONS.map((a) => {
                const active = a.id === selectedAvatarId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(a.id)}
                    className={`h-14 w-14 rounded-full border bg-card overflow-hidden transition-transform active:scale-95 ${
                      active
                        ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                        : "border-border"
                    }`}
                    aria-label={`Select ${a.label}`}
                    title={a.label}
                  >
                    <img
                      src={a.src}
                      alt={a.label}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground">
              Selected:{" "}
              <span className="font-medium">{selectedAvatar.label}</span>
            </p>
          </div>

          <Button
            type="submit"
            disabled={!canSave || isSaving}
            className="h-11 w-full rounded-xl font-semibold"
          >
            {isSaving ? "Saving..." : "Continue"}
          </Button>

          <button
            type="button"
            onClick={logout}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
