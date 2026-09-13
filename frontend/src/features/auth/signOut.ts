import { logout } from "@/features/auth/api";
import { clearSession, getRefreshToken } from "@/features/auth/session";

/**
 * Ends the session on both sides: blacklists the refresh token, then drops
 * the local copy.
 *
 * The local clear is unconditional. If the revoke call fails the device must
 * still end up signed out — leaving the tokens in `localStorage` because the
 * network blipped is the worse outcome, and the token expires regardless.
 */
export async function signOut() {
  const refresh = getRefreshToken();

  if (refresh) {
    try {
      await logout(refresh);
    } catch {
      // Already expired, rotated, or unreachable. Nothing left to do.
    }
  }

  clearSession();
}
