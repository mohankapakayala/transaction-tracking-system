/** Avatar, name and email strip shown above the profile fields. */
export function ProfileIdentity({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <div
        aria-hidden
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white"
      >
        {initials(fullName)}
      </div>

      <div className="min-w-0">
        <p className="truncate text-2xl font-bold text-slate-900">{fullName}</p>
        <p className="truncate text-slate-500">{email}</p>
      </div>
    </div>
  );
}

/** First letter of the first and last word, e.g. "Ada King Lovelace" -> "AL". */
function initials(fullName: string) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "?";

  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";

  return `${first}${last}`.toUpperCase();
}
