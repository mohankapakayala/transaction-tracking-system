"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { SessionExpiredError } from "@/features/auth/client";
import {
  getProfile,
  updateProfile,
  type Profile,
  type ProfileUpdate,
} from "@/features/profile/api";
import { ProfileIdentity } from "@/features/profile/components/ProfileIdentity";
import { timezoneOptions } from "@/features/profile/timezones";

type Draft = ProfileUpdate;

function toDraft(profile: Profile): Draft {
  return {
    full_name: profile.full_name,
    work_phone: profile.work_phone,
    work_address: profile.work_address,
    timezone: profile.timezone,
  };
}

export function GeneralInformationForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // The endpoint is behind the access token, so the fetch has to happen after
  // mount rather than while the page is prerendered.
  useEffect(() => {
    let cancelled = false;

    getProfile()
      .then((result) => {
        if (cancelled) return;
        setProfile(result);
        setDraft(toDraft(result));
      })
      .catch((cause) => {
        if (cancelled) return;
        if (cause instanceof SessionExpiredError) {
          router.replace("/login");
          return;
        }
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load your profile. Please refresh.",
        );
      });

    // The user can navigate away mid-request; setting state after that warns.
    return () => {
      cancelled = true;
    };
  }, [router]);

  const timezones = useMemo(
    () => timezoneOptions(draft?.timezone ?? "UTC"),
    [draft?.timezone],
  );

  if (error && !draft) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!profile || !draft) return <ProfileSkeleton />;

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft) return;

    setError(null);
    setSaved(false);
    setSaving(true);

    try {
      const result = await updateProfile(draft);

      // Take the server's copy: it has trimmed and normalised the values.
      setProfile(result);
      setDraft(toDraft(result));
      setSaved(true);
    } catch (cause) {
      if (cause instanceof SessionExpiredError) {
        router.replace("/login");
        return;
      }

      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save your profile. Please retry.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ProfileIdentity fullName={profile.full_name} email={profile.email} />

      <div className="mt-8 flex flex-col gap-5">
        <TextField
          id="full_name"
          name="full_name"
          label="Full Name"
          autoComplete="name"
          required
          value={draft.full_name}
          onChange={(event) => update("full_name", event.target.value)}
        />

        <TextField
          id="work_phone"
          name="work_phone"
          type="tel"
          label="Work Phone"
          autoComplete="tel"
          placeholder="+1 (555) 012-3456"
          value={draft.work_phone}
          onChange={(event) => update("work_phone", event.target.value)}
        />

        <TextField
          id="work_address"
          name="work_address"
          label="Work Address"
          autoComplete="street-address"
          placeholder="123 Tech Parkway, Silicon Valley, CA 94025"
          value={draft.work_address}
          onChange={(event) => update("work_address", event.target.value)}
        />

        <SelectField
          id="timezone"
          name="timezone"
          label="Timezone"
          value={draft.timezone}
          onChange={(event) => update("timezone", event.target.value)}
        >
          {timezones.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.label}
            </option>
          ))}
        </SelectField>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {saved ? (
        <p
          role="status"
          className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Your profile has been updated.
        </p>
      ) : null}

      <Button
        type="submit"
        variant="outline"
        className="mt-6 disabled:opacity-60"
        disabled={saving}
      >
        {saving ? "Saving…" : "Update Profile"}
      </Button>
    </form>
  );
}

function ProfileSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="flex items-center gap-5">
        <div className="size-20 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-64 rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-12 rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
