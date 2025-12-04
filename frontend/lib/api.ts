/**
 * API helper functions with Double-Token Authentication
 */

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "AuthError";
    }
}

/**
 * Auth constants - configure these based on your backend
 */
const AUTH_CONSTANTS = {
  AUTH_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  REFRESH_ACCESS_TOKEN_ENDPOINT: 'auth/refresh',
};

/**
 * Update request options with credentials and headers
 */
const updateOptions = (options: RequestInit): RequestInit => {
    const update = { ...options };
    update.credentials = "include"; // CRITICAL: Ensures Cookies are sent

    const existingHeaders = (update.headers || {}) as Record<string, string>;

    if (!(update.body instanceof FormData)) {
        update.headers = {
        "Content-Type": "application/json",
        ...existingHeaders, // Preserves custom headers (e.g. trace-id)
        };
    }
    return update;
    };

/**
 * Authenticated fetch wrapper with automatic token refresh
 * Handles Double-Token Auth flow:
 * - Access token in httpOnly cookie
 * - Refresh token in httpOnly cookie
 * - Automatically refreshes on 401 and retries
 */
export async function fetchAuth<T>(
    fetchUrl: string,
    requestOptions: RequestInit,
    retryCount: number = 0
): Promise<T> {
    let response: Response;
    const finalOptions = updateOptions(requestOptions);

    try {
        response = await fetch(fetchUrl, finalOptions);
    } catch (e) {
        const message =
        e instanceof Error ? e.message : `Unknown error: ${String(e)}`;
        throw new Error(`Network request failed: ${message}`);
    }

    // Intercept 401 and try to Refresh Token
    if (!response.ok && response.status === 401) {
        if (retryCount === 0) {
        try {
            const refreshResponse = await fetch(
            `${AUTH_CONSTANTS.AUTH_URL}/${AUTH_CONSTANTS.REFRESH_ACCESS_TOKEN_ENDPOINT}`,
            {
                method: "POST",
                credentials: "include",
            }
            );

            if (!refreshResponse.ok) {
            throw new AuthError("Session expired", 401);
            }
            // Retry original request with new cookies
            return fetchAuth<T>(fetchUrl, requestOptions, retryCount + 1);
        } catch (error) {
            throw error;
        }
        }
    }

    const text = await response.text();
    const hasBody = text.trim().length > 0;
    let json: unknown = null;

    if (hasBody) {
        try {
        json = JSON.parse(text);
        } catch {
        json = text;
        }
    }

    if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        if (json && typeof json === "object") {
        const obj = json as Record<string, unknown>;
        errorMessage =
            (obj.message as string) || (obj.error as string) || errorMessage;
        }
        throw new AuthError(errorMessage, response.status);
    }

    if (!hasBody) return null as T;

    return json as T;
}

/**
 * Legacy authFetch wrapper for backward compatibility
 * Uses the new fetchAuth internally
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    try {
        const data = await fetchAuth<any>(url, options);
        // Return a mock Response for compatibility
        return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        if (error instanceof AuthError) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: error.status,
            headers: { 'Content-Type': 'application/json' },
        });
        }
        throw error;
    }
}

/**
 * API base URL from environment
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Build full API URL
 */
export function apiUrl(path: string): string {
    return `${API_BASE_URL}${path}`;
}

// ============================================
// VOTING API
// ============================================

/**
 * Fetch all votings for a trip
 */
export async function fetchVotings(tripId: string) {
  return fetchAuth(apiUrl(`/trips/${tripId}/votes`), {
    method: "GET",
  });
}

/**
 * Create a new voting
 */
export async function createVoting(tripId: string, data: any) {
  return fetchAuth(apiUrl(`/trips/${tripId}/votes`), {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Cast vote(s) on a voting
 */
export async function castVote(voteId: string, optionIds: string[]) {
  return fetchAuth(apiUrl(`/votes/${voteId}/cast`), {
    method: "POST",
    body: JSON.stringify({ optionIds }),
  });
}

/**
 * Delete a voting
 */
export async function deleteVoting(voteId: string) {
  return fetchAuth(apiUrl(`/votes/${voteId}`), {
    method: "DELETE",
  });
}

/**
 * Add option to existing voting
 */
export async function addVotingOption(
  voteId: string, 
  text: string, 
  description?: string
) {
  return fetchAuth(apiUrl(`/votes/${voteId}/options`), {
    method: "POST",
    body: JSON.stringify({ text, description }),
  });
}

// ============================================
// CHECKLIST API
// ============================================

/**
 * Fetch checklist for a trip
 */
export async function fetchChecklist(tripId: string) {
  return fetchAuth(apiUrl(`/trips/${tripId}/checklist`), {
    method: "GET",
  });
}

/**
 * Add item to checklist
 */
export async function addChecklistItem(tripId: string, text: string) {
  return fetchAuth(apiUrl(`/trips/${tripId}/checklist`), {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

/**
 * Toggle checklist item status
 */
export async function toggleChecklistItemStatus(itemId: string, isChecked: boolean) {
  return fetchAuth(apiUrl(`/checklist/${itemId}/status`), {
    method: "PATCH",
    body: JSON.stringify({ isChecked }),
  });
}

/**
 * Delete checklist item
 */
export async function deleteChecklistItem(itemId: string) {
  return fetchAuth(apiUrl(`/checklist/${itemId}`), {
    method: "DELETE",
  });
}
