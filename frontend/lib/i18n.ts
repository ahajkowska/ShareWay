export type Lang = "pl" | "en";

export interface Translations {
  brand: string;
  nav: {
    login: string;
    signup: string;
    dashboard: string;
    logout: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    ctaStart: string;
    ctaHow: string;
  };
  cta: {
    badge: string;
    title: string;
    text1: string;
    text2: string;
    primary: string;
    secondary: string;
    foot: string;
  };
  how: {
    heading: string;
    sub: string;
    steps: { title: string; description: string }[];
  };
  showcase: {
    heading: string;
    sub: string;
    expensesTitle: string;
    paidBy: string;
    total: string;
    perPerson: string;
    itineraryTitle: string;
    startLabel: string;
  };
  features: {
    heading: string;
    sub: string;
    items: { title: string; description: string }[];
  };
  footer: {
    description: string;
    productTitle: string;
    productItems: string[];
    companyTitle: string;
    companyItems: string[];
    legalTitle: string;
    legalItems: string[];
    social: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
    rights: string;
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      submit: string;
      noAccount: string;
      createOne: string;
      errors: {
        network: string;
        invalidCredentials: string;
      };
    };
    register: {
      title: string;
      subtitle: string;
      submit: string;
      haveAccount: string;
      signIn: string;
    };
    common: {
      emailLabel: string;
      passwordLabel: string;
      confirmPasswordLabel: string;
      nameLabel: string;
      rememberMe: string;
      forgotPassword: string;
      showPassword: string;
      hidePassword: string;
      termsPrefix: string;
      terms: string;
      privacy: string;
      and: string;
    };
    toast: {
      loginSuccess: string;
      registerSuccess: string;
    };
    validation: {
      name: { required: string; min: (n: number) => string };
      email: { required: string; invalid: string };
      password: {
        required: string;
        min: (n: number) => string;
        lowercase: string;
        uppercase: string;
        number: string;
        special: string;
      };
      confirm: { required: string; mismatch: string };
      terms: { required: string };
    };
  };
  
  // === DODAJ NOWE SEKCJE DLA MODUŁÓW ===
  
  costs: {
    myBalance: string;
    balance: string;
    allSettled: string;
    noOutstandingPayments: string;
    settlementsWithPeople: string;
    theyOweMe: string;
    iOweThem: string;
    pln: string;
    expense: string;
    expenses: string;
    myShare: string;
    iPaid: string;
    totalAmount: string;
    owesMe: string;
    iOwe: string;
    markAsSettled: string;
    markAsPaid: string;
    markAsReceived: string;
    settlementTitle: string;
    amountToSettle: string;
    canSettlePartial: string;
    half: string;
    full: string;
    cancel: string;
    saving: string;
    settleInfo: string;
    makeSureYouPaid: string;
    makeSureYouReceived: string;
    youAreGivingMoneyTo: string;
    youAreReceivingMoneyFrom: string;
    youOweForThisExpense: string;
    theyOweForThisExpense: string;
    balanceGraph: string;
    optimizedSettlements: string;
    totalExpenses: string;
    noSettlementsNeeded: string;
    pays: string;
    addExpense: string;
    createExpense: string;
    expenseTitle: string;
    amount: string;
    whoPaid: string;
    selectPerson: string;
    date: string;
    splitBetween: string;
    allParticipants: string;
    specificPeople: string;
    creating: string;
    create: string;
    noExpenses: string;
    addFirstExpense: string;
    paidBy: string;
    splitAmong: string;
    people: string;
  };

  checklist: {
    checklist: string;
    addItem: string;
    createItem: string;
    itemTitle: string;
    description: string;
    optional: string;
    assignTo: string;
    selectPerson: string;
    dueDate: string;
    priority: string;
    low: string;
    medium: string;
    high: string;
    category: string;
    general: string;
    packing: string;
    booking: string;
    documents: string;
    other: string;
    cancel: string;
    create: string;
    creating: string;
    noItems: string;
    addFirstItem: string;
    completed: string;
    pending: string;
    assignedTo: string;
    unassigned: string;
    due: string;
    overdue: string;
    markAsComplete: string;
    markAsIncomplete: string;
    delete: string;
    edit: string;
    filterBy: string;
    all: string;
    myTasks: string;
    sortBy: string;
    status: string;
    tasks: string;
  };

  schedule: {
    schedule: string;
    addEvent: string;
    createEvent: string;
    eventTitle: string;
    description: string;
    optional: string;
    startDate: string;
    endDate: string;
    location: string;
    category: string;
    transport: string;
    accommodation: string;
    activity: string;
    meal: string;
    other: string;
    cancel: string;
    create: string;
    creating: string;
    noEvents: string;
    addFirstEvent: string;
    today: string;
    tomorrow: string;
    upcomingEvents: string;
    pastEvents: string;
    allEvents: string;
    day: string;
    week: string;
    month: string;
    list: string;
    from: string;
    to: string;
    at: string;
    duration: string;
    hours: string;
    days: string;
    edit: string;
    delete: string;
    viewDetails: string;
    hideDetails: string;
    events: string;
  };

  voting: {
    voting: string;
    createPoll: string;
    pollTitle: string;
    description: string;
    optional: string;
    pollType: string;
    singleChoice: string;
    multipleChoice: string;
    options: string;
    addOption: string;
    option: string;
    deadline: string;
    allowNewOptions: string;
    allowAddingOptions: string; // ← DODAJ (ten sam tekst co allowNewOptions)
    anonymousVoting: string;
    cancel: string;
    create: string;
    creating: string;
    noPolls: string;
    addFirstPoll: string;
    active: string;
    closed: string;
    votes: string;
    vote: string;
    voted: string;
    notVoted: string;
    closePoll: string;
    reopenPoll: string;
    edit: string;
    delete: string;
    viewResults: string;
    hideResults: string;
    viewDetails: string;
    yourVote: string;
    changeVote: string;
    submitVote: string;
    votedBy: string;
    noVotes: string;
    closesIn: string;
    closedOn: string;
    multipleChoiceInfo: string;
    singleChoiceInfo: string;
    backToGroup: string;
    subtitle: string;
    createError: string;
    voteError: string;
    addOptionError: string;
    deleteConfirm: string;
    deleteError: string;
    titleRequired: string;
    minOptionsRequired: string;
    pollTitlePlaceholder: string;
    descriptionPlaceholder: string;
    minOptions: string;
    settings: string;
    allowNewOptionsDesc: string;
    allowMultipleVotes: string;
    showResultsBeforeVoting: string;
    showResultsBeforeVotingDesc: string;
    participant: string;
    participants: string;
    leading: string;
    endsOn: string;
    locale: string;
    peopleVoted: string;
    totalVotesCast: string;
    status: string;
    until: string;
    winner: string;
    allOptions: string;
    optionName: string;
    optionPlaceholder: string;
    additionalInfo: string;
    adding: string;
    add: string;
    voteButton: string;
    whoVoted: string;
    pollInfo: string;
    createdBy: string;
    creationDate: string;
    yes: string;
    no: string;
    loadingPolls: string;
    activePolls: string;
    closedPolls: string;
  };

  dashboard: {
    title: string;
    subtitle: string;
    modules: {
      voting: { name: string; description: string };
      costs: { name: string; description: string };
      schedule: { name: string; description: string };
      checklist: { name: string; description: string };
    };
  };
}

export const dict: Record<Lang, Translations> = {
  pl: {
    brand: "ShareWay",
    nav: {
      login: "Zaloguj się",
      signup: "Załóż konto",
      dashboard: "Panel",
      logout: "Wyloguj",
    },

    hero: {
      kicker: "Planowanie podróży nigdy nie było łatwiejsze",
      title: "ShareWay — wspólne planowanie i rozliczanie podróży grupowych",
      subtitle:
        "Od wspólnego planowania, aż po przejrzysty podział kosztów. Bez chaosu i arkuszy.",
      ctaStart: "Zacznij za darmo",
      ctaHow: "Zobacz, jak to działa",
    },

    cta: {
      badge: "Darmowa rejestracja — bez karty kredytowej",
      title: "Gotowy na swoją najlepszą przygodę?",
      text1:
        "Dołącz do tysięcy podróżników, którzy już planują swoje wyprawy z",
      text2:
        "Zacznij za darmo i odkryj, jak proste może być wspólne podróżowanie.",
      primary: "Rozpocznij planowanie",
      secondary: "Mam już konto",
      foot: "Bez zobowiązań • Anuluj kiedy chcesz • Wsparcie 24/7",
    },

    how: {
      heading: "Jak to działa?",
      sub: "Trzy proste kroki do idealnie zorganizowanej podróży",
      steps: [
        {
          title: "Załóż grupę",
          description:
            "Utwórz wyprawę i zaproś znajomych. Każdy może dołączyć w kilka sekund.",
        },
        {
          title: "Planujecie razem",
          description:
            "Wspólnie wybierajcie miejsca, ustalajcie trasę i harmonogram. Głosujcie na propozycje.",
        },
        {
          title: "Rozliczacie się łatwo",
          description:
            "Dodawaj wydatki, dziel koszty automatycznie i rozliczaj się bez stresu po wyjeździe.",
        },
      ],
    },

    showcase: {
      heading: "Zobacz ShareWay w akcji",
      sub: "Przejrzyste koszty i plan podróży zawsze pod ręką",
      expensesTitle: "Rozliczenie wydatków",
      paidBy: "Zapłacił",
      total: "Łącznie",
      perPerson: "Na osobę",
      itineraryTitle: "Plan podróży",
      startLabel: "Rozpoczęcie",
    },

    features: {
      heading: "Wszystko, czego potrzebuje Twoja wyprawa",
      sub: "ShareWay łączy planowanie, współpracę i rozliczenia — w jednej przejrzystej aplikacji",
      items: [
        {
          title: "Wspólne tworzenie planu",
          description:
            "Zapraszaj znajomych, zbieraj propozycje i układaj harmonogram podróży w jednym miejscu, czytelnie dla całej grupy.",
        },
        {
          title: "Przejrzysty podział kosztów",
          description:
            "Dodawaj wydatki w trakcie wyjazdu, a ShareWay pomoże policzyć, kto komu i ile powinien zwrócić — bez arkuszy i ręcznych podsumowań.",
        },
        {
          title: "Miejsca i harmonogram w jednym widoku",
          description:
            "Zapisuj kluczowe punkty podróży, godziny i lokalizacje, aby każdy uczestnik miał dostęp do aktualnego planu.",
        },
        {
          title: "Lista kontrolna przed wyjazdem",
          description:
            "Twórz wspólne checklisty rzeczy do zabrania i zadań do wykonania przed podróżą, żeby nikt nie zapomniał o najważniejszych rzeczach.",
        },
        {
          title: "Głosowania w grupie",
          description:
            "Głosujcie nad terminami, noclegami czy atrakcjami i podejmujcie decyzje szybko, zamiast przedzierać się przez długie konwersacje.",
        },
        {
          title: "Bezpieczne dane",
          description:
            "Plany podróży i dane dotyczące kosztów są przechowywane z zachowaniem zasad bezpieczeństwa i ochrony prywatności.",
        },
      ],
    },

    footer: {
      description:
        "Wspólne planowanie i rozliczanie podróży grupowych. Razem łatwiej dotrzeć tam, gdzie chcesz.",
      productTitle: "Produkt",
      productItems: ["Funkcje", "Cennik", "FAQ"],
      companyTitle: "Firma",
      companyItems: ["O nas", "Blog", "Kontakt"],
      legalTitle: "Prawne",
      legalItems: ["Polityka prywatności", "Regulamin", "Cookies"],
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
      },
      rights: "Wszystkie prawa zastrzeżone.",
    },
    auth: {
      login: {
        title: "Zaloguj się",
        subtitle: "Ciesz się wspólnym planowaniem podróży z ShareWay",
        submit: "Zaloguj się",
        noAccount: "Nie masz konta?",
        createOne: "Załóż konto",
        errors: {
          network: "Błąd sieci. Spróbuj ponownie.",
          invalidCredentials: "Nieprawidłowy e-mail lub hasło.",
        },
      },
      register: {
        title: "Załóż konto",
        subtitle: "Dołącz do społeczności podróżników",
        submit: "Zarejestruj się",
        haveAccount: "Masz już konto?",
        signIn: "Zaloguj się",
      },
      common: {
        emailLabel: "E-mail",
        passwordLabel: "Hasło",
        confirmPasswordLabel: "Potwierdź hasło",
        nameLabel: "Imię",
        rememberMe: "Zapamiętaj mnie",
        forgotPassword: "Zapomniałeś hasła?",
        showPassword: "Pokaż hasło",
        hidePassword: "Ukryj hasło",
        termsPrefix: "Akceptuję",
        terms: "regulamin",
        privacy: "politykę prywatności",
        and: "oraz",
      },
      toast: {
        loginSuccess: "Zalogowano pomyślnie!",
        registerSuccess: "Konto utworzone pomyślnie!",
      },
      validation: {
        name: {
          required: "Imię jest wymagane",
          min: (n: number) => `Imię musi mieć co najmniej ${n} znaki`,
        },
        email: {
          required: "E-mail jest wymagany",
          invalid: "Nieprawidłowy format adresu e-mail",
        },
        password: {
          required: "Hasło jest wymagane",
          min: (n: number) => `Hasło musi mieć co najmniej ${n} znaków`,
          lowercase: "Hasło musi zawierać małą literę",
          uppercase: "Hasło musi zawierać dużą literę",
          number: "Hasło musi zawierać cyfrę",
          special: "Hasło musi zawierać znak specjalny",
        },
        confirm: {
          required: "Potwierdź hasło",
          mismatch: "Hasła nie są identyczne",
        },
        terms: {
          required: "Musisz zaakceptować regulamin",
        },
      },
    },
    costs: {
      myBalance: "Moje saldo",
      balance: "Bilans",
      allSettled: "Wszystko rozliczone!",
      noOutstandingPayments: "Nie masz żadnych zaległych płatności",
      settlementsWithPeople: "Rozliczenia z osobami",
      theyOweMe: "Mi są winni",
      iOweThem: "Jestem winien/winna",
      pln: "PLN",
      expense: "wydatek",
      expenses: "wydatki",
      myShare: "Mój udział:",
      iPaid: "Ja zapłaciłem:",
      totalAmount: "Łączna kwota:",
      owesMe: "mi jest winien/winna",
      iOwe: "Jestem winien/winna",
      markAsSettled: "Oznacz jako rozliczone",
      markAsPaid: "Oznacz jako oddane",
      markAsReceived: "Oznacz jako otrzymane",
      settlementTitle: "Oznacz jako rozliczone",
      amountToSettle: "Kwota do rozliczenia (PLN)",
      canSettlePartial: "Możesz rozliczyć całość lub część kwoty za ten wydatek",
      half: "Połowa",
      full: "Całość",
      cancel: "Anuluj",
      saving: "Zapisywanie...",
      settleInfo: "Zostanie utworzony wydatek rozliczeniowy, który automatycznie wyrówna saldo.",
      makeSureYouPaid: "Upewnij się, że faktycznie przekazałeś pieniądze.",
      makeSureYouReceived: "Upewnij się, że faktycznie otrzymałeś pieniądze.",
      youAreGivingMoneyTo: "Oddajesz pieniądze dla:",
      youAreReceivingMoneyFrom: "Otrzymujesz pieniądze od:",
      youOweForThisExpense: "Jesteś winien/winna za ten wydatek:",
      theyOweForThisExpense: "Jest Ci winien/winna za ten wydatek:",
      balanceGraph: "Graf rozliczeń",
      optimizedSettlements: "Zoptymalizowane rozliczenia",
      totalExpenses: "Łącznie wydatków",
      noSettlementsNeeded: "Brak rozliczeń do wykonania",
      pays: "płaci",
      addExpense: "Dodaj wydatek",
      createExpense: "Utwórz wydatek",
      expenseTitle: "Tytuł wydatku",
      amount: "Kwota (PLN)",
      whoPaid: "Kto zapłacił?",
      selectPerson: "Wybierz osobę...",
      date: "Data",
      splitBetween: "Podziel między",
      allParticipants: "Wszyscy uczestnicy",
      specificPeople: "Wybrane osoby",
      creating: "Tworzenie...",
      create: "Utwórz",
      noExpenses: "Brak wydatków",
      addFirstExpense: "Dodaj pierwszy wydatek klikając przycisk powyżej",
      paidBy: "Zapłacił:",
      splitAmong: "Podzielono między",
      people: "osoby",
    },

    checklist: {
      checklist: "Lista kontrolna",
      addItem: "Dodaj zadanie",
      createItem: "Utwórz zadanie",
      itemTitle: "Nazwa zadania",
      description: "Opis",
      optional: "opcjonalnie",
      assignTo: "Przypisz do",
      selectPerson: "Wybierz osobę...",
      dueDate: "Termin wykonania",
      priority: "Priorytet",
      low: "Niski",
      medium: "Średni",
      high: "Wysoki",
      category: "Kategoria",
      general: "Ogólne",
      packing: "Pakowanie",
      booking: "Rezerwacje",
      documents: "Dokumenty",
      other: "Inne",
      cancel: "Anuluj",
      create: "Utwórz",
      creating: "Tworzenie...",
      noItems: "Brak zadań",
      addFirstItem: "Dodaj pierwsze zadanie klikając przycisk powyżej",
      completed: "Ukończone",
      pending: "Oczekujące",
      assignedTo: "Przypisane do:",
      unassigned: "Nieprzypisane",
      due: "Termin:",
      overdue: "Przeterminowane",
      markAsComplete: "Oznacz jako ukończone",
      markAsIncomplete: "Oznacz jako nieukończone",
      delete: "Usuń",
      edit: "Edytuj",
      filterBy: "Filtruj według",
      all: "Wszystkie",
      myTasks: "Moje zadania",
      sortBy: "Sortuj według",
      status: "Status",
      tasks: "zadań",
    },

    schedule: {
      schedule: "Harmonogram",
      addEvent: "Dodaj wydarzenie",
      createEvent: "Utwórz wydarzenie",
      eventTitle: "Nazwa wydarzenia",
      description: "Opis",
      optional: "opcjonalnie",
      startDate: "Data rozpoczęcia",
      endDate: "Data zakończenia",
      location: "Lokalizacja",
      category: "Kategoria",
      transport: "Transport",
      accommodation: "Nocleg",
      activity: "Aktywność",
      meal: "Posiłek",
      other: "Inne",
      cancel: "Anuluj",
      create: "Utwórz",
      creating: "Tworzenie...",
      noEvents: "Brak wydarzeń",
      addFirstEvent: "Dodaj pierwsze wydarzenie klikając przycisk powyżej",
      today: "Dzisiaj",
      tomorrow: "Jutro",
      upcomingEvents: "Nadchodzące wydarzenia",
      pastEvents: "Minione wydarzenia",
      allEvents: "Wszystkie wydarzenia",
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      list: "Lista",
      from: "od",
      to: "do",
      at: "o",
      duration: "Czas trwania",
      hours: "godzin",
      days: "dni",
      edit: "Edytuj",
      delete: "Usuń",
      viewDetails: "Zobacz szczegóły",
      hideDetails: "Ukryj szczegóły",
      events: "wydarzeń",
    },

    voting: {
      voting: "Głosowania",
      createPoll: "Utwórz głosowanie",
      pollTitle: "Tytuł głosowania",
      description: "Opis",
      optional: "opcjonalnie",
      pollType: "Typ głosowania",
      singleChoice: "Pojedynczy wybór",
      multipleChoice: "Wielokrotny wybór",
      options: "Opcje",
      addOption: "Dodaj opcję",
      option: "Opcja",
      deadline: "Termin zakończenia",
      allowNewOptions: "Pozwól użytkownikom dodawać nowe opcje",
      allowAddingOptions: "Pozwól dodawać opcje", // ← DODAJ
      anonymousVoting: "Anonimowe głosowanie",
      cancel: "Anuluj",
      create: "Utwórz",
      creating: "Tworzenie...",
      noPolls: "Brak głosowań",
      addFirstPoll: "Utwórz pierwsze głosowanie klikając przycisk powyżej",
      active: "Aktywne",
      closed: "Zakończone",
      votes: "głosów",
      vote: "głos",
      voted: "Zagłosowano",
      notVoted: "Nie zagłosowano",
      closePoll: "Zamknij głosowanie",
      reopenPoll: "Otwórz ponownie",
      edit: "Edytuj",
      delete: "Usuń",
      viewResults: "Zobacz wyniki",
      hideResults: "Ukryj wyniki",
      viewDetails: "Zobacz szczegóły",
      yourVote: "Twój głos",
      changeVote: "Zmień głos",
      submitVote: "Oddaj głos",
      votedBy: "Zagłosowali:",
      noVotes: "Brak głosów",
      closesIn: "Zamknięcie za",
      closedOn: "Zamknięto",
      multipleChoiceInfo: "Możesz wybrać wiele opcji",
      singleChoiceInfo: "Możesz wybrać tylko jedną opcję",
      backToGroup: "Powrót do grupy",
      subtitle: "Podejmujcie decyzje wspólnie w grupie",
      createError: "Nie udało się utworzyć głosowania. Spróbuj ponownie.",
      voteError: "Nie udało się oddać głosu. Spróbuj ponownie.",
      addOptionError: "Nie udało się dodać opcji. Spróbuj ponownie.",
      deleteConfirm: "Czy na pewno chcesz usunąć to głosowanie?",
      deleteError: "Nie udało się usunąć głosowania. Spróbuj ponownie.",
      titleRequired: "Tytuł jest wymagany",
      minOptionsRequired: "Dodaj przynajmniej 2 opcje",
      pollTitlePlaceholder: "np. Która wyspa odwiedzamy najpierw?",
      descriptionPlaceholder: "Dodaj dodatkowe informacje...",
      minOptions: "min. 2",
      settings: "Ustawienia",
      allowNewOptionsDesc: "Uczestnicy będą mogli proponować własne opcje",
      allowMultipleVotes: "Pozwól na wiele głosów",
      showResultsBeforeVoting: "Pokazuj wyniki przed głosowaniem",
      showResultsBeforeVotingDesc: "Uczestnicy zobaczą aktualne wyniki przed oddaniem głosu",
      participant: "uczestnik",
      participants: "uczestników",
      leading: "Prowadzi",
      endsOn: "Kończy się",
      locale: "pl-PL",
      peopleVoted: "osób zagłosowało",
      totalVotesCast: "łącznie oddanych głosów",
      status: "Status",
      until: "do",
      winner: "Zwycięzca",
      allOptions: "Wszystkie opcje",
      optionName: "Nazwa opcji",
      optionPlaceholder: "np. Mykonos",
      additionalInfo: "Dodatkowe informacje...",
      adding: "Dodawanie...",
      add: "Dodaj",
      voteButton: "Głosuj",
      whoVoted: "Kto głosował?",
      pollInfo: "Informacje o głosowaniu",
      createdBy: "Utworzone przez",
      creationDate: "Data utworzenia",
      yes: "Tak",
      no: "Nie",
      loadingPolls: "Ładowanie głosowań...",
      activePolls: "Aktywne głosowania",
      closedPolls: "Zakończone głosowania",
    },
    dashboard: {
      title: "Podróż",
      subtitle: "Wybierz moduł, aby zarządzać swoją podróżą",
      modules: {
        voting: { name: "Głosowanie", description: "Podejmujcie decyzje wspólnie" },
        costs: { name: "Koszty", description: "Rozliczajcie wspólne wydatki" },
        schedule: { name: "Harmonogram", description: "Planujcie trasę i atrakcje" },
        checklist: { name: "Lista kontrolna", description: "Co zabrać i co zrobić" },
      },
    },
  },

  en: {
    brand: "ShareWay",
    nav: {
      login: "Log in",
      signup: "Sign up",
      dashboard: "Dashboard",
      logout: "Log out",
    },

    hero: {
      kicker: "Trip planning has never been easier",
      title: "ShareWay — plan and split group trips together",
      subtitle:
        "From collaborative planning to transparent cost sharing. No chaos, no spreadsheets.",
      ctaStart: "Start for free",
      ctaHow: "See how it works",
    },

    cta: {
      badge: "Free sign-up — no credit card",
      title: "Ready for your best adventure?",
      text1: "Join thousands already planning trips with",
      text2: "Start for free and see how simple group travel can be.",
      primary: "Start planning",
      secondary: "I already have an account",
      foot: "No commitments • Cancel anytime • 24/7 support",
    },

    how: {
      heading: "How it works?",
      sub: "Three simple steps to a perfectly organized trip",
      steps: [
        {
          title: "Create a group",
          description:
            "Create a trip and invite friends. Anyone can join in seconds.",
        },
        {
          title: "Plan together",
          description:
            "Pick places, set the route and schedule together. Vote on ideas.",
        },
        {
          title: "Settle up easily",
          description:
            "Add expenses, split costs automatically and settle stress-free after the trip.",
        },
      ],
    },

    showcase: {
      heading: "See ShareWay in action",
      sub: "Clear costs and itinerary always at hand",
      expensesTitle: "Trip expenses",
      paidBy: "Paid by",
      total: "Total",
      perPerson: "Per person",
      itineraryTitle: "Itinerary",
      startLabel: "Start",
    },

    features: {
      heading: "Everything your trip needs",
      sub: "ShareWay brings planning, collaboration and cost sharing together — in a single clear app",
      items: [
        {
          title: "Plan together in one place",
          description:
            "Invite friends, collect ideas and keep your trip schedule in one shared space that everyone can access.",
        },
        {
          title: "Clear cost sharing",
          description:
            "Add expenses during the trip and let ShareWay help you see who owes what to whom — no spreadsheets needed.",
        },
        {
          title: "Itinerary and places in one view",
          description:
            "Save key stops, times and locations so the whole group follows the same, always up-to-date plan.",
        },
        {
          title: "Trip checklist",
          description:
            "Create a shared checklist of things to pack and tasks to do before you leave, so nobody forgets the essentials.",
        },
        {
          title: "Group voting",
          description:
            "Run quick polls to choose dates, stays or activities instead of endless back-and-forth in chat apps.",
        },
        {
          title: "Secure data",
          description:
            "Your trip plans and cost data are stored with attention to security and privacy best practices.",
        },
      ],
    },

    footer: {
      description:
        "Group trip planning and cost sharing made simple. It’s easier to get where you want when you travel together.",
      productTitle: "Product",
      productItems: ["Features", "Pricing", "FAQ"],
      companyTitle: "Company",
      companyItems: ["About", "Blog", "Contact"],
      legalTitle: "Legal",
      legalItems: ["Privacy policy", "Terms of use", "Cookies"],
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
      },
      rights: "All rights reserved.",
    },
    auth: {
      login: {
        title: "Log in",
        subtitle: "Enjoy trip planning together with ShareWay",
        submit: "Log in",
        noAccount: "Don't have an account?",
        createOne: "Create one",
        errors: {
          network: "Network error. Please try again.",
          invalidCredentials: "Invalid email or password.",
        },
      },
      register: {
        title: "Sign up",
        subtitle: "Join our community of travelers",
        submit: "Sign up",
        haveAccount: "Already have an account?",
        signIn: "Log in",
      },
      common: {
        emailLabel: "Email",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm password",
        nameLabel: "Name",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        showPassword: "Show password",
        hidePassword: "Hide password",
        termsPrefix: "I accept the",
        terms: "terms",
        privacy: "privacy policy",
        and: "and",
      },
      toast: {
        loginSuccess: "Logged in successfully!",
        registerSuccess: "Account created successfully!",
      },
      validation: {
        name: {
          required: "Name is required",
          min: (n: number) => `Name must be at least ${n} characters long`,
        },
        email: {
          required: "Email is required",
          invalid: "Invalid email format",
        },
        password: {
          required: "Password is required",
          min: (n: number) => `Password must be at least ${n} characters long`,
          lowercase: "Password must contain a lowercase letter",
          uppercase: "Password must contain an uppercase letter",
          number: "Password must contain a number",
          special: "Password must contain a special character",
        },
        confirm: {
          required: "Please confirm your password",
          mismatch: "Passwords do not match",
        },
        terms: {
          required: "You must accept the terms",
        },
      },
    },
    costs: {
      myBalance: "My Balance",
      balance: "Balance",
      allSettled: "All Settled!",
      noOutstandingPayments: "You have no outstanding payments",
      settlementsWithPeople: "Settlements with People",
      theyOweMe: "They Owe Me",
      iOweThem: "I Owe Them",
      pln: "PLN",
      expense: "expense",
      expenses: "expenses",
      myShare: "My share:",
      iPaid: "I paid:",
      totalAmount: "Total amount:",
      owesMe: "owes me",
      iOwe: "I owe",
      markAsSettled: "Mark as settled",
      markAsPaid: "Mark as paid",
      markAsReceived: "Mark as received",
      settlementTitle: "Mark as Settled",
      amountToSettle: "Amount to Settle (PLN)",
      canSettlePartial: "You can settle all or part of the amount for this expense",
      half: "Half",
      full: "Full",
      cancel: "Cancel",
      saving: "Saving...",
      settleInfo: "A settlement expense will be created that automatically balances the amount.",
      makeSureYouPaid: "Make sure you have actually transferred the money.",
      makeSureYouReceived: "Make sure you have actually received the money.",
      youAreGivingMoneyTo: "You are giving money to:",
      youAreReceivingMoneyFrom: "You are receiving money from:",
      youOweForThisExpense: "You owe for this expense:",
      theyOweForThisExpense: "They owe you for this expense:",
      balanceGraph: "Balance Graph",
      optimizedSettlements: "Optimized Settlements",
      totalExpenses: "Total Expenses",
      noSettlementsNeeded: "No settlements needed",
      pays: "pays",
      addExpense: "Add Expense",
      createExpense: "Create Expense",
      expenseTitle: "Expense Title",
      amount: "Amount (PLN)",
      whoPaid: "Who Paid?",
      selectPerson: "Select person...",
      date: "Date",
      splitBetween: "Split Between",
      allParticipants: "All Participants",
      specificPeople: "Specific People",
      creating: "Creating...",
      create: "Create",
      noExpenses: "No Expenses",
      addFirstExpense: "Add your first expense by clicking the button above",
      paidBy: "Paid by:",
      splitAmong: "Split among",
      people: "people",
    },

    checklist: {
      checklist: "Checklist",
      addItem: "Add Item",
      createItem: "Create Item",
      itemTitle: "Item Title",
      description: "Description",
      optional: "optional",
      assignTo: "Assign To",
      selectPerson: "Select person...",
      dueDate: "Due Date",
      priority: "Priority",
      low: "Low",
      medium: "Medium",
      high: "High",
      category: "Category",
      general: "General",
      packing: "Packing",
      booking: "Booking",
      documents: "Documents",
      other: "Other",
      cancel: "Cancel",
      create: "Create",
      creating: "Creating...",
      noItems: "No Items",
      addFirstItem: "Add your first item by clicking the button above",
      completed: "Completed",
      pending: "Pending",
      assignedTo: "Assigned to:",
      unassigned: "Unassigned",
      due: "Due:",
      overdue: "Overdue",
      markAsComplete: "Mark as Complete",
      markAsIncomplete: "Mark as Incomplete",
      delete: "Delete",
      edit: "Edit",
      filterBy: "Filter by",
      all: "All",
      myTasks: "My Tasks",
      sortBy: "Sort by",
      status: "Status",
      tasks: "tasks",
    },

    schedule: {
      schedule: "Schedule",
      addEvent: "Add Event",
      createEvent: "Create Event",
      eventTitle: "Event Title",
      description: "Description",
      optional: "optional",
      startDate: "Start Date",
      endDate: "End Date",
      location: "Location",
      category: "Category",
      transport: "Transport",
      accommodation: "Accommodation",
      activity: "Activity",
      meal: "Meal",
      other: "Other",
      cancel: "Cancel",
      create: "Create",
      creating: "Creating...",
      noEvents: "No Events",
      addFirstEvent: "Add your first event by clicking the button above",
      today: "Today",
      tomorrow: "Tomorrow",
      upcomingEvents: "Upcoming Events",
      pastEvents: "Past Events",
      allEvents: "All Events",
      day: "Day",
      week: "Week",
      month: "Month",
      list: "List",
      from: "from",
      to: "to",
      at: "at",
      duration: "Duration",
      hours: "hours",
      days: "days",
      edit: "Edit",
      delete: "Delete",
      viewDetails: "View Details",
      hideDetails: "Hide Details",
      events: "events",
    },

    voting: {
      voting: "Voting",
      createPoll: "Create Poll",
      pollTitle: "Poll Title",
      description: "Description",
      optional: "optional",
      pollType: "Poll Type",
      singleChoice: "Single Choice",
      multipleChoice: "Multiple Choice",
      options: "Options",
      addOption: "Add Option",
      option: "Option",
      deadline: "Deadline",
      allowNewOptions: "Allow users to add new options",
      allowAddingOptions: "Allow adding options", // ← DODAJ
      anonymousVoting: "Anonymous Voting",
      cancel: "Cancel",
      create: "Create",
      creating: "Creating...",
      noPolls: "No Polls",
      addFirstPoll: "Create your first poll by clicking the button above",
      active: "Active",
      closed: "Closed",
      votes: "votes",
      vote: "vote",
      voted: "Voted",
      notVoted: "Not Voted",
      closePoll: "Close Poll",
      reopenPoll: "Reopen",
      edit: "Edit",
      delete: "Delete",
      viewResults: "View Results",
      hideResults: "Hide Results",
      viewDetails: "View Details",
      yourVote: "Your Vote",
      changeVote: "Change Vote",
      submitVote: "Submit Vote",
      votedBy: "Voted by:",
      noVotes: "No Votes",
      closesIn: "Closes in",
      closedOn: "Closed on",
      multipleChoiceInfo: "You can select multiple options",
      singleChoiceInfo: "You can select only one option",
      backToGroup: "Back to group",
      subtitle: "Make decisions together in the group",
      createError: "Failed to create poll. Please try again.",
      voteError: "Failed to submit vote. Please try again.",
      addOptionError: "Failed to add option. Please try again.",
      deleteConfirm: "Are you sure you want to delete this poll?",
      deleteError: "Failed to delete poll. Please try again.",
      titleRequired: "Title is required",
      minOptionsRequired: "Add at least 2 options",
      pollTitlePlaceholder: "e.g. Which island do we visit first?",
      descriptionPlaceholder: "Add additional information...",
      minOptions: "min. 2",
      settings: "Settings",
      allowNewOptionsDesc: "Participants will be able to propose their own options",
      allowMultipleVotes: "Allow multiple votes",
      showResultsBeforeVoting: "Show results before voting",
      showResultsBeforeVotingDesc: "Participants will see current results before voting",
      participant: "participant",
      participants: "participants",
      leading: "Leading",
      endsOn: "Ends on",
      locale: "en-US",
      peopleVoted: "people voted",
      totalVotesCast: "total votes cast",
      status: "Status",
      until: "until",
      winner: "Winner",
      allOptions: "All Options",
      optionName: "Option Name",
      optionPlaceholder: "e.g. Mykonos",
      additionalInfo: "Additional information...",
      adding: "Adding...",
      add: "Add",
      voteButton: "Vote",
      whoVoted: "Who voted?",
      pollInfo: "Poll Information",
      createdBy: "Created by",
      creationDate: "Creation date",
      yes: "Yes",
      no: "No",
      loadingPolls: "Loading polls...",
      activePolls: "Active Polls",
      closedPolls: "Closed Polls",
    },
    dashboard: {
      title: "Trip",
      subtitle: "Choose a module to manage your trip",
      modules: {
        voting: { name: "Voting", description: "Make decisions together" },
        costs: { name: "Costs", description: "Split shared expenses" },
        schedule: { name: "Schedule", description: "Plan route and attractions" },
        checklist: { name: "Checklist", description: "What to pack and do" },
      },
    },
  },
};

export const getTranslations = (lang: Lang): Translations => dict[lang];
