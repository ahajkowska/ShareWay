# ShareWay

Aplikacja do wspólnego organizowania i planowania podróży grupowych - od wspólnego planowania, aż po przejrzysty podział kosztów.

## Funkcjonalności

- **Auth** - Bezpieczne logowanie i rejestracja użytkowników
- **Travel** - Dołączanie do grup podróży, dzięki czemu możliwość skorzystania z kolejnych modułów aplikacji.
- **Cost Split** - System rozliczania wydatków grupowych.
- **Schedule** - Wspólne planowanie harmonogramu podróży
- **Checklist** - Lista zadań do wykonania przed i podczas wyjazdu, lista przedmiotów do zabrania
- **Voting** - System ankiet do wspólnego podejmowania decyzji.

## Tech Stack

### Porty i dostęp do aplikacji:

Aplikacja działa w oparciu o architekturę kontenerową (Docker). Poniżej lista dostępnych usług:

| Usługa | URL / Port | Opis |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:3001](http://localhost:3001) | Aplikacja Next.js (Dev Mode) |
| **API Gateway** | [http://localhost:4000](http://localhost:4000) | Nginx (Punkt wejścia do API) |
| **MailHog UI** | [http://localhost:8025](http://localhost:8025) | Podgląd wysłanych maili (SMTP) |
| **PostgreSQL** | `localhost:5432` | Główna baza danych |
| **Redis** | `localhost:6379` | Cache i zarządzanie sesjami |

...

## Konfiguracja

Aplikacja wymaga pliku `.env` w **głównym katalogu projektu**. NestJS przeprowadza walidację zmiennych przy starcie, więc upewnij się, że wszystkie pola są uzupełnione.

### Zmienne środowiskowe

Stwórz pliki `.env` w odpowiednich katalogach:

- `frontend/.env.local` (na podstawie `frontend/.env.example`)
  - `PEXELS_API_KEY` – klucz do Pexels API
  - `EMBEDDING_RERANKER_URL` – opcjonalny endpoint serwisu do rerankingu embeddingowego (np. `http://localhost:5005/rerank` albo w docker-compose: `http://embedding-reranker:5005/rerank`)

**Docker Compose**: jeśli uruchamiasz przez `docker-compose`, ustaw `PEXELS_API_KEY` w swoim środowisku lub w pliku `.env` w katalogu głównym – compose przekaże go do kontenera frontu.
Jeżeli chcesz używać rerankingu embeddingowego, dodaj też `EMBEDDING_RERANKER_URL=http://embedding-reranker:5005/rerank`.

---

## Quick Start

### Wymagania

- Docker Desktop (lub Docker + Docker Compose)
- Node.js 20+ (dla lokalnego developmentu)
- Git

### Uruchomienie projektu:

1. **Sklonuj repozytorium**
```
git clone [https://github.com/ahajkowska/ShareWay.git](https://github.com/ahajkowska/ShareWay.git)
```

2. **Upewnij się, że masz zainstalowane:**
   - Docker Desktop
   - Docker Compose

3. **Uruchom wszystkie serwisy:**
   ```powershell
   docker compose up -d --build
   ```

4. **Sprawdź status kontenerów:**
   ```powershell
   docker compose ps
   ```

5. **Sprawdź logi (w razie problemów):**
   ```powershell
   # Wszystkie serwisy
   docker compose logs

   # Konkretny serwis
   docker compose logs api
   docker compose logs frontend
   docker compose logs db
   ```

6. **Korzystaj z aplikacji**

Możesz korzystać lokalnie z aplikacji na `http://localhost:4000/`

### Zatrzymanie projektu:

1. **Zatrzymaj projekt:**
   ```powershell
   docker compose down
   ```

2. **Zatrzymaj i usuń volumeny (reset danych):**
   ```powershell
   docker compose down -v
   ```

### Testowanie API:

```powershell
# Test endpointu logowania (powinien zwrócić "Invalid credentials")
Invoke-WebRequest -Uri http://localhost:4000/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"test123"}'
```

### Rozwiązywanie problemów:

1. **Port jest już zajęty:**
   - Zmień porty w pliku `.env` lub zatrzymaj aplikację używającą danego portu

2. **Błędy połączenia z bazą:**
   - Sprawdź czy kontener `db` jest zdrowy: `docker compose ps`
   - Zobacz logi: `docker compose logs db`

3. **Frontend nie łączy się z API:**
   - Sprawdź czy wszystkie kontenery działają: `docker compose ps`
   - Upewnij się, że API działa: `docker compose logs api`
   - Sprawdź czy API Gateway działa: `curl http://localhost:4000/api/auth/login`

---

## Team

- [@ahajkowskaa](https://github.com/ahajkowska)
- [@azegler](https://github.com/azegler)
- [@ksvcchh](https://github.com/ksvcchh)
- [@khumianka](https://github.com/khumianka)
- [@Zzysa](https://github.com/Zzysa)
