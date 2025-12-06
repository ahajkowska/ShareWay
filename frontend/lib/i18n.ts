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
        "Group trip planning and cost sharing made simple. It's easier to get where you want when you travel together.",
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
