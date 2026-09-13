/**
 * The zones offered by the profile picker. Not the full tz database — a list
 * of ~400 keys is worse to scan than a short one covering the regions we
 * operate in. `timezoneOptions` keeps any other stored value selectable.
 */
const COMMON_TIMEZONES: Array<{ value: string; label: string }> = [
  { value: "UTC", label: "Coordinated Universal Time" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Sao_Paulo", label: "Brasilia" },
  { value: "Europe/London", label: "London, Dublin, Edinburgh" },
  { value: "Europe/Paris", label: "Paris, Amsterdam, Madrid" },
  { value: "Europe/Berlin", label: "Berlin, Rome, Stockholm" },
  { value: "Africa/Lagos", label: "West Central Africa" },
  { value: "Africa/Johannesburg", label: "Harare, Pretoria" },
  { value: "Asia/Dubai", label: "Abu Dhabi, Muscat" },
  { value: "Asia/Karachi", label: "Islamabad, Karachi" },
  { value: "Asia/Kolkata", label: "Chennai, Kolkata, Mumbai, New Delhi" },
  { value: "Asia/Dhaka", label: "Dhaka" },
  { value: "Asia/Singapore", label: "Kuala Lumpur, Singapore" },
  { value: "Asia/Shanghai", label: "Beijing, Hong Kong, Shanghai" },
  { value: "Asia/Tokyo", label: "Osaka, Sapporo, Tokyo" },
  { value: "Australia/Sydney", label: "Canberra, Melbourne, Sydney" },
  { value: "Pacific/Auckland", label: "Auckland, Wellington" },
];

/**
 * The zone's current offset, e.g. `UTC-07:00`. Read from the tz database
 * rather than stored, because half these zones change offset twice a year.
 */
function currentOffset(timeZone: string) {
  let parts: Intl.DateTimeFormatPart[];

  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    }).formatToParts(new Date());
  } catch {
    // A zone this browser cannot resolve. Naming it is better than guessing
    // an offset for it.
    return null;
  }

  const name = parts.find((part) => part.type === "timeZoneName")?.value;

  // `longOffset` abbreviates zero to a bare "GMT".
  if (!name || name === "GMT") return "UTC+00:00";

  return name.replace("GMT", "UTC");
}

function describe(value: string, label: string) {
  const offset = currentOffset(value);

  return offset ? `(${offset}) ${label}` : label;
}

/**
 * Options for the picker, with `selected` guaranteed to be among them.
 *
 * A saved zone outside the common list — set through another client, or added
 * to the list later — would otherwise be silently rewritten by the first save.
 */
export function timezoneOptions(selected: string) {
  const known = COMMON_TIMEZONES.some((zone) => zone.value === selected);

  const zones = known
    ? COMMON_TIMEZONES
    : [{ value: selected, label: selected.replace(/_/g, " ") }, ...COMMON_TIMEZONES];

  return zones.map((zone) => ({
    value: zone.value,
    label: describe(zone.value, zone.label),
  }));
}
