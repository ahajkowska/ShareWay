<style>

@page {
  size: A4;
  margin: 2.5cm 2.5cm 3cm 2.5cm;
}

body {
  font-family: "Times New Roman", serif;
  font-size: 12pt;
  line-height: 1.6;
  color: #000;
  counter-reset: page;
}

/* ===============================
   NAGŁÓWEK I STOPKA
================================ */

header {
  position: fixed;
  top: -2cm;
  left: 0;
  right: 0;
  height: 1.6cm;
  text-align: center;
  font-size: 11pt;
  font-weight: bold;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #444;
}

header::after {
  content: "ShareWay — Dokumentacja Testów";
}

footer {
  position: fixed;
  bottom: -2cm;
  left: 0;
  right: 0;
  height: 1.6cm;
  text-align: center;
  font-size: 10pt;
  border-top: 1px solid #444;
}

footer::after {
  content: "Strona " counter(page);
}

/* ===============================
   STRONA TYTUŁOWA
================================ */

.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  text-align: center;
}

.cover h1 {
  font-size: 28pt;
  margin-bottom: 30pt;
}

.cover h2 {
  font-size: 20pt;
  margin-bottom: 20pt;
}

.cover h3 {
  font-size: 14pt;
  font-weight: normal;
  margin-bottom: 40pt;
}

.cover p {
  font-size: 12pt;
}

/* ===============================
   NAGŁÓWKI
================================ */

h1, h2, h3, h4 {
  font-weight: bold;
  margin-top: 24pt;
  margin-bottom: 12pt;
}

h1 {
  font-size: 18pt;
  text-align: center;
  page-break-before: always;
}

h2 {
  font-size: 14pt;
  border-bottom: 1px solid #999;
  padding-bottom: 4pt;
}

h3 {
  font-size: 12pt;
}

h4 {
  font-size: 11pt;
}

/* ===============================
   TEKST
================================ */

p {
  text-align: justify;
  margin: 6pt 0;
}

ul, ol {
  margin-left: 1.3cm;
}

li {
  margin: 4pt 0;
}

/* ===============================
   SPIS TREŚCI
================================ */

ul li a {
  text-decoration: none;
  color: black;
}

ul li {
  list-style-type: none;
}

ul li::before {
  content: "• ";
}

/* ===============================
   TABELKI
================================ */

table {
  width: 100%;
  border-collapse: collapse;
  margin: 12pt 0;
  font-size: 11pt;
}

th {
  background: #f0f0f0;
  font-weight: bold;
}

th, td {
  border: 1px solid #000;
  padding: 6pt 8pt;
  vertical-align: top;
}

/* ===============================
   OBRAZY
================================ */

img {
  display: block;
  margin: 12pt auto;
  max-width: 90%;
}

/* ===============================
   PODZIAŁ STRON
================================ */

.page-break {
  page-break-after: always;
}

h1 {
  page-break-before: always;
}

/* ===============================
   SCENARIUSZE TESTOWE
================================ */

.test-case {
  border: 1px solid #ccc;
  padding: 8pt 10pt;
  margin: 12pt 0;
  page-break-inside: avoid;
}

blockquote {
  border-left: 3px solid #aaa;
  margin-left: 1cm;
  padding-left: 8pt;
  color: #555;
  font-style: italic;
}

</style>


<div class="cover">
  <h1>Dokumentacja Testów</h1>
  <h2>ShareWay</h2>
  <h3>Aplikacja do organizacji wyjazdów grupowych</h3>
  <p>Wersja: 1.0</p>
  <p><strong>Zespół:</strong></p>
  <p>Aleksandra Zegler</p>
  <p>Amelia Hajkowska</p>
  <p>Mikita Kasevich</p>
  <p>Stanislau Liatsko</p>
  <p>Kanstantsin Humianka</p>
</div>

<div class="page-break"></div>

<!-- TOC -->
- [1. Strategia testowania i zakres](#1-strategia-testowania-i-zakres)
- [2. Scenariusze testowe](#2-scenariusze-testowe)
  - [2.1. Uwierzytelnianie (Auth)](#21-uwierzytelnianie-auth)
  - [2.2. Rejestracja (Register)](#22-rejestracja-register)
  - [2.3. Zarządzanie podróżą (Trips)](#23-zarządzanie-podróżą-trips)
  - [2.4. Finanse i koszty (Finance)](#24-finanse-i-koszty-finance)
  - [2.5. Harmonogram (Planning)](#25-harmonogram-planning)
  - [2.6. Lista kontrolna (Checklist)](#26-lista-kontrolna-checklist)
  - [2.7. Głosowanie (Voting)](#27-głosowanie-voting)
  - [2.8. Profil użytkownika](#28-profil-użytkownika)
  - [2.9. Panel Administratora (Admin)](#29-panel-administratora-admin)
  - [2.10. Ochrona ścieżek (Routing)](#210-ochrona-ścieżek-routing)
- [3. Raport z testów](#3-raport-z-testów)
  - [3.1. Testy automatyczne (E2E – Playwright)](#31-testy-automatyczne-e2e--playwright)
  - [3.2. Testy manualne (Funkcjonalne)](#32-testy-manualne-funkcjonalne)
  - [3.3 Testy jednostkowe](#33-testy-jednostkowe)
  - [3.4 Zrzut z playwright](#34-zrzut-z-playwright)
  - [3.5 Zrzut z testów jednostkowych](#35-zrzut-z-testów-jednostkowych)
<!-- /TOC -->

<div class="page-break"></div>

## 1. Strategia testowania i zakres

W projekcie ShareWay przyjęto hybrydowy model testowania, łączący testy jednostkowe, testy automatyczne (zapewniające stabilność kluczowych ścieżek) oraz testy manualne (weryfikujące użyteczność i przypadki brzegowe z perspektywy końcowego użytkownika).

**Podział metodologiczny:**

**Testy Automatyczne (End-to-End / E2E):**
- Narzędzie: Playwright
- Zakres: Zautomatyzowano tzw. "Krytyczne Ścieżki Użytkownika" (Happy Paths) na frontendzie. Skrypty uruchamiają prawdziwą przeglądarkę i symulują zachowanie użytkownika. Obejmują proces logowania, rejestracji, walidację formularzy wejściowych oraz ochronę ścieżek (routing).
- Uruchamianie: Automatycznie w procesie CI (Continuous Integration) przy użyciu GitHub Actions po każdym dodaniu nowego kodu do głównej gałęzi repozytorium.

**Testy Manualne (Eksploracyjne i Funkcjonalne):**
- Zakres: Złożone interakcje wewnątrz konkretnej podróży, takie jak: podział kosztów i algorytm ich wyliczania, tworzenie i odznaczanie list kontrolnych, system głosowania oraz harmonogram. Sprawdzana jest również responsywność na urządzeniach mobilnych.
- Środowisko: Testy przeprowadzane na środowisku lokalnym / deweloperskim.

**Testy Jednostkowe**

**Uzasadnienie wyboru strategii hybrydowej:**
Zdecydowaliśmy się na podejście hybrydowe ze względu na specyfikę projektu ShareWay. Zastosowanie testów automatycznych End-to-End (E2E) przy użyciu frameworka Playwright dla modułu uwierzytelniania (Auth/Register) wynika z faktu, że są to najbardziej krytyczne ścieżki w systemie. Ewentualne błędy w tym miejscu całkowicie blokują użytkownikom dostęp do aplikacji. Playwright został wybrany ze względu na doskonałą integrację z Next.js, szybkość działania oraz generowanie czytelnych raportów wizualnych (HTML).

Z kolei moduły takie jak Finanse (podział kosztów), Harmonogram czy Głosowania charakteryzują się bardzo dużą dynamiką interfejsu i skomplikowanymi interakcjami po stronie użytkownika. Z uwagi na ograniczenia czasowe projektu, ich automatyzacja na poziomie E2E przyniosłaby mniejszy zwrot z inwestycji (ROI) niż gruntowne przetestowanie manualne. Testy manualne pozwalają na szybką weryfikację logiki biznesowej i użyteczności (UX) bezpośrednio z perspektywy końcowego użytkownika.

<div class="page-break"></div>

## 2. Scenariusze testowe

Poniżej przedstawiono scenariusze testowe, według których weryfikowano poprawne działanie poszczególnych funkcjonalności systemu ShareWay.

### 2.1. Uwierzytelnianie (Auth)

---

> **[ST-AUTH-01] Załadowanie formularza logowania** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy strona logowania renderuje się poprawnie ze wszystkimi wymaganymi elementami.

**Warunki początkowe:** Aplikacja uruchomiona, użytkownik niezalogowany.

**Kroki:**
1. Wejdź na stronę `/login`.

**Oczekiwany rezultat:** Widoczny nagłówek "Zaloguj się", pole email (`input[type="email"]`), pole hasła (`input[type="password"]`) oraz przycisk "Zaloguj się".

---

> **[ST-AUTH-02] Próba logowania z błędnymi danymi** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy system wyświetla komunikat błędu przy odpowiedzi 401 z serwera.

**Warunki początkowe:** Aplikacja uruchomiona; endpoint `/auth/login` zwraca status 401.

**Kroki:**
1. Wejdź na stronę `/login`.
2. Wypełnij pole "Email" wartością `zle@dane.pl`.
3. Wypełnij pole "Hasło" wartością `ZleHaslo123`.
4. Kliknij przycisk "Zaloguj się".

**Oczekiwany rezultat:** Użytkownik nie zostaje zalogowany. Na stronie pojawia się komunikat "Nieprawidłowy e-mail lub hasło."

---

> **[ST-AUTH-03] Walidacja pustego formularza logowania** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy formularz sygnalizuje brakujące dane przed wysłaniem żądania.

**Warunki początkowe:** Aplikacja uruchomiona, strona `/login` załadowana.

**Kroki:**
1. Kliknij w pole email.
2. Kliknij w pole hasła.
3. Wróć do pola email bez wpisywania danych.

**Oczekiwany rezultat:** Przy polu email widoczny jest komunikat błędu walidacji.

---

> **[ST-AUTH-04] Prawidłowe logowanie użytkownika** *(Test Manualny)*

**Cel:** Weryfikacja, czy użytkownik z poprawnymi danymi może uzyskać dostęp do systemu.

**Warunki początkowe:** Aplikacja uruchomiona, konto `test@shareway.com` z hasłem `Haslo123!` istnieje w bazie danych.

**Kroki:**
1. Wejdź na stronę `/login`.
2. Wypełnij pole "Email" wartością `test@shareway.com`.
3. Wypełnij pole "Hasło" wartością `Haslo123!`.
4. Kliknij przycisk "Zaloguj się".

**Oczekiwany rezultat:** System loguje użytkownika, generuje token sesji i przekierowuje na stronę `/dashboard`.

---

> **[ST-AUTH-05] Odzyskiwanie hasła – wysłanie linku resetującego** *(Test Manualny)*

**Cel:** Weryfikacja działania formularza "Zapomniałem hasła".

**Warunki początkowe:** Konto z adresem `test@shareway.com` istnieje w bazie.

**Kroki:**
1. Na stronie `/login` kliknij link "Zapomniałem hasła".
2. Wprowadź adres `test@shareway.com`.
3. Kliknij "Wyślij link".

**Oczekiwany rezultat:** Wyświetlony zostaje komunikat o wysłaniu wiadomości e-mail. Na skrzynkę dociera mail z linkiem resetującym.

---

> **[ST-AUTH-06] Resetowanie hasła przez link z e-maila** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

> **[ST-AUTH-07] Wygaśnięcie sesji / wylogowanie po czasie nieaktywności** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

### 2.2. Rejestracja (Register)

> **[ST-REG-01] Załadowanie formularza rejestracji** *(Test Automatyczny)*

**Cel:** Weryfikacja poprawnego renderowania strony rejestracji.

**Warunki początkowe:** Aplikacja uruchomiona, użytkownik niezalogowany.

**Kroki:**
1. Wejdź na stronę `/register`.

**Oczekiwany rezultat:** Widoczny nagłówek "Załóż konto", pola: `#reg-name`, `#reg-email`, `#reg-password`, `#reg-confirm`, checkbox zgody oraz przycisk "Zarejestruj się".

---

**[ST-REG-02] Walidacja pola imię – za krótkie (min 2 znaki)** *(Test Automatyczny)*

**Cel:** Weryfikacja walidacji długości pola imienia.

**Warunki początkowe:** Strona `/register` załadowana.

**Kroki:**
1. Wpisz `A` w pole `#reg-name`.
2. Kliknij w pole email.

**Oczekiwany rezultat:** Wyświetlony komunikat błędu `#reg-name-error` zawierający frazę "co najmniej".

---

**[ST-REG-03] Walidacja – hasła nie są identyczne** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy system wykrywa niezgodność haseł.

**Warunki początkowe:** Strona `/register` załadowana.

**Kroki:**
1. Wpisz `Test123!` w pole `#reg-password`.
2. Wpisz `Inne456!` w pole `#reg-confirm`.
3. Kliknij w inne pole.

**Oczekiwany rezultat:** Wyświetlony komunikat błędu `#reg-confirm-error` zawierający frazę "nie są identyczne".

---

**[ST-REG-04] Walidacja formatu e-mail** *(Test Automatyczny)*

**Cel:** Weryfikacja walidacji formatu adresu e-mail.

**Warunki początkowe:** Strona `/register` załadowana.

**Kroki:**
1. Wpisz `zly-email` w pole `#reg-email`.
2. Kliknij w inne pole.

**Oczekiwany rezultat:** Wyświetlony komunikat błędu `#reg-email-error` zawierający frazę "Nieprawidłowy format".

---

**[ST-REG-05] Błąd – e-mail już zajęty** *(Test Automatyczny)*

**Cel:** Weryfikacja obsługi odpowiedzi 409 z serwera przy zajętym adresie e-mail.

**Warunki początkowe:** Endpoint `/auth/register` zwraca status 409.

**Kroki:**
1. Wypełnij formularz poprawnymi danymi (imię, zajęty e-mail, zgodne hasła, checkbox).
2. Kliknij "Zarejestruj się".

**Oczekiwany rezultat:** Wyświetlony komunikat "Ten e-mail jest już zajęty".

---

**[ST-REG-06] Pomyślna rejestracja – nawigacja po formularzu** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy po udanej rejestracji i auto-logowaniu użytkownik opuszcza stronę `/register`.

**Warunki początkowe:** Endpointy `/auth/register`, `/auth/login`, `/users/me` zwracają odpowiedzi sukcesu.

**Kroki:**
1. Wypełnij formularz: imię `Jan Kowalski`, e-mail `jan@shareway.com`, hasło `Test123!`, potwierdzenie `Test123!`, zaznacz checkbox.
2. Kliknij "Zarejestruj się".

**Oczekiwany rezultat:** Adres URL zmienia się – użytkownik nie jest już na `/register`.

---

> **[ST-REG-07] Walidacja siły hasła (wymagania dot. znaków specjalnych/cyfr)** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

> **[ST-REG-08] Rejestracja bez zaznaczenia checkboxa zgody** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

### 2.3. Zarządzanie podróżą (Trips)

> **[ST-TRIPS-01] Tworzenie nowej podróży** *(Test Automatyczny)*

**Cel:** Weryfikacja kreatora nowej podróży.

**Warunki początkowe:** Użytkownik jest zalogowany i znajduje się na widoku `/dashboard`.

**Kroki:**
1. Kliknij przycisk "+" widoczny na stronie `/dashboard`.
2. Wprowadź nazwę, destynację i daty podróży.
3. Zatwierdź formularz klikając "Utwórz podróż".

**Oczekiwany rezultat:** Podróż zostaje utworzona i pojawia się jako karta na liście podróży. Użytkownik otrzymuje rolę "Organizatora".

---

> **[ST-TRIPS-02] Wyświetlanie listy podróży użytkownika** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy dashboard poprawnie wyświetla podróże użytkownika.

**Warunki początkowe:** Użytkownik zalogowany, ma co najmniej jedną podróż.

**Kroki:**
1. Wejdź na stronę `/dashboard`.

**Oczekiwany rezultat:** Na liście widoczne są karty podróży z nazwą, datami i statusem. Podróże, których użytkownik nie jest członkiem nie są wyświetlane.

---

> **[ST-TRIPS-03] Dołączanie do podróży przez kod zaproszenia** *(Test Manualny)*

**Cel:** Weryfikacja mechanizmu dołączania do grupy.

**Warunki początkowe:** Zalogowany użytkownik B posiada kod zaproszenia do podróży utworzonej przez użytkownika A.

**Kroki:**
1. Kliknij "Dołącz do podróży" na stronie `/dashboard`.
2. Wprowadź kod zaproszenia.
3. Kliknij "Dołącz".

**Oczekiwany rezultat:** Podróż pojawia się na liście użytkownika B. Użytkownik B widoczny jest w liście uczestników podróży.

---

> **[ST-TRIPS-04] Edycja szczegółów podróży (nazwa, daty) przez organizatora** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-TRIPS-05] Usunięcie podróży przez organizatora** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-TRIPS-06] Opuszczenie podróży przez uczestnika** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-TRIPS-07] Próba dostępu do podróży przez nieuprawnionego użytkownika** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

### 2.4. Finanse i koszty (Finance)

> **[ST-FIN-01] Dodanie wydatku i podział kosztów** *(Test Manualny)*

**Cel:** Sprawdzenie poprawnego przeliczania bilansu między uczestnikami.

**Warunki początkowe:** Zalogowany użytkownik wchodzi w zakładkę "Koszty" w podróży, w której uczestniczą 3 osoby (A, B, C).

**Kroki:**
1. Kliknij "Dodaj wydatek".
2. Wpisz tytuł "Paliwo" i kwotę "150 PLN".
3. Wybierz "Zapłacone przez: Użytkownik A".
4. Wybierz "Podziel między: Zaznacz wszystkich".
5. Kliknij "Dodaj wydatek".

**Oczekiwany rezultat:** Wydatek pojawia się na liście. W sekcji "Moje saldo" widnieje informacja, że użytkownik B i C są winni użytkownikowi A po 50 PLN.

---

> **[ST-FIN-02] Wyświetlanie listy wydatków podróży** *(Test Manualny)*

**Cel:** Weryfikacja poprawności wyświetlania historii wydatków.

**Warunki początkowe:** Zalogowany użytkownik, podróż z co najmniej jednym dodanym wydatkiem.

**Kroki:**
1. Wejdź w zakładkę "Koszty" w wybranej podróży.

**Oczekiwany rezultat:** Lista zawiera wszystkie dodane wydatki z tytułem, kwotą i płatnikiem. Suma bilansu jest poprawna.

---

> **[ST-FIN-03] Usunięcie wydatku i przeliczenie bilansu** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-FIN-04] Podział kosztów z nierównymi udziałami (kwoty indywidualne)** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-FIN-05] Walidacja – próba dodania wydatku z kwotą 0 lub ujemną** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-FIN-06] Podgląd bilansu całkowitego podróży** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

### 2.5. Harmonogram (Planning)

> **[ST-PLAN-01] Dodanie dnia do harmonogramu** *(Test Manualny)*

**Cel:** Weryfikacja możliwości tworzenia dni w harmonogramie podróży.

**Warunki początkowe:** Zalogowany użytkownik w zakładce "Harmonogram" wybranej podróży.

**Kroki:**
1. Kliknij "Dodaj dzień".
2. Wybierz datę z dostępnego zakresu podróży.
3. Zatwierdź.

**Oczekiwany rezultat:** Nowy dzień pojawia się w harmonogramie z wybraną datą i pustą listą aktywności.

---

> **[ST-PLAN-02] Dodanie aktywności do dnia** *(Test Manualny)*

**Cel:** Weryfikacja dodawania aktywności w ramach dnia harmonogramu.

**Warunki początkowe:** Zalogowany użytkownik, w harmonogramie istnieje dodany co najmniej jeden dzień.

**Kroki:**
1. Kliknij "Dodaj aktywność" przy wybranym dniu.
2. Wypełnij nazwę aktywności i godzinę.
3. Kliknij "Zapisz".

**Oczekiwany rezultat:** Aktywność pojawia się na liście pod wybranym dniem, posortowana według godziny.

---

> **[ST-PLAN-03] Edycja aktywności** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-PLAN-04] Usunięcie dnia wraz z aktywnościami** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-PLAN-05] Próba dodania dnia spoza zakresu dat podróży** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

### 2.6. Lista kontrolna (Checklist)

> **[ST-CHECK-01] Dodanie elementu do listy kontrolnej** *(Test Manualny)*

**Cel:** Weryfikacja dodawania pozycji do listy "do zabrania".

**Warunki początkowe:** Zalogowany użytkownik w zakładce "Lista rzeczy" wybranej podróży.

**Kroki:**
1. Kliknij "+ Dodaj pozycję".
2. Wpisz nazwę np. "Paszport".
3. Kliknij "Dodaj".

**Oczekiwany rezultat:** Element "Paszport" pojawia się na liście z możliwością usunięcia elementu.

---

> **[ST-CHECK-02] Odznaczenie elementu listy kontrolnej** *(Test Manualny)*

**Cel:** Weryfikacja aktualizacji statusu elementu listy.

**Warunki początkowe:** Na liście kontrolnej istnieje co najmniej jeden element.

**Kroki:**
1. Kliknij checkbox przy istniejącym elemencie.

**Oczekiwany rezultat:** Element zostaje oznaczony jako "spakowany" (zmiana koloru czcionki na szarą, oraz przekreślenie tekstu).

---

> **[ST-CHECK-03] Usunięcie elementu z listy kontrolnej** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-CHECK-04] Widoczność zmian statusu dla innych uczestników podróży** *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

### 2.7. Głosowanie (Voting)

> **[ST-VOTE-01] Tworzenie nowego głosowania** *(Test Manualny)*

**Cel:** Weryfikacja możliwości tworzenia ankiet/głosowań w grupie.

**Warunki początkowe:** Zalogowany użytkownik w zakładce "Głosowania" wybranej podróży.

**Kroki:**
1. Kliknij "Utwórz głosowanie".
2. Wprowadź pytanie i dodaj przynajmniej dwie opcje.
3. Kliknij "Utwórz".

**Oczekiwany rezultat:** Nowe głosowanie pojawia się na liście i jest widoczne dla wszystkich uczestników podróży.

---

> **[ST-VOTE-02] Oddanie głosu** *(Test Manualny)*

**Cel:** Weryfikacja oddawania głosu i aktualizacji wyników.

**Warunki początkowe:** Zalogowany użytkownik B, istnieje otwarte głosowanie z opcjami.

**Kroki:**
1. Wejdź w aktywne głosowanie.
2. Kliknij opcję A.
3. Zatwierdź wybór.

**Oczekiwany rezultat:** Głos zostaje zarejestrowany. Licznik opcji A zwiększa się o 1. Wyniki są widoczne na bieżąco.

---

> **[ST-VOTE-03] Wycofanie oddanego głosu** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-VOTE-04] Zamknięcie głosowania przez organizatora** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-VOTE-05] Próba głosowania po zamknięciu ankiety** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

### 2.8. Profil użytkownika

> **[ST-PROF-01] Wyświetlanie danych profilu** – *(Test Automatyczny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-PROF-03] Edycja nicku/imienia użytkownika** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

**Oczekiwany rezultat:**

---

> **[ST-PROF-04] Zmiana hasła z poziomu profilu** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

---

### 2.9. Panel Administratora (Admin)

> **[ST-ADMIN-01] Logowanie na konto administratora** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

---

> **[ST-ADMIN-02] Przeglądanie listy użytkowników** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

---

> **[ST-ADMIN-03] Blokowanie/usuwanie konta użytkownika** – *(Test Manualny)*

**Cel:**

**Warunki początkowe:**

**Kroki:**

---

### 2.10. Ochrona ścieżek (Routing)

---

**[ST-ROUTE-01] Próba wejścia niezalogowanego użytkownika na chronioną ścieżkę** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy niezalogowany użytkownik nie może wejść na chroniony widok aplikacji.

**Warunki początkowe:** Aplikacja uruchomiona, użytkownik niezalogowany.

**Kroki:**
1. Wejdź bezpośrednio pod adres `/dashboard`.

**Oczekiwany rezultat:** Użytkownik zostaje automatycznie przekierowany na stronę `/login`.

---

**[ST-ROUTE-02] Dostęp zalogowanego użytkownika do chronionej ścieżki** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy zalogowany użytkownik może poprawnie wejść na chronioną stronę.

**Warunki początkowe:** Użytkownik zalogowany, endpointy autoryzacyjne zwracają odpowiedzi sukcesu.

**Kroki:**
1. Zaloguj się poprawnymi danymi.
2. Wejdź pod adres `/dashboard`.

**Oczekiwany rezultat:** Użytkownik pozostaje na stronie `/dashboard` i uzyskuje dostęp do jej zawartości.

---

**[ST-ROUTE-03] Wylogowanie użytkownika** *(Test Automatyczny)*

**Cel:** Weryfikacja, czy po kliknięciu przycisku wylogowania sesja jest kończona i użytkownik traci dostęp do chronionych ścieżek.

**Warunki początkowe:** Użytkownik zalogowany, endpoint `/auth/logout` zwraca status 200 (mock).

**Kroki:**
1. Otwórz stronę `/dashboard`.
2. Kliknij avatar użytkownika w navbarze, aby otworzyć menu.
3. Kliknij przycisk „Wyloguj się".
4. Po przekierowaniu wróć bezpośrednio pod adres `/dashboard`.

**Oczekiwany rezultat:** Po kroku 3 użytkownik zostaje przekierowany na stronę główną (`/`). Po kroku 4 aplikacja ponownie przekierowuje na `/login`, potwierdzając zakończenie sesji.


<div class="page-break"></div>

## 3. Raport z testów

Tabela poniżej stanowi zestawienie wyników z przeprowadzonych testów.

### 3.1. Testy automatyczne (E2E – Playwright)

| ID | Nazwa scenariusza | Plik testu | Wynik |
|---|---|---|---|
| ST-AUTH-01 | Załadowanie formularza logowania | `login.spec.ts` | ZALICZONY |
| ST-AUTH-02 | Próba logowania z błędnymi danymi | `login.spec.ts` | ZALICZONY |
| ST-AUTH-03 | Walidacja pustego formularza logowania | `login.spec.ts` | ZALICZONY |
| ST-REG-01 | Załadowanie formularza rejestracji | `register.spec.ts` | ZALICZONY |
| ST-REG-02 | Walidacja pola imię – za krótkie | `register.spec.ts` | ZALICZONY |
| ST-REG-03 | Walidacja – hasła nie są identyczne | `register.spec.ts` | ZALICZONY |
| ST-REG-04 | Walidacja formatu e-mail | `register.spec.ts` | ZALICZONY |
| ST-REG-05 | Błąd – e-mail już zajęty | `register.spec.ts` | ZALICZONY |
| ST-REG-06 | Pomyślna rejestracja – nawigacja | `register.spec.ts` | ZALICZONY |
| ST-TRIPS-01 | Tworzenie nowej podróży | - | Nie przeprowadzono |
| ST-TRIPS-02 | Wyświetlanie listy podróży | - | Nie przeprowadzono  |
| ST-PROF-01 | Wyświetlanie danych profilu | Profil | Nie przeprowadzono |
| ST-ROUTE-01 | Wejście niezalogowanego użytkownika na `/dashboard` | `routing.spec.ts` | ZALICZONY |
| ST-ROUTE-02 | Dostęp zalogowanego użytkownika do `/dashboard` | `routing.spec.ts` | ZALICZONY |
| ST-ROUTE-03 | Wylogowanie użytkownika | `routing.spec.ts` | ZALICZONY |

### 3.2. Testy manualne (Funkcjonalne)

| ID | Nazwa scenariusza | Moduł | Wynik | Uwagi |
|---|---|---|---|---|
| ST-AUTH-04 | Prawidłowe logowanie użytkownika | Auth | ZALICZONY  | — |
| ST-AUTH-05 | Odzyskiwanie hasła – wysłanie linku | Auth | ZALICZONY  | — |
| ST-AUTH-06 | Resetowanie hasła przez link z e-maila | Auth | Nie przeprowadzono |
| ST-AUTH-07 | Wygaśnięcie sesji / wylogowanie | Auth | Nie przeprowadzono |
| ST-REG-07 | Walidacja siły hasła | Register | Nie przeprowadzono |
| ST-REG-08 | Rejestracja bez checkboxa zgody | Register | Nie przeprowadzono |
| ST-TRIPS-03 | Dołączanie przez kod zaproszenia | Trips | ZALICZONY  | — |
| ST-TRIPS-04 | Edycja szczegółów podróży | Trips | Nie przeprowadzono |
| ST-TRIPS-05 | Usunięcie podróży | Trips | Nie przeprowadzono |
| ST-TRIPS-06 | Opuszczenie podróży przez uczestnika | Trips | Nie przeprowadzono |
| ST-TRIPS-07 | Dostęp nieuprawnionego użytkownika | Trips | Nie przeprowadzono |
| ST-FIN-01 | Dodanie wydatku i podział kosztów | Finance | ZALICZONY  | — |
| ST-FIN-02 | Wyświetlanie listy wydatków | Finance | ZALICZONY  | — |
| ST-FIN-03 | Usunięcie wydatku | Finance | Nie przeprowadzono |
| ST-FIN-04 | Podział z nierównymi udziałami | Finance | Nie przeprowadzono |
| ST-FIN-05 | Walidacja kwoty 0 lub ujemnej | Finance | Nie przeprowadzono |
| ST-FIN-06 | Podgląd bilansu całkowitego | Finance | Nie przeprowadzono |
| ST-PLAN-01 | Dodanie dnia do harmonogramu | Planning | NIEZALICZONY  | Dodanie dnia działa tylko za pomocą przycisku "Dodaj dzień"; w przypadku kliknięcia entera - modal z dodaniem dnia się zamyka, ale dzień się nie dodaje. |
| ST-PLAN-02 | Dodanie aktywności do dnia | Planning | NIEZALICZONY  | Dodanie aktywności działa tylko za pomocą przycisku "Dodaj aktywność"; w przypadku kliknięcia entera - modal z dodaniem aktywności się zamyka, ale aktywność nie zostaje dodana. |
| ST-PLAN-03 | Edycja aktywności | Planning | Nie przeprowadzono |
| ST-PLAN-04 | Usunięcie dnia z aktywnościami | Planning | Nie przeprowadzono |
| ST-PLAN-05 | Dzień spoza zakresu dat podróży | Planning | Nie przeprowadzono |
| ST-CHECK-01 | Dodanie elementu listy kontrolnej | Checklist | ZALICZONY  | — |
| ST-CHECK-02 | Odznaczenie elementu listy kontrolnej | Checklist | ZALICZONY | — |
| ST-CHECK-03 | Usunięcie elementu listy kontrolnej | Checklist | Nie przeprowadzono |
| ST-CHECK-04 | Widoczność statusu dla uczestników | Checklist | Nie przeprowadzono |
| ST-VOTE-01 | Tworzenie nowego głosowania | Voting | ZALICZONY  | — |
| ST-VOTE-02 | Oddanie głosu | Voting | ZALICZONY  | — |
| ST-VOTE-03 | Wycofanie oddanego głosu | Voting | Nie przeprowadzono |
| ST-VOTE-04 | Zamknięcie głosowania | Voting | Nie przeprowadzono |
| ST-VOTE-05 | Głosowanie po zamknięciu ankiety | Voting | Nie przeprowadzono |
| ST-PROF-02 | Edycja nicku/imienia | Profil | Nie przeprowadzono |
| ST-PROF-03 | Zmiana hasła z profilu | Profil | Nie przeprowadzono |
| ST-ADMIN-01 | Logowanie administratora | Admin | Nie przeprowadzono |
| ST-ADMIN-02 | Przeglądanie listy użytkowników | Admin | Nie przeprowadzono |
| ST-ADMIN-03 | Blokowanie konta użytkownika | Admin | Nie przeprowadzono |

### 3.3 Testy jednostkowe

### 3.4 Zrzut z playwright

### 3.5 Zrzut z testów jednostkowych