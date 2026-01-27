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
 * API base URL from environment
 */
const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;

export const API_BASE_URL =
  typeof window === "undefined"
    ? INTERNAL_API_URL || PUBLIC_API_URL
    : PUBLIC_API_URL;

/**
 * Auth constants - configure these based on your backend
 */
const AUTH_CONSTANTS = {
  AUTH_URL: API_BASE_URL,
  REFRESH_ACCESS_TOKEN_ENDPOINT: "auth/refresh",
};

/**
 * Build full API URL
 */
export function apiUrl(path: string): string {
    // Ensure path starts with /
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return `${API_BASE_URL}${path}`;
}

/**
 * Update request options with credentials and headers
 */
const updateOptions = (options: RequestInit): RequestInit => {
    const update = { ...options };
    update.credentials = "include";

    const existingHeaders = (update.headers || {}) as Record<string, string>;

    if (!(update.body instanceof FormData)) {
        update.headers = {
            "Content-Type": "application/json",
            ...existingHeaders,
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
    requestOptions: RequestInit = {},
    retryCount: number = 0
): Promise<T> {
    let response: Response;
    const finalOptions = updateOptions(requestOptions);

    try {
        response = await fetch(fetchUrl, finalOptions);
    } catch (e) {
        const message = e instanceof Error ? e.message : `Unknown error: ${String(e)}`;
        throw new Error(`Network request failed: ${message}`);
    }

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
            errorMessage = (obj.message as string) || (obj.error as string) || errorMessage;
        }
        throw new AuthError(errorMessage, response.status);
    }

    if (!hasBody) return null as T;

    return json as T;
}

// TYPE IMPORTS

import type { ExpenseDto, BalanceGraphDto } from "@/app/dashboard/[groupId]/costs/types";

// VOTING API

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
export async function addVotingOption(voteId: string, text: string, description?: string) {
    return fetchAuth(apiUrl(`/votes/${voteId}/options`), {
        method: "POST",
        body: JSON.stringify({ text, description }),
    });
}


// CHECKLIST API

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

// COSTS/EXPENSES API

/**
 * Fetch all expenses for a trip
 */
export async function fetchExpenses(tripId: string): Promise<ExpenseDto[]> {
    return fetchAuth<ExpenseDto[]>(apiUrl(`/trips/${tripId}/expenses`), {
        method: "GET",
    });
}

/**
 * Create a new expense
 */
export async function createExpense(tripId: string, payload: any): Promise<ExpenseDto> {
    return fetchAuth<ExpenseDto>(apiUrl(`/trips/${tripId}/expenses`), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Delete an expense
 */
export async function deleteExpense(expenseId: string): Promise<void> {
    return fetchAuth<void>(apiUrl(`/expenses/${expenseId}`), {
        method: "DELETE",
    });
}

/**
 * Fetch balance/settlement graph for a trip
 */
export async function fetchBalanceGraph(tripId: string): Promise<BalanceGraphDto> {
    return fetchAuth<BalanceGraphDto>(apiUrl(`/trips/${tripId}/balance`), {
        method: "GET",
    });
}

/**
 * Fetch my balance summary for a trip
 */
export async function fetchMyBalanceSummary(tripId: string): Promise<any> {
    return fetchAuth(apiUrl(`/trips/${tripId}/balance-summary`), {
        method: "GET",
    });
}

/**
 * Fetch trip participants/members
 */
export async function fetchTripParticipants(tripId: string): Promise<any[]> {
    return fetchAuth<any[]>(apiUrl(`/trips/${tripId}/participants`), {
        method: "GET",
    });
}


// PLAN API (Days + Activities)

/**
 * Fetch plan (days + activities) for a trip
 */
export async function fetchPlan(tripId: string) {
    return fetchAuth(apiUrl(`/trips/${tripId}/plan`), {
        method: "GET",
    });
}

/**
 * Create a new day
 */
export async function createDay(tripId: string, payload: { date: string }) {
    return fetchAuth(apiUrl(`/trips/${tripId}/days`), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Delete a day
 */
export async function deleteDay(dayId: string) {
    return fetchAuth(apiUrl(`/days/${dayId}`), {
        method: "DELETE",
    });
}

/**
 * Create a new activity
 */
export async function createActivity(dayId: string, payload: any) {
    return fetchAuth(apiUrl(`/days/${dayId}/activities`), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Update an activity
 */
export async function updateActivity(activityId: string, payload: any) {
    return fetchAuth(apiUrl(`/activities/${activityId}`), {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId: string) {
    return fetchAuth(apiUrl(`/activities/${activityId}`), {
        method: "DELETE",
    });
}
