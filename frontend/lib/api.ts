import type {
  ExpenseDto,
  BalanceGraphDto,
} from "@/app/dashboard/[groupId]/costs/types";
import type { Trip } from "@/lib/types/trip";

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
 * API base URL from environment
 */
const normalizeApiBase = (base: string) => {
  const trimmed = base.replace(/\/+$/, "");
  if (trimmed.endsWith("/api") || trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
};

const RAW_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:4001/api/v1";
const PUBLIC_API_URL = normalizeApiBase(RAW_PUBLIC_API_URL);
const INTERNAL_API_URL = process.env.INTERNAL_API_URL
  ? normalizeApiBase(process.env.INTERNAL_API_URL)
  : undefined;

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
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

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
  requestOptions: RequestInit = {},
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

// ============================================
// VOTING API
// ============================================

/**
 * Voting option response type
 */
export interface VotingOptionDto {
  id: string;
  text: string;
  description?: string;
  votes: number;
  voters: string[];
}

/**
 * Voting response type
 */
export interface VotingDto {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  endsAt?: string;
  status: "open" | "closed";
  options: VotingOptionDto[];
  totalVoters: number;
  userVote?: string;
}

/**
 * Create voting request payload
 */
export interface CreateVotingPayload {
  question: string;
  description?: string;
  endDate?: string;
  options: string[];
}

/**
 * Fetch all votings for a trip
 */
export async function fetchVotings(tripId: string): Promise<VotingDto[]> {
  return fetchAuth<VotingDto[]>(apiUrl(`/trips/${tripId}/votes`), {
    method: "GET",
  });
}

/**
 * Create a new voting
 */
export async function createVoting(
  tripId: string,
  data: CreateVotingPayload
): Promise<VotingDto> {
  return fetchAuth<VotingDto>(apiUrl(`/trips/${tripId}/votes`), {
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
 * Remove current user's vote from a voting
 */
export async function removeVoteCast(voteId: string) {
  return fetchAuth(apiUrl(`/votes/${voteId}/cast`), {
    method: "DELETE",
  });
}

/**
 * Update voting details
 */
export async function updateVoting(
  voteId: string,
  payload: { title?: string; description?: string; endsAt?: string | null }
) {
  return fetchAuth(apiUrl(`/votes/${voteId}`), {
    method: "PATCH",
    body: JSON.stringify(payload),
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

export const removeVote = async (votingId: string): Promise<void> => {
  await fetchAuth(apiUrl(`/votes/${votingId}/cast`), {
    method: "DELETE",
  });
};

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
export async function toggleChecklistItemStatus(
  itemId: string,
  isChecked: boolean
) {
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

// ============================================
// COSTS/EXPENSES API
// ============================================

/**
 * Fetch all expenses for a trip
 */
export async function fetchExpenses(tripId: string): Promise<ExpenseDto[]> {
  const response = await fetchAuth<
    ExpenseDto[] | { data: ExpenseDto[] }
  >(apiUrl(`/trips/${tripId}/expenses`), {
    method: "GET",
  });
  if (Array.isArray(response)) {
    return response;
  }
  return response?.data ?? [];
}

/**
 * Create a new expense
 */
export async function createExpense(
  tripId: string,
  payload: {
    amount: number;
    title: string;
    date: string;
    debtorIds: string[];
    paidBy?: string;
    currency?: string;
    description?: string;
    status?: "PENDING" | "SETTLED";
  }
): Promise<ExpenseDto> {
  return fetchAuth<ExpenseDto>(apiUrl(`/trips/${tripId}/expenses`), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update an expense
 */
export async function updateExpense(
  expenseId: string,
  payload: {
    amount?: number;
    title?: string;
    date?: string;
    debtorIds?: string[];
    description?: string;
    status?: "PENDING" | "SETTLED";
  }
): Promise<ExpenseDto> {
  return fetchAuth<ExpenseDto>(apiUrl(`/expenses/${expenseId}`), {
    method: "PATCH",
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
export async function fetchBalanceGraph(
  tripId: string
): Promise<BalanceGraphDto> {
  return fetchAuth<BalanceGraphDto>(apiUrl(`/trips/${tripId}/balance`), {
    method: "GET",
  });
}

/**
 * Fetch personal balance summary for current user
 * Shows "what I owe to others" and "what others owe me"
 */
export async function fetchMyBalance(tripId: string): Promise<{
  myUserId: string;
  myUserName: string;
  balances: Array<{ userId: string; userName: string; balance: number }>;
  totalIOweThem: number;
  totalTheyOweMe: number;
}> {
  return fetchAuth(apiUrl(`/trips/${tripId}/my-balance`), {
    method: "GET",
  });
}

// ============================================
// PLAN API (Days + Activities)
// ============================================

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
 * Delete a day (organizers only)
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

// ============================================
// TRIP MANAGEMENT API
// ============================================

/**
 * Fetch trips list
 */
export async function listTrips(signal?: AbortSignal): Promise<Trip[]> {
  return fetchAuth<Trip[]>(apiUrl("/trips"), {
    method: "GET",
    cache: "no-store",
    signal,
  });
}

/**
 * Fetch single trip details
 */
export async function fetchTrip(tripId: string): Promise<Trip> {
  return fetchAuth<Trip>(apiUrl(`/trips/${tripId}`), {
    method: "GET",
  });
}

/**
 * Create a new trip
 */
export async function createTrip(payload: {
  name: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;
}): Promise<Trip> {
  return fetchAuth<Trip>(apiUrl("/trips"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update trip details (organizer only)
 */
export async function updateTrip(
  tripId: string,
  payload: {
    name?: string;
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Trip> {
  return fetchAuth<Trip>(apiUrl(`/trips/${tripId}`), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a trip (soft delete, organizer only)
 */
export async function deleteTrip(tripId: string): Promise<void> {
  return fetchAuth<void>(apiUrl(`/trips/${tripId}`), {
    method: "DELETE",
  });
}

/**
 * Join a trip using invite code
 */
export async function joinTrip(
  inviteCode: string
): Promise<{ message: string; trip: Trip }> {
  return fetchAuth<{ message: string; trip: Trip }>(apiUrl("/trips/join"), {
    method: "POST",
    body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
  });
}

/**
 * Generate new invite code (organizer only)
 */
export async function generateInviteCode(
  tripId: string
): Promise<{ inviteCode: string; expiresAt: string }> {
  return fetchAuth<{ inviteCode: string; expiresAt: string }>(
    apiUrl(`/trips/${tripId}/invite-code`),
    {
      method: "POST",
    }
  );
}

/**
 * Get trip participants
 */
export async function fetchParticipants(tripId: string): Promise<
  Array<{
    id: string;
    userId: string;
    role: "ORGANIZER" | "PARTICIPANT";
    joinedAt: string;
    user: { id: string; email: string; nickname: string };
  }>
> {
  const data = await fetchAuth<Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: { id: string; email: string; nickname: string };
  }>>(apiUrl(`/trips/${tripId}/participants`), {
    method: "GET",
  });
  
  return data.map(p => ({
    ...p,
    role: p.role.toUpperCase() as "ORGANIZER" | "PARTICIPANT"
  }));
}

/**
 * Remove participant from trip (organizer only, or self-leave)
 */
export async function removeParticipant(
  tripId: string,
  userId: string
): Promise<{ message: string }> {
  return fetchAuth<{ message: string }>(
    apiUrl(`/trips/${tripId}/participants/${userId}`),
    {
      method: "DELETE",
    }
  );
}

/**
 * Archive a trip (organizer or admin)
 */
export async function archiveTrip(tripId: string): Promise<Trip> {
  return fetchAuth<Trip>(apiUrl(`/trips/${tripId}/archive`), {
    method: "PATCH",
  });
}

/**
 * Unarchive a trip (organizer or admin)
 */
export async function unarchiveTrip(tripId: string): Promise<Trip> {
  return fetchAuth<Trip>(apiUrl(`/trips/${tripId}/unarchive`), {
    method: "PATCH",
  });
}

/**
 * Transfer participant role (organizer only)
 * Can promote member to organizer or demote organizer to member
 */
export async function transferRole(
  tripId: string,
  targetUserId: string,
  newRole: "ORGANIZER" | "PARTICIPANT"
): Promise<{ message: string }> {
  return fetchAuth<{ message: string }>(
    apiUrl(`/trips/${tripId}/participants/${targetUserId}/role`),
    {
      method: "PATCH",
      body: JSON.stringify({ targetUserId, newRole: newRole.toLowerCase() }),
    }
  );
}
/**
 * Reset password using token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  return fetchAuth<{ message: string }>(apiUrl("/auth/reset-password"), {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

// ============================================
// ADMIN API
// ============================================

/**
 * Admin user response type
 */
export interface AdminUserDto {
  id: string;
  email: string;
  nickname: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin trip response type
 */
export interface AdminTripDto {
  id: string;
  name: string;
  description?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  createdBy: string;
  participantCount: number;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get all users (admin only)
 */
export async function adminGetAllUsers(
  page: number = 1,
  limit: number = 20
): Promise<{ users: AdminUserDto[]; total: number; page: number; limit: number }> {
  return fetchAuth<{ users: AdminUserDto[]; total: number; page: number; limit: number }>(
    apiUrl(`/admin/users?page=${page}&limit=${limit}`),
    { method: "GET" }
  );
}

/**
 * Get all trips (admin only)
 */
export async function adminGetAllTrips(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<AdminTripDto>> {
  return fetchAuth<PaginatedResponse<AdminTripDto>>(
    apiUrl(`/admin/trips?page=${page}&limit=${limit}`),
    { method: "GET" }
  );
}

/**
 * Get user by ID (admin only)
 */
export async function adminGetUserById(
  userId: string
): Promise<AdminUserDto> {
  return fetchAuth<AdminUserDto>(apiUrl(`/admin/users/${userId}`), {
    method: "GET",
  });
}

/**
 * Ban user (admin only)
 */
export async function adminBanUser(
  userId: string
): Promise<{ message: string }> {
  return fetchAuth<{ message: string }>(apiUrl(`/admin/users/${userId}/ban`), {
    method: "PATCH",
  });
}

/**
 * Unban user (admin only)
 */
export async function adminUnbanUser(
  userId: string
): Promise<{ message: string }> {
  return fetchAuth<{ message: string }>(
    apiUrl(`/admin/users/${userId}/unban`),
    {
      method: "PATCH",
    }
  );
}

/**
 * Reset user password (admin only)
 */
export async function adminResetUserPassword(
  userId: string
): Promise<{ message: string }> {
  return fetchAuth<{ message: string }>(
    apiUrl(`/admin/users/${userId}/reset-password`),
    {
      method: "POST",
    }
  );
}
