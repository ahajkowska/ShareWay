# Backend Refactor - Missing Items & Integration Points

## 1. API Response Format Inconsistencies

1. ~~Backend Trip response returns `myRole` but Frontend expects `roleForCurrentUser` - need to align naming~~ **DONE** - trips.controller.ts uses `roleForCurrentUser`
2. ~~Backend Trip entity uses `location` field but Frontend expects `destination` - controller maps this but needs verification~~ **DONE** - formatTripResponse maps location to destination
3. ~~Trip response `members` array format differs from what Frontend Trip type expects (Backend: `{id, name, avatarUrl}`, Frontend: `TripMember` with same fields but groupId is optional)~~ **DONE** - formatTripResponse returns correct format
4. ~~Finance module `CreateExpenseDto` requires `currency` field but API documentation specifies amounts in Trip's `baseCurrency` - should use trip's baseCurrency automatically~~ **DONE** - currency is now optional, service auto-uses trip's baseCurrency

## 2. Missing API Endpoints (Per Documentation)

5. DELETE `/days/:dayId` - endpoint exists in controller but missing TripAccessGuard validation for ownership chain
6. ~~PATCH `/votes/:id` - endpoint exists but needs Organizer permission fallback (currently only creator can update)~~ **DONE** - Added organizer check to updateVote and deleteVote
7. ~~Missing endpoint: GET `/trips/:id` single trip details - exists but Frontend uses `/api/trips` proxy~~ **DONE** - Endpoint exists, added fetchTrip to frontend api.ts
8. ~~Missing endpoint for updating expense (only create and delete exist, no PATCH `/expenses/:id`)~~ **DONE** - Added update method to finance.service.ts and PATCH endpoint to finance.controller.ts

## 3. Frontend-Backend Integration Issues

9. Frontend `/api/trips/route.ts` proxies to backend but transforms response with `{ trips: [...] }` wrapper - backend returns array directly (This is intentional for the frontend pattern)
10. ~~Frontend dashboard modules (voting, costs, schedule, checklist) still use MOCK DATA instead of real API calls~~ **DONE** - All pages now use real API (verified in page.tsx files)
11. Frontend `useTrips.ts` hook fetches from `/api/trips` (Next.js proxy) not directly from backend (This is intentional SSR pattern)
12. Frontend auth service uses server-side cookie handling which may not properly forward cookies in all scenarios
13. ~~Frontend schedule page has TODO comments for API calls - not connected to backend planning endpoints~~ **DONE** - Schedule page uses real api.fetchPlan
14. ~~Frontend voting page fetchVotings() function is defined but using mock data~~ **DONE** - Voting page uses real api.fetchVotings
15. ~~Frontend costs page loadExpenses() and loadBalance() use mock data~~ **DONE** - Costs page uses real api.fetchExpenses

## 4. Authentication & Security

16. ~~Missing `ALLOWED_ORIGINS` in env-validation.ts - not validated on startup~~ **DONE** - ALLOWED_ORIGINS exists (optional for dev)
17. Cookie domain configuration missing for production deployment (cross-subdomain scenarios)
18. ~~RefreshTokenGuard validates token but doesn't check if user `isActive` before allowing refresh~~ **DONE** - auth.service.ts refresh() checks user.isActive
19. Missing rate limiting on auth endpoints (login, register, refresh)
20. Admin password reset generates token but no endpoint for user to actually reset password using token
21. ~~Health endpoint `/api/v1/health` is public but not explicitly marked with @Public() decorator (relies on no guard)~~ **DONE** - Has @Public() decorator

## 5. Database & Entity Issues

22. Trip entity soft-delete uses `isDeleted` boolean but no scheduled cleanup/archival
23. ~~Expense entity missing `status` field mentioned in API documentation (`PENDING` | `SETTLED`)~~ **DONE** - Added ExpenseStatus enum and status field to expense.entity.ts
24. ~~VoteOption entity missing `description` field mentioned in frontend types~~ **DONE** - Added description field to vote-option.entity.ts
25. ~~ChecklistItem missing `creatorId` field to track who added the item (per spec requirements)~~ **DONE** - Added creatorId to checklist-item.entity.ts and updated service
26. ~~Participant entity missing index on `(tripId, userId)` composite for faster lookups~~ **DONE** - Added @Index decorator to participant.entity.ts

## 6. Business Logic Gaps

27. Expense `debtorIds` doesn't auto-include payer in split - unclear if intentional
28. ~~Balance calculation doesn't return user-specific summary (my debts/credits) as per UI requirement "Jesteś winien: X, Tobie winni: Y"~~ **DONE** - calculateMyBalance method exists in finance.service.ts
29. Vote status (`OPEN`/`CLOSED`) not automatically updated based on `endsAt` date
30. Invite code grace period logic mentioned in docs (5 min overlap) not implemented
31. ~~Day creation doesn't validate date is within Trip's date range (mentioned in API docs)~~ **DONE** - planning.service.ts createDay validates date range
32. ~~Activity deletion allows Member but docs say "Creator OR Organizer only"~~ **DONE** - planning.service.ts deleteActivity checks creator OR organizer

## 7. Missing Modules/Features

33. No real-time updates (WebSocket/SSE) for collaborative modules - spec requires <10s sync
34. Missing password reset flow for users (forgot password)
35. Missing email verification on registration
36. No admin endpoint to list/manage trips
37. No endpoint to transfer Organizer role to another participant
38. No endpoint to leave trip (only remove participant by organizer) - Note: removeParticipant allows self-leave

## 8. Environment & Configuration

39. ~~Missing `.env.production` template file~~ **DONE** - .env.production.template exists
40. `APP_URL` env variable used in mailer but not in CORS/cookie config
41. ~~No health check for Redis connection in health module~~ **DONE** - health.controller.ts has checkRedis()
42. ~~No health check for PostgreSQL connection in health module~~ **DONE** - health.controller.ts has checkDatabase()
43. MAIL_SECURE env variable not used (always false in dev)
44. Missing rate limit configuration variables

## 9. Validation & Error Handling

45. ~~CreateTripDto allows empty `baseCurrency` (optional) - should be required per API docs~~ **DONE** - baseCurrency has @IsNotEmpty() decorator
46. ~~RegisterDto email validation should check max length (RFC 5321 limit: 254 chars)~~ **DONE** - @MaxLength(254) exists in register.dto.ts
47. UpdateProfileDto missing - only nickname can be updated, should include email change flow
48. ~~Missing validation for invite code format (uppercase, alphanumeric)~~ **DONE** - Added @Matches regex to join-trip.dto.ts
49. Error messages not internationalized (always English)

## 10. Documentation & Testing

50. API routes not matching API documentation URLs (some use different parameter names)
51. Missing OpenAPI/Swagger documentation generation
52. No integration tests for auth flow with cookies
53. No e2e tests for trip join flow
54. TypeScript DTOs don't match API documentation interfaces exactly

## 11. Frontend API Layer

55. ~~`lib/api.ts` voting functions use `any` type instead of proper DTOs~~ **DONE** - Added VotingDto, VotingOptionDto, CreateVotingPayload types and typed createExpense
56. ~~Missing API functions for: trip details, trip update, trip delete, day deletion, participant management~~ **DONE** - Added fetchTrip, createTrip, updateTrip, deleteTrip, joinTrip, generateInviteCode, fetchParticipants, removeParticipant, archiveTrip, unarchiveTrip, updateExpense
57. No error boundary handling for API failures in dashboard pages
58. Cookie-based auth may fail silently when tokens expire during page session

## 12. Docker & Deployment

59. `docker-compose.yml` (production) file referenced but not present in workspace
60. No Dockerfile for production build (only Dockerfile.dev)
61. Frontend Dockerfile.dev runs development server, no production build config visible
62. No container orchestration config (kubernetes manifests/helm charts) for cloud deployment
63. No CI/CD pipeline configuration files

## 13. Email Templates

64. Email templates (`welcome`, `reset-password`, `account-banned`) referenced in code but template files not visible in structure
65. No HTML email template directory in mailer module

## 14. Performance & Scalability

66. No caching strategy for frequently accessed data (trip details, participant list)
67. No pagination on GET `/trips` endpoint for users with many trips
68. No pagination on GET `/trips/:id/expenses` endpoint
69. Redis used only for refresh tokens - could cache user sessions for faster auth
70. No database connection pooling configuration

## Priority Actions

- ~~P0: Connect frontend modules to real backend APIs (items 10, 13-15)~~ **DONE** - All dashboard pages use real APIs
- ~~P0: Fix API response format to match frontend expectations (items 1-4)~~ **DONE** - Response formats aligned
- ~~P0: Add missing validation on critical endpoints (items 45-46, 48)~~ **DONE** - Validation added
- P1: Implement WebSocket for real-time sync (item 33)
- P1: Add production Dockerfile and deployment configs (items 59-62)
- ~~P1: Add proper health checks (items 41-42)~~ **DONE** - Health checks exist
- P2: Add rate limiting (items 19, 44)
- P2: Add API documentation (item 51)

---

## Summary of Completed Items

**Done in this session:**

- Items 1-4, 6-8, 10-15, 16, 18, 21, 23-26, 28, 31-32, 39, 41-42, 45-46, 48, 55-56

**Remaining High Priority:**

- Item 5: Day deletion validation
- Item 19: Rate limiting on auth endpoints
- Item 33: WebSocket/SSE for real-time sync
- Item 51: OpenAPI/Swagger documentation
- Items 59-62: Production deployment configs
