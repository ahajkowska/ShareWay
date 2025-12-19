# ShareWay

Aplikacja do wspólnego organizowania i planowania podróży grupowych - od wspólnego planowania, aż po przejrzysty podział kosztów.

## Funkcjonalności

- **Auth** - Bezpieczne logowanie i rejestracja użytkowników
- **Travel** - Dołączanie do grup podróży, dzięki czemu możliwość skorzystania z kolejnych modułów aplikacji.

### Moduły

- **Cost Split** - Przejrzysty podział kosztów między uczestnikami
- **Schedule** - Wspólne planowanie harmonogramu podróży
- **Checklist** - Lista zadań do wykonania przed i podczas wyjazdu, lista przedmiotów do zabrania
- **Voting** - Demokratyczne głosowanie nad decyzjami grupowymi

### Cechy techniczne

- Architektura mikroserwisów
- Konteneryzacja z Docker
- Możliwość używania różnych języków dla każdego serwisu
- Nowoczesny frontend w Next.js

## Tech Stack

### Frontend

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Quick Start

### Wymagania

- Docker Desktop (lub Docker + Docker Compose)
- Node.js 20+ (dla lokalnego developmentu)
- Git

### Instalacja

1. **Sklonuj repozytorium**

...

## Konfiguracja

### Zmienne środowiskowe

Stwórz pliki `.env` w odpowiednich katalogach:

- `frontend/.env.local` (na podstawie `frontend/.env.example`)
  - `PEXELS_API_KEY` – klucz do Pexels API
  - `EMBEDDING_RERANKER_URL` – opcjonalny endpoint serwisu do rerankingu embeddingowego (np. `http://localhost:5005/rerank` albo w docker-compose: `http://embedding-reranker:5005/rerank`)

**Docker Compose**: jeśli uruchamiasz przez `docker-compose`, ustaw `PEXELS_API_KEY` w swoim środowisku lub w pliku `.env` w katalogu głównym – compose przekaże go do kontenera frontu.
Jeżeli chcesz używać rerankingu embeddingowego, dodaj też `EMBEDDING_RERANKER_URL=http://embedding-reranker:5005/rerank`.

...

## Deployment

### Production build

```bash
docker-compose up --build -d
```

### Stop wszystkich serwisów

```bash
docker-compose down
```

### Czyszczenie wolumenów (UWAGA: usunie dane!)

```bash
docker-compose down -v
```

## Team

- [@ahajkowskaa](https://github.com/ahajkowska)
- [@azegler](https://github.com/azegler)
- [@ksvcchh](https://github.com/ksvcchh)
- [@khumianka](https://github.com/khumianka)
- [@Zzysa](https://github.com/Zzysa)
