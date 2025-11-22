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
      sub: "ShareWay łączy planowanie, inspiracje i rozliczenia — w jednej zachwycającej aplikacji",
      items: [
        {
          title: "Wspólne tworzenie planu",
          description:
            "Zapraszaj znajomych, głosujcie na propozycje i twórzcie harmonogram razem w czasie rzeczywistym.",
        },
        {
          title: "Podział kosztów bez bólu",
          description:
            "Automatyczne rozliczenia, wielowalutowość i eksport do CSV. Po równo lub według uczestników.",
        },
        {
          title: "Śledzenie wydatków i miejsc",
          description:
            "Oznaczaj miejsca na mapie, zapisuj ulubione lokalizacje i buduj własną bazę miejsc do odwiedzenia.",
        },
        {
          title: "Tablice zadań i rezerwacje",
          description:
            "Plan dzień po dniu, przypomnienia o rezerwacjach i automatyczne powiadomienia dla całej grupy.",
        },
        {
          title: "Tryb offline",
          description:
            "Dostęp do planów i wydatków nawet bez internetu. Synchronizacja automatyczna po powrocie online.",
        },
        {
          title: "Bezpieczne dane",
          description:
            "Twoje plany podróży i dane finansowe chronione najwyższymi standardami bezpieczeństwa.",
        },
      ],
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
      expensesTitle: "Expenses",
      paidBy: "Paid by",
      total: "Total",
      perPerson: "Per person",
      itineraryTitle: "Itinerary",
      startLabel: "Start",
    },

    features: {
      heading: "Everything your trip needs",
      sub: "ShareWay blends planning, inspiration and settlements — in a single delightful app",
      items: [
        {
          title: "Co-create your plan",
          description:
            "Invite friends, vote on ideas and build the schedule together in real time.",
        },
        {
          title: "Painless cost splitting",
          description:
            "Automatic settlements, multi-currency support and CSV export. Split evenly or per participant.",
        },
        {
          title: "Expense & places tracking",
          description:
            "Pin places on the map, save favorites and build your own list of spots to visit.",
        },
        {
          title: "Boards & reservations",
          description:
            "Day-by-day plan, reservation reminders and automatic notifications for the whole group.",
        },
        {
          title: "Offline mode",
          description:
            "Access plans and expenses without internet. Sync automatically when back online.",
        },
        {
          title: "Secure data",
          description:
            "Your trip plans and financial data protected with top-notch security.",
        },
      ],
    },
  },
};

export const getTranslations = (lang: Lang): Translations => dict[lang];
