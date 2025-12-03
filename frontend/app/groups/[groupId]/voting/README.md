# Moduł Głosowania (Voting)

## Integracja z Backendem

### Endpointy API

Frontend korzysta z następujących endpointów zgodnie z dokumentacją backendu:

| Metoda | Endpoint | Auth | Opis |
|--------|----------|------|------|
| `GET` | `/api/trips/:id/votes` | Member | Pobiera listę wszystkich głosowań dla podróży |
| `POST` | `/api/trips/:id/votes` | Member | Tworzy nowe głosowanie |
| `POST` | `/api/votes/:voteId/cast` | Member | Oddaje głos (payload: `{ "optionIds": [] }`) |
| `POST` | `/api/votes/:voteId/options` | Member | Dodaje nową opcję do głosowania * | TEGO NIE MA W PLIKU
| `DELETE` | `/api/votes/:voteId` | Member/Organizer | Usuwa głosowanie * | TEGO NIE MA W PLIKU

\* Endpoint założony - zweryfikuj z dokumentacją backendu

### Format danych

#### CreateVoteDto (POST /trips/:id/votes)
```typescript
{
  title: string;
  description?: string;
  allowAddingOptions: boolean;
  allowMultipleVotes: boolean;
  showResultsBeforeVoting: boolean;
  endsAt?: string; // ISO 8601
  options: Array<{ text: string }>;
}
```

#### VoteDto (Response)
```typescript
{
  id: string;
  groupId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  endsAt?: Date;
  isActive: boolean;
  allowAddingOptions: boolean;
  allowMultipleVotes: boolean;
  showResultsBeforeVoting: boolean;
  options: VotingOption[];
}
```

### Konfiguracja

Aby połączyć frontend z backendem, upewnij się że:

1. **API URL jest poprawnie skonfigurowany:**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

2. **CORS jest skonfigurowany w backendzie:**
   ```typescript
   // Backend CORS config
   origin: 'http://localhost:3000'
   ```

3. **Double-Token Authentication:**
   - Access token w httpOnly cookie (krótki TTL)
   - Refresh token w httpOnly cookie (długi TTL)
   - Automatyczne odświeżanie tokena przy 401
   - Używane przez `fetchAuth()` z `lib/api.ts`
   - Backend endpoint: `POST /auth/refresh`

### Testowanie

#### Z mock data (bez backendu)
1. Odkomentuj sekcję mock data w `page.tsx` (linia ~60)
2. Zakomentuj prawdziwe wywołania API
3. Uruchom: `npm run dev`

#### Z prawdziwym backendem
1. Upewnij się że backend działa na `http://localhost:4000`
2. Zakomentuj mock data w `page.tsx`
3. Odkomentuj prawdziwe wywołania API (już zrobione)
4. Uruchom: `npm run dev`

### Znane ograniczenia

- Endpoint `POST /votes/:voteId/options` może wymagać weryfikacji z dokumentacją backendu
- Endpoint `DELETE /votes/:voteId` może wymagać uprawnień Organizatora
- Brak obsługi wielokrotnego głosowania (`allowMultipleVotes`) - wymaga logiki backendowej

### TODO

- [ ] Dodać obsługę błędów HTTP (403, 404, 500) z przyjaznym UI
- [ ] Dodać loading states dla wszystkich operacji
- [ ] Dodać toast notifications zamiast `alert()`
- [ ] Zweryfikować endpoint dodawania opcji (`POST /votes/:voteId/options`)
- [ ] Dodać obsługę paginacji dla dużej liczby głosowań
- [ ] Dodać real-time updates (WebSocket/SSE)
- [ ] Dodać redirect do logowania gdy session wygasła (AuthError 401)

## Autoryzacja

### Double-Token Authentication Flow

System używa **httpOnly cookies** do przechowywania tokenów:

1. **Access Token** (krótki TTL, np. 15 min)
   - Wysyłany automatycznie w każdym requeście
   - Przechowywany w httpOnly cookie
   
2. **Refresh Token** (długi TTL, np. 7 dni)
   - Używany do odświeżania access tokena
   - Przechowywany w httpOnly cookie

3. **Automatyczne odświeżanie:**
   ```typescript
   // fetchAuth automatycznie:
   // 1. Wysyła request z cookies
   // 2. Jeśli 401 → wywołuje POST /auth/refresh
   // 3. Retry oryginalnego requesta z nowym tokenem
   ```

### Konfiguracja backendu

Upewnij się że backend endpoint jest poprawny:

```typescript
// lib/api.ts
const AUTH_CONSTANTS = {
  AUTH_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  REFRESH_ACCESS_TOKEN_ENDPOINT: 'auth/refresh', // Zmień jeśli inny
};
```

### Jak to działa

1. Użytkownik loguje się → backend ustawia httpOnly cookies
2. Frontend wywołuje `fetchAuth()` → cookies wysyłane automatycznie
3. Jeśli token wygasł (401) → `fetchAuth` wywołuje `/auth/refresh`
4. Backend odświeża token i ustawia nowe cookies
5. `fetchAuth` automatycznie retry oryginalnego requesta

### Wymagania backendu

Backend musi:
- Ustawić `credentials: 'include'` w CORS
- Wysyłać tokeny jako httpOnly cookies
- Mieć endpoint `POST /auth/refresh` do odświeżania tokenów
- Zwracać 401 gdy token jest invalid/expired

### Testowanie

Nie musisz ręcznie zarządzać tokenami! Backend ustawia cookies podczas logowania.

```typescript
// Login request (przykład)
await fetchAuth(apiUrl('/auth/login'), {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
// Backend automatycznie ustawia httpOnly cookies
```

