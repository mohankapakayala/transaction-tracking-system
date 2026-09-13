import { ApiError, apiFetch } from "@/lib/api";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/features/auth/session";

export type TokenPair = {
  access: string;
  refresh: string;
};

/** The refresh token is missing or rejected: only a fresh login recovers. */
export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

/**
 * Trades a refresh token for a new pair. Lives here rather than in `api.ts`
 * because it is transport plumbing — callers go through `authFetch`.
 */
function requestTokenPair(refresh: string) {
  return apiFetch<TokenPair>("/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}

/**
 * The refresh currently in flight, if any. Requests tend to expire together,
 * and the backend rotates refresh tokens — two concurrent refreshes would
 * spend the same token twice, and the loser would land on a blacklisted one.
 */
let pendingRefresh: Promise<string> | null = null;

function renewAccessToken() {
  pendingRefresh ??= (async () => {
    const refresh = getRefreshToken();

    if (!refresh) throw new SessionExpiredError();

    try {
      const tokens = await requestTokenPair(refresh);
      saveTokens(tokens);
      return tokens.access;
    } catch (cause) {
      // The server turned the token down, so the session is unrecoverable.
      // A network failure is not the token's fault — keep it and let the
      // caller retry later.
      if (cause instanceof ApiError) {
        clearSession();
        throw new SessionExpiredError();
      }

      throw cause;
    } finally {
      pendingRefresh = null;
    }
  })();

  return pendingRefresh;
}

function withBearer(init: RequestInit | undefined, access: string): RequestInit {
  return {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${access}` },
  };
}

/**
 * `apiFetch` for endpoints behind `IsAuthenticated`. Attaches the access
 * token and, when it has expired, refreshes once and replays the request.
 *
 * Throws `SessionExpiredError` when the session cannot be renewed — callers
 * should send the user to `/login`.
 */
export async function authFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const access = getAccessToken();

  if (!access) throw new SessionExpiredError();

  try {
    return await apiFetch<T>(path, withBearer(init, access));
  } catch (cause) {
    if (!(cause instanceof ApiError) || cause.status !== 401) throw cause;
  }

  // One refresh, one replay. A second 401 is about the request, not the
  // token's age, so let it surface instead of looping.
  return apiFetch<T>(path, withBearer(init, await renewAccessToken()));
}
