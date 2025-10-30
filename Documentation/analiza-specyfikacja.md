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
- [1. Temat projektu](#1-temat-projektu)
- [2. Cel projektu](#2-cel-projektu)
- [3. Założenia pracy (systemu do realizacji)](#3-założenia-pracy-systemu-do-realizacji)
- [4. Wymagania​ ​funkcjonalne i niefunkcjonalne](#4-wymagania-funkcjonalne-i-niefunkcjonalne)
  - [5.1 Wymagania niefunkcjonalne](#51-wymagania-niefunkcjonalne)
    - [Wymagania dotyczące wydajności](#wymagania-dotyczące-wydajności)
  - [5.2 Wymagania funkcjonalne](#52-wymagania-funkcjonalne)
- [6. Dokumentacja przypadków użycia](#6-dokumentacja-przypadków-użycia)
- [7. Przypisanie aktorów, nadanie im działań, powiązania](#7-przypisanie-aktorów-nadanie-im-działań-powiązania)
- [8. Omówienie położeń diagramu](#8-omówienie-położeń-diagramu)

<!-- /TOC -->

<div class="page-break"></div>

## 1. Temat projektu
System wspomagający organizację podróży.

## 2. Cel projektu

Celem projektu jest stworzenie systemu informatycznego ShareWay, którego zadaniem będzie ułatwienie organizacji wyjazdów grupowych — od etapu planowania podróży, aż po rozliczanie kosztów między uczestnikami.

System zostanie zaprojektowany w sposób modułowy, co umożliwi jego ciągły rozwój i rozbudowę o kolejne funkcjonalności.

Wszystkie dane użytkowników oraz grup będą przechowywane w bazie danych, z zachowaniem zasad bezpieczeństwa i ochrony prywatności.

## 3. Założenia pracy (systemu do realizacji)

**3.1. Założenia ogólne**

System będzie działał w architekturze klient-serwer z wykorzystaniem nowoczesnych technologii webowych.

Komunikacja między klientem a serwerem odbywać się będzie przy pomocy protokołu HTTPS i wymiany danych w formacie JSON.

System przechowuje dane użytkowników, podróży oraz grup w relacyjnej bazie danych.

Każdy użytkownik systemu musi posiadać konto użytkownika (rejestracja, logowanie).

System umożliwia tworzenie grup podróżnych, do których można dołączać za pomocą unikalnego kodu zaproszenia.

Użytkownicy mogą planować podróż, dzielić koszty, głosować i tworzyć listy kontrolne.

Administrator posiada dostęp do panelu zarządzania użytkownikami i grupami.

System ma być responsywny — działać poprawnie na komputerach, tabletach i urządzeniach mobilnych.

Wersja 1.0 systemu obejmuje wdrożenie kluczowych modułów: Rejestracja, Logowanie, Zarządzanie podróżą, Głosowanie, Planowanie, Podział kosztów, Lista kontrolna, Ustawienia i Panel administratora.

**3.2. Założenia techniczne**

Frontend – technologia React (lub równoważna biblioteka SPA).

Backend – środowisko Node.js / Express (lub równoważne frameworki).

Baza danych – PostgreSQL lub MySQL.

Architektura – REST API.

Autoryzacja – JWT (JSON Web Token).

**3.3. Założenia projektowe**

System ma być modułowy, z możliwością rozbudowy o kolejne funkcje.

Moduły powinny być niezależne funkcjonalnie, ale współpracujące przez wspólny system logowania i grup.

Projekt interfejsu ma być czytelny i spójny graficznie (jednolita kolorystyka, intuicyjna nawigacja).

Kod źródłowy powinien być napisany zgodnie ze standardami Clean Code i SOLID.

Dokumentacja techniczna i użytkowa ma być częścią końcowego produktu.

## 4. Wymagania​ ​funkcjonalne i niefunkcjonalne 

Wymagania funkcjonalne zostały przedstawione na diagramie przypadków użycia. Są na nim przedstawione funkcjonalności, odpowiadające poszczególnym aktorom systemu: Gość, Użytkownik, Admin.
Niektóre przypadki użycia mogą się powtarzać, ponieważ kolejne role rozszerzają dostępne funkcjonalności.

Zależność między aktorami przedstawia się następująco:
* Użytkownik posiada wszystkie funkcjonalności Gościa,
* Organizator posiada wszystkie funkcjonalności Użytkownika,
* Admin posiada wszystkie funkcjonalności Organizatora.

![Aktorzy](img/4_aktorzy.drawio.png)

### 5.1 Wymagania niefunkcjonalne

Wymagania niefunkcjonalne określają właściwości jakościowe systemu ShareWay, które nie opisują jego bezpośrednich funkcji, lecz definiują sposób ich realizacji. Mają one kluczowe znaczenie dla wydajności, bezpieczeństwa, niezawodności i użyteczności aplikacji.

#### Wymagania dotyczące wydajności

**Czas odpowiedzi systemu**
* Średni czas odpowiedzi interfejsu użytkownika nie powinien przekraczać 2 sekund.
* Dla operacji obciążających bazę danych (np. tworzenie podróży, dodawanie wydatków) – maksymalnie 5 sekund.

**Obsługa wielu użytkowników**
* System powinien umożliwiać jednoczesne korzystanie z aplikacji przez wielu użytkowników bez zauważalnego spadku wydajności.

**Wymagania dotyczące bezpieczeństwa**
* Uwierzytelnianie i autoryzacja

Dostęp do zasobów systemu powinien być zabezpieczony poprzez mechanizm JWT (JSON Web Token) lub inny równoważny standard.

Wszelkie działania użytkowników powinny być ograniczone przez przypisane role (Gość, Użytkownik, Admin).

**Przechowywanie haseł**
* Hasła muszą być przechowywane w formie zaszyfrowanej przy użyciu algorytmu np. bcrypt.

**Odporność na błędy**

* System musi obsługiwać błędy w sposób kontrolowany – komunikaty o błędach nie mogą ujawniać szczegółów technicznych aplikacji.
* W przypadku awarii modułu, aplikacja powinna zachować podstawową funkcjonalność.

**Wymagania dotyczące użyteczności (UX/UI)**

* Intuicyjny interfejs
* System powinien być czytelny i prosty w obsłudze.
* Aplikacja musi być w pełni responsywna — poprawnie wyświetlać się na urządzeniach mobilnych, tabletach i komputerach.

**Wymagania dotyczące utrzymania i rozwoju**
* Modularność - System powinien być zbudowany w architekturze modułowej, umożliwiającej łatwe dodawanie nowych funkcji.

### 5.2 Wymagania funkcjonalne

**Use Case 1: Homepage**
* WF1: System wyświetla stronę główną po uruchomieniu.
* WF2: Strona główna zawiera przyciski „Zarejestruj się” i „Zaloguj się”.
* WF3: Strona główna pokazuje opis funkcjonalności aplikacji.

**Use Case 2: Register**
* WF4: System umożliwia wprowadzenie e-maila, hasła, potwierdzenia hasła i pseudonimu.
* WF5: System weryfikuje unikalność adresu e-mail.
* WF6: System weryfikuje zgodność hasła i potwierdzenia hasła.
* WF7: System sprawdza wymagania bezpieczeństwa hasła.
* WF8: System tworzy konto i potwierdza rejestrację.

**Use Case 3: Login**
* WF9: System pozwala na wprowadzenie e-maila i hasła.
* WF10: System weryfikuje dane logowania i pozwala zalogować użytkownika.
* WF11: System wyświetla ogólny komunikat o błędzie, jeśli dane są nieprawidłowe.

**Use Case 4: CreateTrip**
* WF12: System umożliwia utworzenie nowej podróży poprzez formularz z nazwą, terminem i lokalizacją.
* WF13: System generuje unikalny kod zaproszenia dla nowej podróży.
* WF14: System umożliwia późniejszą edycję danych podróży przez organizatora.

**Use Case 5: JoinTrip**
* WF15: System pozwala użytkownikowi wprowadzić kod zaproszenia, aby dołączyć do istniejącej podróży.
* WF16: System weryfikuje poprawność kodu zaproszenia.
* WF17: System dodaje użytkownika do grupy, jeśli kod jest poprawny.
* WF18: System wyświetla komunikat o błędzie, jeśli kod jest niepoprawny.

**Use Case 6: ViewTrip**
* WF19: System wyświetla listę grup podróżnych, do których należy użytkownik.
* WF20: System wyświetla komunikat, jeśli użytkownik nie należy do żadnej grupy.
* WF21: System pozwala użytkownikowi kliknąć grupę, aby uzyskać dostęp do modułów podróży.
* WF22: System umożliwia edycję danych podróży tworzonych przez użytkownika.

**Use Case 7: AdminPanel**
* WF23: System umożliwia dostęp do panelu administracyjnego tylko użytkownikom z rolą admina.
* WF24: System umożliwia wyszukiwanie i filtrowanie użytkowników oraz grup.
* WF25: System umożliwia edycję danych użytkowników i grup.
* WF26: System zapisuje zmiany dokonane przez administratora i potwierdza zapis.
* WF27: System wyświetla komunikat o braku uprawnień, jeśli użytkownik nie jest administratorem.
* WF28: System obsługuje błędy zapisu danych w panelu administracyjnym.

**Use Case 8: Settings**
* WF29: System pozwala użytkownikowi otworzyć ustawienia konta.
* WF30: System umożliwia edycję danych konta (e-mail, hasło, inne dane).
* WF31: System weryfikuje, czy nowy e-mail nie jest już w systemie.
* WF32: System weryfikuje poprawność powtórzonego hasła.
* WF33: System sprawdza wymagania bezpieczeństwa dla nowego hasła.
* WF34: System aktualizuje profil użytkownika po zapisaniu zmian.
* WF35: System wymaga potwierdzenia aktualnych danych przy zmianie e-maila lub hasła.

**Use Case 9: VotingModule**
* WF36: System umożliwia utworzenie głosowania przez użytkownika.
* WF37: System pozwala członkom grupy oddać głos.
* WF38: System aktualizuje i wyświetla wyniki głosowania.
* WF39: System pozwala dodać nowe opcje głosowania w trakcie trwania ankiety.
* WF40: System uniemożliwia oddanie głosu więcej niż raz w danym głosowaniu.
* WF41: System pozwala użytkownikowi zmienić swój głos.

**Use Case 10: PlanningModule**
* WF42: System umożliwia dodawanie dni i aktywności do planu podróży.
* WF43: System zapisuje plan podróży i udostępnia go wszystkim uczestnikom.
* WF44: System pozwala na edycję planu wszystkim użytkownikom grupy.

**Use Case 11: CostSharingModule**
* WF45: System umożliwia dodanie wydatku (kwota, opis, kto zapłacił).
* WF46: System automatycznie aktualizuje bilans uczestników.
* WF47: System wyświetla podsumowanie kosztów i rozliczeń dla wszystkich użytkowników.
* WF48: System pokazuje indywidualne rozliczenia dla każdego użytkownika.

**Use Case 12: ChecklistModule**
* WF49: System pozwala dodawać nowe pozycje do listy kontrolnej.
* WF50: System umożliwia odznaczanie wykonanych pozycji przez członków grupy.
* WF51: System synchronizuje zmiany listy kontrolnej dla wszystkich uczestników grupy.

## 6. Dokumentacja przypadków użycia

Wymagania funkcjonalne zostały przedstawione na diagramie przypadków użycia. Są na nim przedstawione funkcjonalności, odpowiadające poszczególnym aktorom systemu: Gość, Użytkownik, Admin.
Niektóre przypadki użycia mogą się powtarzać, ponieważ kolejne role rozszerzają dostępne funkcjonalności.

Zależność między aktorami przedstawia się następująco:
* Użytkownik posiada wszystkie funkcjonalności Gościa,
* Organizator posiada wszystkie funkcjonalności Użytkownika,
* Admin posiada wszystkie funkcjonalności Organizatora.

![Diagram użytkowy](img/4_diagram_uzytkowy_projekt.png)

| ID:                     | 1 **Homepage**      |
| ------                  | ------------------|
| Nazwa:                  | **Strona główna** |
| **Aktorzy główni:**     | Wszyscy |
| **Aktorzy pomocniczy:** | brak    |
| **Poziom:**             | Użytkownika | 
| **Priorytet:**          | P0 |
| **Opis:**               | Ekran powitalny aplikacji zawierający opis systemu, jego funkcje oraz opcje do wyboru. |
| **Wyzwalacze:**         | **1.** Admin uruchamia interfejs systemu. |
| **Warunki początkowe:** | **1.** Brak |
| **Warunki końcowe:**    | **1.** Gość widzi zawartość strony głównej |
| **Scenariusz główny:**  | **1.** Gość uruchamia interfejs systemu. <br> **2.** System wyświetla stronę główną zawierającą: <br> a. Opcję "Zarejestruj się" <br> b. Opcję "Zaloguj się "<br> c. Opis funkcjonalności aplikacji. |
| **Scenariusze alternatywne:** | Brak |
| **Wyjątki:**                  | Brak |
| **Dodatkowe wymagania:**      | Brak |


| ID:                     | 2 Register                 |
| ------                  | ------------------------ |
| Nazwa:                  | **Rejestracja nowego konta** |
| **Aktorzy główni:**     | Gość |
| **Poziom:**             | Użytkownika |
| **Priorytet:**          | P0 |
| **Opis:**               | Gość zakłada nowe konto, aby uzyskać dostęp do funkcji aplikacji i móc tworzyć lub dołączać do grup podróżnych. |
| **Wyzwalacze:**         | **1.** Gość wybiera opcję „Zarejestruj się”. |
| **Warunki początkowe:** | Brak |
| **Warunki końcowe:**    | Konto użytkownika zostało zarejestrowane w systemie. |
| **Scenariusz główny:**  | **1.** Gość wybiera opcję „Zarejestruj się”. <br> **2.** System wyświetla formularz rejestracji konta. <br> **3.** Gość wypełnia formularz następującymi danymi: <br> a. e-mail, <br> b. hasło, <br> c. potwierdzenie hasła, <br> d. pseudonim <br> **4.** Gość zatwierdza formularz. <br> **5.** System tworzy konto. <br> **6.** System wyświetla potwierdzenie rejestracji konta Gościowi. |
| **Scenariusze alternatywne:** | Brak |
| **Wyjątki:**                  | **1.** Adres e-mail istnieje już w systemie. <br> a. System wyświetla informację o duplikacie. <br> b. System wyświetla ponownie formularz rejestracji. <br> **2.** Hasło oraz powtórzone hasło nie są identyczne. <br> a. System wyświetla informację o niepasujących hasłach <br> b. System ponownie wyświetla formularz rejestracji. <br> **3.** Hasło nie spełnia wymagań bezpieczeństwa. <br> a. System wyświetla informację o zbyt słabym haśle. <br> b. System ponownie wyświetla formularz rejestracji.|
| **Dodatkowe wymagania:**     | **1.** Format​ ​adresu​ ​e-mail​ ​musi​ ​być​ ​sprawdzany​ ​pod​ ​względem​ ​zgodności​ ​z​ ​RFC​ ​5322. <br> **2.** Hasło​ ​oraz​ ​powtórzone​ ​hasło​ ​musi​ ​być​ ​sprawdzane​ ​czy​ ​są​ ​identyczne. <br> **3.** Hasło musi być sprawdzane czy zawiera przynajmniej 8 znaków, 1 cyfrę, 1 wielką i 1 małą literę​ ​oraz​ ​znak​ ​specjalny. |

| ID:    | 3 Login                    |
| ------ | ------------------------ |
| Nazwa: | **Logowanie do systemu**     |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P0 |
| **Opis:** | Użytkownik loguje się, aby uzyskać dostęp do swoich grup podróżnych i funkcji aplikacji. |
| **Wyzwalacze:** | **1.** Użytkownik wybiera „Zaloguj się”. |
| **Warunki początkowe:** | Konto użytkownika istnieje. |
| **Warunki końcowe:** | Użytkownik jest zalogowany i ma dostęp do funkcji aplikacji. |
| **Scenariusz główny:** | **1.** Użytkownik wybiera „Zaloguj się”. <br> **2.** Wprowadza e-mail i hasło. <br> **3.** System weryfikuje dane. <br> **4.** Po poprawnym logowaniu użytkownik zostaje przekierowany do swojego panelu. |
| **Scenariusze alternatywne:** | Brak. |
| **Wyjątki:** | **1.** Nieprawidłowy e-mail lub hasło. <br> a. System wyświetla komunikat o błędzie. <br> b. System wyświetla ponownie formularz logowania. |
| **Dodatkowe wymagania:** | Ze względów bezpieczeństwa, system nie może informować Gościa, które pole formularza zawiera błąd. Komunikat powinien być ogólny np. "Błędny login lub/i hasło".|


| ID:    | 4 CreateTrip               |
| ------ | ------------------------ |
| Nazwa: | **Utwórz nową podróż**       |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P0 |
| **Opis:** | Użytkownik tworzy nową podróż i ustala jej podstawowe parametry, takie jak nazwa, termin, lokalizacja. |
| **Wyzwalacze:** | **1.** Użytkownik klika przycisk "Create".|
| **Warunki początkowe:** | Użytkownik jest zalogowany. |
| **Warunki końcowe:** | Nowa grupa podróżna została utworzona. |
| **Scenariusz główny:** | **1.** Organizator wybiera „Utwórz podróż”. <br> **2.** Wypełnia formularz: nazwa, termin, lokalizacja. <br> **3.** Organizator klika "Zapisz", aby zapisać formularz. <br> **4.** System zapisuje podróż i generuje unikalny kod zaproszenia. |
| **Scenariusze alternatywne:** | Brak. |
| **Wyjątki:** | **1.** Brak wymaganych danych. <br> a. System prosi o uzupełnienie pól. |
| **Dodatkowe wymagania:** | System powinien umożliwiać organizatorowi późniejszą edycję danych podróży. |


| ID:    | 5 JoinTrip                      |
| ------ | ----------------------------- |
| Nazwa: | **Dołącz do istniejącej podróży** |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P0 |
| **Opis:** | Użytkownik dołącza do istniejącej grupy podróżnej poprzez wprowadzenie kodu zaproszenia. |
| **Wyzwalacze:** | **1.** Użytkownik klika przycisk "Join".|
| **Warunki początkowe:** | Użytkownik jest zalogowany. |
| **Warunki końcowe:** | Użytkownik pomyślnie dołączył do grupy podróżnej. |
| **Scenariusz główny:** | **1.** Użytkownik wybiera „Dołącz do podróży”. <br> **2.** Wpisuje kod zaproszenia. <br> **3.** System weryfikuje kod. <br> **4.** Jeśli poprawny, użytkownik zostaje dodany do grupy. |
| **Wyjątki:** | **1.** Kod niepoprawny. <br> a. System wyświetla komunikat o błędzie. |
| **Dodatkowe wymagania:** | Kod zaproszenia powinien być unikalny. |

| ID:    | 6 ViewTrip               |
| ------ | ------------------------ |
| Nazwa: | **Panel podróży**     |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P0 |
| **Opis:** | Podgląd podróży. |
| **Wyzwalacze:** | Użytkownik został zalogowany do systemu i znajduje się w panelu podróży. |
| **Warunki początkowe:** | Użytkownik jest zalogowany. |
| **Warunki końcowe:** | Użytkownik widzi aktualną listę grup podróżowych, których jest uczestnikiem. |
| **Scenariusz główny:** | **1.** Użytkownik loguje się do systemu. <br> **2.** Użytkownik widzi listę grup podróżnych. |
| **Scenariusz alternatywny** | **1.** Użytkownik nie należy do żadnej grupy. <br> a. System wyświetla informację "Nie należysz do żadnej grupy podróżnej". |
| **Scenariusz alternatywny** | **1.** Użytkownik znajduje się w module podróży. <br> a. Użytkownik klika "Powróć". <br> b. Użytkownik znajduje się w panelu podglądu podróży. |
| **Scenariusz alternatywny** | **1.** Użytkownik, który stworzył podróż klika ikonę edycji. <br> **2.** Edytuje dane wybranej podróży. <br> **3.** Zapisuje zmiany. <br> **4.** Dane podróży zostały zmienione. |
| **Wyjątki:**           | Brak |
| **Dodatkowe wymagania:** | **1.** Użytkownik może kliknąć na daną grupę podróżną, aby zyskać dostęp do modułów dotyczących danej podróży. <br> **2.** Użytkownik, który stworzył podróż ma uprawnienia do jej edycji. |

| ID:    | 7 AdminPanel               |
| ------ | ------------------------ |
| Nazwa: | **Panel admina**     |
| **Aktorzy główni:** | Admin |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P1 |
| **Opis:** | Admin zarządza danymi użytkowników oraz grup podróżnych. |
| **Wyzwalacze:** | **1.** Użytkownik z rolą admina loguje się do systemu i wybiera opcję przejścia do panelu administracyjnego. |
| **Warunki początkowe:** | **1.** Użytkownik posiada uprawnienia administracyjne (rola admin).<br>**2.** Użytkownik jest zalogowany w systemie. |
| **Warunki końcowe:** | Zmiany dokonane przez administratora zostały zapisane i są widoczne dla pozostałych użytkowników. |
| **Scenariusz główny:** | **1.** Administrator wybiera sekcję (lista użytkowników, lista grup).<br>**2.** Dokonuje wymaganych zmian administracyjnych, np. edytuje dane użytkownika lub grupy.<br>**3.** Zapisuje zmiany.<br>**4.** System potwierdza zapis zmian. |
| **Wyjątki:** |  **1.** Brak uprawnień administratora <br> a. System nie umożliwia dostępu do listy użytkowników i wyświetla komunikat o braku uprawnień.<br>**2.** Błąd zapisu zmian <br>a. System wyświetla komunikat o niepowodzeniu operacji (razem z ewentualnym wytłumaczeniem, np. hasło nie spełnia wymogów bezpieczeństwa).|
| **Dodatkowe wymagania:** | **1.** Dostęp wyłącznie dla użytkowników z rolą admina. <br>**2.** Panel powinien umożliwiać szybkie wyszukiwanie i filtrowanie użytkowników oraz grup.|

| ID:    | 8 Settings                 |
| ------ | ------------------------ |
| Nazwa: | **Zarządzanie ustawieniami** |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P1 |
| **Opis:** | Użytkownik edytuje dane dotyczące jego konta. |
| **Wyzwalacze:** | Użytkownik klika "Ustawienia". |
| **Warunki początkowe:** | Użytkownik jest zalogowany. |
| **Warunki końcowe:** | Użytkownik zmienił ustawienia. |
| **Scenariusz główny:** | **1.** Użytkownik otwiera ustawienia konta. <br> **2.** Edytuje dane i zapisuje zmiany. <br> 3. System aktualizuje profil i zapisuje konfigurację. |
| **Wyjątki:**             | **1.** Użytkownik chce zmienić e-mail na już istniejący w systemie. <br> a. System wyświetla informację o duplikacie. <br> **2.** Użytkownik podczas zmiany hasła, niepoprawnie wpisał powtórzenie hasła. <br> a. System wyświetla informację o niepasujących hasłach. <br> **3.** Użytkownik chce zmienić hasło na niespełniające wymagań bezpieczeństwa. <br> a. System wyświetla informację  o zbyt słabym haśle. <br> 
| **Dodatkowe wymagania:** | Zmiana adresu e-mail lub hasła wymaga potwierdzenia aktualnych danych. |

| ID:    | 9 VotingModule             |
| ------ | ------------------------ |
| Nazwa: | **Głosowanie**              |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P1 |
| **Opis:** | Moduł umożliwia użytkownikom grupy przeprowadzanie głosowań. |
| **Wyzwalacze:** | Użytkownik przechodzi do modułu "Głosowanie". |
| **Warunki początkowe:** | Użytkownik jest zalogowany i jest członkiem co najmniej jednej grupy. |
| **Warunki końcowe:** | Użytkownik korzysta z modułu głosowania. |
| **Scenariusz główny:** | **1.** Użytkownik tworzy głosowanie, dodając propozycje. <br> **2.** Członkowie grupy oddają głosy. <br> **3.** System aktualizuje wyniki. |
| **Wyjątki:**                  | Brak |
| **Dodatkowe wymagania:** | **1.** Możliwość dodawania nowych opcji głosowania w trakcie trwania ankiety. <br> **2.** W danym głosowaniu, można oddać głos tylko raz. <br> **3.** W danym głosowaniu można zmienić swój głos.|


| ID:    | 10 PlanningModule           |
| ------ | ------------------------ |
| Nazwa: | **Planowanie wyjazdu**       |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P1 |
| **Opis:** | Moduł umożliwia planowanie harmonogramu podróży – dodawanie dni, aktywności, godzin i lokalizacji. |
| **Wyzwalacze:** | Użytkownik przechodzi do modułu "Planowanie" |
| **Warunki początkowe:** | Użytkownik jest zalogowany i jest członkiem co najmniej jednej grupy. |
| **Warunki końcowe:** | Użytkownik korzysta z modułu planowania. |
| **Scenariusz główny:** | **1.** Użytkownik otwiera moduł planowania. <br> **2.** Dodaje kolejne dni i aktywności. <br> **3.** System zapisuje plan i udostępnia go wszystkim uczestnikom grupy. |
| **Wyjątki:**                  | Brak |
| **Dodatkowe wymagania:** | System powinien umożliwiać edycję planu wszystkim użytkownikom. |


| ID:    | 11 CostSharingModule        |
| ------ | ------------------------ |
| Nazwa: | **Podział kosztów**          |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P1 |
| **Opis:** | Moduł umożliwia użytkownikom wprowadzanie wydatków oraz automatyczne podsumowuje koszty i rozliczenia. |
| **Wyzwalacze:** | Użytkownik przechodzi do modułu "Podział kosztów" |
| **Warunki początkowe:** | Użytkownik jest zalogowany i jest członkiem co najmniej jednej grupy. |
| **Warunki końcowe:** | Użytkownik korzysta z modułu podziału kosztów. |
| **Scenariusz główny:** | **1.** Użytkownik dodaje nowy wydatek (kwota, opis, kto zapłacił). <br> **2.** System aktualizuje bilans dla każdego uczestnika. <br> **3.** Użytkownicy widzą podsumowanie kosztów i rozliczeń. |
| **Wyjątki:**                  | Brak |
| **Dodatkowe wymagania:** | Każdy użytkownik powinien widzieć swoje osobne rozliczenia. (co i ile jest komu winien.) |


| ID:    | 12 ChecklistModule          |
| ------ | ------------------------ |
| Nazwa: | **Lista kontrolna**          |
| **Aktorzy główni:** | Użytkownik |
| **Poziom:** | Użytkownika |
| **Priorytet:** | P1 |
| **Opis:** | Moduł pozwala uczestnikom tworzyć wspólną listę rzeczy do zabrania lub zadań do wykonania przed podróżą. |
| **Wyzwalacze:** | Użytkownik przechodzi do modułu "Lista kontrolna" |
| **Warunki początkowe:** | Użytkownik jest zalogowany i jest członkiem co najmniej jednej grupy. |
| **Warunki końcowe:** | Użytkownik korzysta z modułu listy kontrolnej. |
| **Scenariusz główny:** | **1.** Użytkownik otwiera listę kontrolną. <br> **2.** Dodaje nowe pozycje (np. „ładowarka”, „namiot”). <br> **3.** Członkowie grupy mogą odznaczać wykonane pozycje. |
| **Wyjątki:**                  | Brak |
| **Dodatkowe wymagania:** | **1.** Każdy użytkownik może dodawać nowe pozycje do listy. <br> **2.** Odznaczenie wykonanych pozycji jest widoczne tylko dla danego użytkownika, nie dla wszystkich. |

## 7. Przypisanie aktorów, nadanie im działań, powiązania

W systemie ShareWay wyróżniono trzech głównych aktorów:
Gość, Użytkownik oraz Administrator.
Każdy z nich posiada określony zakres uprawnień i funkcjonalności.

**7.1. Aktorzy systemu**

**Gość**
* Osoba niezalogowana, korzystająca z systemu w ograniczonym zakresie.
* Może: przeglądać stronę główną, zarejestrować się i zalogować.
Powiązane przypadki użycia (PU) i wymagania funkcjonalne (WF):
* PU1 – Homepage (WF1–WF3)

PU2 – Register (WF4–WF8)

PU3 – Login (WF9–WF11)

Użytkownik
* Osoba zalogowana w systemie, uczestnicząca w podróżach.
* Może: dołączać do podróży, przeglądać swoje grupy, korzystać z modułów planowania, głosowania, podziału kosztów i listy kontrolnej.
* Powiązane przypadki użycia: PU5 (Dołączanie do podróży), PU5 (Planowanie), PU6 (Podział kosztów), PU7 (Głosowanie), PU3 (Tworzenie podróży – jeśli jest organizatorem), PU6–PU7.
* Powiązane wymagania funkcjonalne: WF5–WF13, WF16–WF17, WF5, WF6, WF11–WF13.

Administrator (Admin)
* Osoba zarządzająca całym systemem, posiada pełne prawa administracyjne.
* Może: przeglądać, edytować i usuwać konta użytkowników oraz podróże, monitorować system i wykonywać operacje administracyjne.
* Powiązane przypadki użycia: PU8 (Zarządzanie użytkownikami i podróżami), PU2 (Logowanie).
* Powiązane wymagania funkcjonalne: WF14, WF15, WF18.

## 8. Omówienie położeń diagramu

Diagram przypadków użycia ilustruje relacje między aktorami a funkcjami systemu.
Każdy owal reprezentuje przypadek użycia, a linie łączące wskazują, który aktor korzysta z danej funkcji.

Podział na obszary funkcjonalne:

| Obszar |	Opis	| Powiązane przypadki użycia |
| ------ | -------- | -------------------------- |
| Autoryzacja i rejestracja |	Moduł wejściowy systemu pozwalający użytkownikom na logowanie i rejestrację. |	Homepage, Register, Login |
| Zarządzanie podróżami	| Funkcje związane z tworzeniem i dołączaniem do grup podróżnych. |	CreateTrip, JoinTrip, ViewTrip |
| Moduły grupowe	| Rozszerzenia umożliwiające wspólne planowanie i współpracę uczestników. |	VotingModule, PlanningModule, CostSharingModule, ChecklistModule |
| Administracja i ustawienia | Funkcje związane z zarządzaniem kontem i systemem. |	Settings, AdminPanel |