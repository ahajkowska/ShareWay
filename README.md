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
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Backend (Mikroserwisy)
- **Auth Service**: ?
- **Cost Split**: ?
- **Schedule**: ?
- **Checklist**: ?
- **Voting**: ?

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **API Gateway**: ?
- **Databases**: 
  - ?
- **Authentication**: ?

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
-

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

- [@ahajkowskaa](https://github.com/ahajkowskaa)
- [@azegler](https://github.com/azegler)
- [@ksvcchh](https://github.com/ksvcchh)
- [@khumianka](https://github.com/khumianka)
- [@Zzysa](https://github.com/Zzysa)
