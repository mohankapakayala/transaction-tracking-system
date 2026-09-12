export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** A non-2xx response from the API, carrying the parsed body for callers. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, readErrorMessage(body, response), body);
  }

  return body as T;
}

/**
 * DRF answers with `{ message }` or `{ detail }` for handled errors and
 * `{ field: ["..."] }` for serializer validation failures.
 */
function readErrorMessage(body: unknown, response: Response): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;

    for (const key of ["message", "detail"]) {
      if (typeof record[key] === "string") return record[key];
    }

    for (const value of Object.values(record)) {
      if (typeof value === "string") return value;
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
  }

  return `Request failed (${response.status}).`;
}
