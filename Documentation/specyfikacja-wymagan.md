<style>
  .cover {
    text-align: center;
    padding-top: 100px;
    font-family: 'Segoe UI', sans-serif;
  }

  .cover h1 {
    font-size: 48px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .cover h2 {
    font-size: 28px;
    color: #34495e;
    margin-bottom: 30px;
  }

  .cover p {
    font-size: 18px;
    color: #7f8c8d;
  }

  .page-break {
    page-break-after: always;
  }
</style>

<div class="cover">
  <h1>Specyfikacja Wymagań</h1>
  <h2>DLA SHAREWAY</h2>
  <p>Wersja: 1.0</p>
</div>

<div class="page-break"></div>

<!-- TOC -->
- [1. Wprowadzenie](#1-wprowadzenie)
  - [1.1. Cel dokumentu](#11-cel-dokumentu)
  - [1.2. Zakres​ ​produktu](#12-zakres-produktu)
  - [1.3. Literatura](#13-literatura)
- [2. Opis ogólny](#2-opis-ogólny)
  - [2.1 Perspektywa​ ​produktu](#21-perspektywa-produktu)
  - [2.2. Funkcje​ ​produktu](#22-funkcje-produktu)
  - [2.3. Ograniczenia](#23-ograniczenia)
  - [2.4. Dokumentacja​ ​użytkownika](#24-dokumentacja-użytkownika)
  - [2.5. Założenia​ ​i​ ​zależności](#25-założenia-i-zależności)
- [3. Model procesów biznesowych](#3-model-procesów-biznesowych)
  - [3.1. Aktorzy​ ​i​ ​charakterystyka​ ​użytkowników](#31-aktorzy-i-charakterystyka-użytkowników)
  - [3.2. Obiekty​ ​biznesowe](#32-obiekty-biznesowe)
- [4. Wymagania​ ​funkcjonalne](#4-wymagania-funkcjonalne)
  - [4.1 Przypadki użycia](#41-przypadki-użycia)
- [5. Charakterystyka​ ​interfejsów](#5-charakterystyka-interfejsów)
  - [5.1. Interfejs​ ​użytkownika](#51-interfejs-użytkownika)
  - [5.2. Interfejsy​ ​zewnętrzne](#52-interfejsy-zewnętrzne)
    - [5.2.1. Interfejsy​ ​komunikacyjne](#521-interfejsy-komunikacyjne)
- [6. Wymagania​ ​pozafunkcjonalne](#6-wymagania-pozafunkcjonalne)

<!-- /TOC -->

<div class="page-break"></div>

## 1. Wprowadzenie

### 1.1. Cel dokumentu
Dokument stanowi jedyne źródło wymagań aplikacji ShareWay. Stanowi podstawę dla specyfikacji​ ​oprogramowania. <br>
Dokument przeznaczony głównie dla zespołu deweloperskiego zajmującego się 
wytwarzaniem​ ​oprogramowania​ ShareWay. 

### 1.2. Zakres​ ​produktu

Celem projektu jest stworzenie systemu informatycznego ShareWay, którego zadaniem będzie ułatwienie organizacji wyjazdów grupowych — od etapu planowania podróży, aż po rozliczanie kosztów między uczestnikami.

System zostanie zaprojektowany w sposób modułowy, co umożliwi jego ciągły rozwój i rozbudowę o kolejne funkcjonalności.

Wszystkie dane użytkowników oraz grup będą przechowywane w bazie danych, z zachowaniem zasad bezpieczeństwa i ochrony prywatności.

### 1.3. Literatura

1. Ustawa z dnia 29 sierpnia 1997 r. o ochronie danych osobowych (Dz.U. 1997 nr 133 poz. 883, z późn. zm.).

2. Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych.

## 2. Opis ogólny

### 2.1 Perspektywa​ ​produktu
### 2.2. Funkcje​ ​produktu 
### 2.3. Ograniczenia 
### 2.4. Dokumentacja​ ​użytkownika
### 2.5. Założenia​ ​i​ ​zależności

## 3. Model procesów biznesowych

### 3.1. Aktorzy​ ​i​ ​charakterystyka​ ​użytkowników
### 3.2. Obiekty​ ​biznesowe

## 4. Wymagania​ ​funkcjonalne
Wymagania funkcjonalne zostały przedstawione na diagramie przypadków użycia.
W celu zwiększenia czytelności diagram został podzielony na kilka części, odpowiadających poszczególnym aktorom systemu: Gość, Użytkownik, Organizator, Administrator.
Niektóre przypadki użycia mogą się powtarzać, ponieważ kolejne role rozszerzają dostępne funkcjonalności.

Zależność między aktorami przedstawia się następująco:
Użytkownik posiada wszystkie funkcjonalności Gościa,
Organizator posiada wszystkie funkcjonalności Użytkownika,
natomiast Administrator posiada wszystkie funkcjonalności Organizatora.

### 4.1 Przypadki użycia

!!! DIAGRAMY 

Gość -> strona główna, zaloguj się, zarejestruj się

Użytkownik -> 

Organizator ->

Admin -> 

!!!


| ID:                     | **Homepage**      |
| ------                  | ------------------|
| Nazwa:                  | **Strona główna** |
| **Aktorzy główni:**     | Wszyscy |
| **Aktorzy pomocniczy:** | brak    |
| **Poziom:**             | Użytkownika | 
| **Priorytet:**          | P0 |
| **Opis:**               | Ekran powitalny aplikacji zawierający opis systemu, jego funkcje oraz opcje do wyboru. |
| **Wyzwalacze:**         | 1. Gość uruchamia interfejs systemu. |
| **Warunki początkowe:** | 1. Brak |
| **Warunki końcowe:**    | 1. Gość widzi zawartość strony głównej |
| **Scenariusz główny:**  | 1. Gość uruchamia interfejs systemu. <br> 2. System wyświetla stronę główną zawierającą: <br> a. Opcję "Zarejestruj się" <br> b. Opcję "Zaloguj się "<br> c. Opis funkcjonalności aplikacji. |
| **Scenariusze alternatywne:** | Brak |
| **Rozszerzenia:**             | Brak |
| **Wyjątki:**                  | Brak |
| **Dodatkowe wymagania:**      | Brak |


| ID:                     | Register                 |
| ------                  | ------------------------ |
| Nazwa:                  | Rejestracja nowego konta |
| **Aktorzy główni:**     | Gość |
| **Poziom:**             | Użytkownika |
| **Priorytet:**          | P0 |
| **Opis:**               | Gość zakłada nowe konto, aby uzyskać dostęp do funkcji aplikacji i móc tworzyć lub dołączać do grup podróżnych. |
| **Wyzwalacze:**         | 1. Gość wybiera opcję „Zarejestruj się”. |
| **Warunki początkowe:** | Brak |
| **Warunki końcowe:**    | Konto użytkownika zostało zarejestrowane w systemie. |
| **Scenariusz główny:**  | 1. Gość wybiera opcję „Zarejestruj się”. <br> 2. System wyświetla formularz rejestracji konta. <br> 3. Gość wypełnia formularz następującymi danymi: <br> a. e-mail, <br> b. hasło, <br> c. potwierdzenie hasła, <br> d. pseudonim <br> 4. Gość zatwierdza formularz. <br> 5. System tworzy konto. <br> 6. System wyświetla potwierdzenie rejestracji konta Gościowi. |
| **Scenariusze alternatywne:** | Brak |
| **Wyjątki:**                  | 1. Adres e-mail istnieje już w systemie. <br> a. System wyświetla informację o duplikacie. <br> b. System wyświetla ponownie formularz rejestracji. <br> 2. Hasło oraz powtórzone hasło nie są identyczne. <br> a. System wyświetla informację o niepasujących hasłach <br> b. System ponownie wyświetla formularz rejestracji. <br> 3. Hasło nie spełnia wymagań bezpieczeństwa. <br> a. System wyświetla informację o zbyt słabym haśle. <br> b. System ponownie wyświetla formularz rejestracji.|
| **Dodatkowe wymagania:**     | 1. Format​ ​adresu​ ​e-mail​ ​musi​ ​być​ ​sprawdzany​ ​pod​ ​względem​ ​zgodności​ ​z​ ​RFC​ ​5322. <br> 2. Hasło​ ​oraz​ ​powtórzone​ ​hasło​ ​musi​ ​być​ ​sprawdzane​ ​czy​ ​są​ ​identyczne. <br> 3. Hasło musi być sprawdzane czy zawiera przynajmniej 8 znaków, 1 cyfrę, 1 wielką i 1 małą literę​ ​oraz​ ​znak​ ​specjalny. |

| ID:    | Login                    |
| ------ | ------------------------ |
| Nazwa: | Logowanie do systemu     |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P0 |
| **Opis:** | Użytkownik loguje się, aby uzyskać dostęp do swoich grup podróżnych i funkcji aplikacji. |
| **Wyzwalacze:** | 1. Użytkownik wybiera „Zaloguj się”. |
| **Warunki początkowe:** | Konto użytkownika istnieje. |
| **Warunki końcowe:** | Użytkownik jest zalogowany i widzi ekran „Moje podróże”. |
| **Scenariusz główny:** | 1. Użytkownik wybiera „Zaloguj się”. <br> 2. Wprowadza e-mail i hasło. <br> 3. System weryfikuje dane. <br> 4. Po poprawnym logowaniu użytkownik zostaje przekierowany do swojego panelu. |
| **Scenariusze alternatywne:** | Brak. |
| **Wyjątki:** | 1. Nieprawidłowy e-mail lub hasło. <br> a. System wyświetla komunikat o błędzie. <br> b. System wyświetla ponownie formularz logowania. |
| **Dodatkowe wymagania:** | Ze względów bezpieczeństwa, system nie może informować Gościa, które pole formularza zawiera błąd. Komunikat powinien być ogólny np. "Błędny login lub/i hasło".|


| ID:    | CreateTrip               |
| ------ | ------------------------ |
| Nazwa: | Utwórz nową podróż       |
| **Aktorzy główni:** | Organizator |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P0 |
| **Opis:** | Organizator tworzy nową podróż i ustala jej podstawowe parametry, takie jak termin, lokalizacja i dostępne moduły. |
| **Scenariusz główny:** | 1. Organizator wybiera „Utwórz podróż”. <br> 2. Wypełnia formularz: nazwa, opis, termin, lokalizacja. <br> 3. Wybiera moduły (np. planowanie, koszty, głosowanie). <br> 4. System zapisuje podróż i generuje unikalny kod zaproszenia. |
| **Wyjątki:** | Brak wymaganych danych – system prosi o uzupełnienie pól. |
| **Dodatkowe wymagania:** | System powinien umożliwiać późniejszą edycję danych podróży. |


| ID:    | JoinTrip                      |
| ------ | ----------------------------- |
| Nazwa: | Dołącz do istniejącej podróży |
| **Aktorzy główni:** | Użytkownik |
| **Opis:** | Użytkownik dołącza do istniejącej grupy podróżnej poprzez wprowadzenie kodu zaproszenia. |
| **Scenariusz główny:** | 1. Użytkownik wybiera „Dołącz do podróży”. <br> 2. Wpisuje kod zaproszenia. <br> 3. System weryfikuje kod. <br> 4. Jeśli poprawny, użytkownik zostaje dodany do grupy. |
| **Wyjątki:** | Kod niepoprawny lub wygasły – system wyświetla komunikat o błędzie. |
| **Dodatkowe wymagania:** | Kod zaproszenia powinien być unikalny i możliwy do dezaktywacji przez organizatora. |


| ID:    | ManageTrip               |
| ------ | ------------------------ |
| **Aktorzy główni:** | Organizator |
| **Opis:** | Organizator edytuje dane podróży, dodaje lub usuwa uczestników, aktywuje lub dezaktywuje moduły oraz zarządza kosztami. |
| **Scenariusz główny:** | 1. Organizator otwiera panel podróży. <br> 2. Edytuje dane, dodaje moduły lub uczestników. <br> 3. System zapisuje zmiany i aktualizuje widok grupy. |
| **Dodatkowe wymagania:** | System powinien automatycznie powiadamiać uczestników o zmianach. |


| ID:    | AdminPanel               |
| ------ | ------------------------ |
| Nazwa: | Panel administratora     |
| **Aktorzy główni:** | Administrator |
| **Opis:** | Administrator zarządza danymi użytkowników, grup i podróży. Ma możliwość blokowania kont, usuwania treści oraz przeglądania logów systemowych. |
| **Scenariusz główny:** | 1. Administrator loguje się do panelu. <br> 2. Wybiera sekcję (użytkownicy, grupy, zgłoszenia). <br> 3. Wykonuje działania administracyjne. |
| **Dodatkowe wymagania:** | Dostęp wyłącznie dla użytkowników z rolą administratora. |


| ID:    | Settings                 |
| ------ | ------------------------ |
| Nazwa: | Zarządzanie ustawieniami i swoim profilem |
| **Aktorzy główni:** | Użytkownik |
| **Opis:** | Użytkownik edytuje swoje dane profilowe (imię, avatar, e-mail, hasło) oraz zarządza powiadomieniami i prywatnością. |
| **Scenariusz główny:** | 1. Użytkownik otwiera ustawienia konta. <br> 2. Edytuje dane i zapisuje zmiany. <br> 3. System aktualizuje profil i zapisuje konfigurację. |
| **Dodatkowe wymagania:** | Zmiana adresu e-mail wymaga potwierdzenia przez wiadomość e-mail. |


| ID:    | VotingModule             |
| ------ | ------------------------ |
| Nazwa: | Głosowanie               |
| **Aktorzy główni:** | Użytkownik |
| **Opis:** | Moduł umożliwia użytkownikom grupy przeprowadzanie głosowań, np. w wyborze miejsca noclegu lub środka transportu. Wyniki prezentowane są w formie wykresu (pie chart). |
| **Scenariusz główny:** | 1. Użytkownik tworzy głosowanie, dodając propozycje. <br> 2. Członkowie grupy oddają głosy. <br> 3. System aktualizuje wykres wyników w czasie rzeczywistym. |
| **Dodatkowe wymagania:** | Możliwość dodawania nowych opcji głosowania w trakcie trwania ankiety. |


| ID:    | PlanningModule           |
| ------ | ------------------------ |
| Nazwa: | Planowanie wyjazdu       |
| **Aktorzy główni:** | Użytkownik |
| **Opis:** | Moduł umożliwia planowanie harmonogramu podróży – dodawanie dni, aktywności, godzin i lokalizacji. |
| **Scenariusz główny:** | 1. Użytkownik otwiera moduł planowania. <br> 2. Dodaje kolejne dni i aktywności. <br> 3. System zapisuje plan i udostępnia go wszystkim uczestnikom grupy. |
| **Dodatkowe wymagania:** | System powinien umożliwiać eksport planu do kalendarza (np. Google Calendar). |


| ID:    | CostSharingModule        |
| ------ | ------------------------ |
| Nazwa: | Podział kosztów          |
| **Aktorzy główni:** | Użytkownik |
| **Opis:** | Moduł umożliwia użytkownikom wprowadzanie wydatków oraz automatyczne wyliczanie, kto komu i ile powinien zwrócić. |
| **Scenariusz główny:** | 1. Użytkownik dodaje nowy wydatek (kwota, opis, kto zapłacił). <br> 2. System aktualizuje bilans dla każdego uczestnika. <br> 3. Użytkownicy widzą podsumowanie kosztów i rozliczeń. |
| **Dodatkowe wymagania:** | Możliwość eksportu raportu kosztów do pliku CSV/PDF. |


| ID:    | ChecklistModule          |
| ------ | ------------------------ |
| Nazwa: | Lista kontrolna          |
| **Aktorzy główni:** | Użytkownik |
| **Opis:** | Moduł pozwala uczestnikom tworzyć wspólną listę rzeczy do zabrania lub zadań do wykonania przed podróżą. |
| **Scenariusz główny:** | 1. Użytkownik otwiera listę kontrolną. <br> 2. Dodaje nowe pozycje (np. „ładowarka”, „namiot”). <br> 3. Członkowie grupy mogą odznaczać wykonane pozycje. |
| **Dodatkowe wymagania:** | Lista powinna aktualizować się w czasie rzeczywistym między uczestnikami. |


## 5. Charakterystyka​ ​interfejsów

### 5.1. Interfejs​ ​użytkownika 
### 5.2. Interfejsy​ ​zewnętrzne 
#### 5.2.1. Interfejsy​ ​komunikacyjne 

## 6. Wymagania​ ​pozafunkcjonalne