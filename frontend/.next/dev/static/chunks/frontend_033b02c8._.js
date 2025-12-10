(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/app/components/ThemeProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        enableColorScheme: false,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/ThemeProvider.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dict",
    ()=>dict,
    "getTranslations",
    ()=>getTranslations
]);
const dict = {
    pl: {
        brand: "ShareWay",
        nav: {
            login: "Zaloguj się",
            signup: "Załóż konto",
            logout: "Wyloguj",
            profile: "Profil",
            settings: "Ustawienia"
        },
        hero: {
            kicker: "Planowanie podróży nigdy nie było łatwiejsze",
            title: "ShareWay — wspólne planowanie i rozliczanie podróży grupowych",
            subtitle: "Od wspólnego planowania, aż po przejrzysty podział kosztów. Bez chaosu i arkuszy.",
            ctaStart: "Zacznij za darmo",
            ctaHow: "Zobacz, jak to działa"
        },
        cta: {
            badge: "Darmowa rejestracja — bez karty kredytowej",
            title: "Gotowy na swoją najlepszą przygodę?",
            text1: "Dołącz do tysięcy podróżników, którzy już planują swoje wyprawy z",
            text2: "Zacznij za darmo i odkryj, jak proste może być wspólne podróżowanie.",
            primary: "Rozpocznij planowanie",
            secondary: "Mam już konto",
            foot: "Bez zobowiązań • Anuluj kiedy chcesz • Wsparcie 24/7"
        },
        how: {
            heading: "Jak to działa?",
            sub: "Trzy proste kroki do idealnie zorganizowanej podróży",
            steps: [
                {
                    title: "Załóż grupę",
                    description: "Utwórz wyprawę i zaproś znajomych. Każdy może dołączyć w kilka sekund."
                },
                {
                    title: "Planujecie razem",
                    description: "Wspólnie wybierajcie miejsca, ustalajcie trasę i harmonogram. Głosujcie na propozycje."
                },
                {
                    title: "Rozliczacie się łatwo",
                    description: "Dodawaj wydatki, dziel koszty automatycznie i rozliczaj się bez stresu po wyjeździe."
                }
            ]
        },
        showcase: {
            heading: "Zobacz ShareWay w akcji",
            sub: "Przejrzyste koszty i plan podróży zawsze pod ręką",
            expensesTitle: "Rozliczenie wydatków",
            paidBy: "Zapłacił",
            total: "Łącznie",
            perPerson: "Na osobę",
            itineraryTitle: "Plan podróży",
            startLabel: "Rozpoczęcie"
        },
        features: {
            heading: "Wszystko, czego potrzebuje Twoja wyprawa",
            sub: "ShareWay łączy planowanie, współpracę i rozliczenia — w jednej przejrzystej aplikacji",
            items: [
                {
                    title: "Wspólne tworzenie planu",
                    description: "Zapraszaj znajomych, zbieraj propozycje i układaj harmonogram podróży."
                },
                {
                    title: "Przejrzysty podział kosztów",
                    description: "Dodawaj wydatki, a ShareWay policzy kto komu i ile powinien zwrócić."
                },
                {
                    title: "Miejsca i harmonogram w jednym widoku",
                    description: "Zapisuj kluczowe punkty podróży, aby każdy miał dostęp do aktualnego planu."
                },
                {
                    title: "Lista kontrolna przed wyjazdem",
                    description: "Twórz wspólne checklisty zadań i rzeczy do zabrania."
                },
                {
                    title: "Głosowania w grupie",
                    description: "Głosujcie nad terminami, noclegami i atrakcjami."
                },
                {
                    title: "Bezpieczne dane",
                    description: "Twoje dane są przechowywane z zachowaniem zasad bezpieczeństwa."
                }
            ]
        },
        footer: {
            description: "Wspólne planowanie i rozliczanie podróży grupowych. Razem łatwiej dotrzeć tam, gdzie chcesz.",
            productTitle: "Produkt",
            productItems: [
                "Funkcje",
                "Cennik",
                "FAQ"
            ],
            companyTitle: "Firma",
            companyItems: [
                "O nas",
                "Blog",
                "Kontakt"
            ],
            legalTitle: "Prawne",
            legalItems: [
                "Polityka prywatności",
                "Regulamin",
                "Cookies"
            ],
            social: {
                facebook: "Facebook",
                instagram: "Instagram",
                twitter: "Twitter"
            },
            rights: "Wszystkie prawa zastrzeżone."
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
                    invalidCredentials: "Nieprawidłowy e-mail lub hasło."
                }
            },
            register: {
                title: "Załóż konto",
                subtitle: "Dołącz do społeczności podróżników",
                submit: "Zarejestruj się",
                haveAccount: "Masz już konto?",
                signIn: "Zaloguj się"
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
                and: "oraz"
            },
            toast: {
                loginSuccess: "Zalogowano pomyślnie!",
                registerSuccess: "Konto utworzone pomyślnie!",
                logoutSuccess: "Wylogowano pomyślnie!"
            },
            validation: {
                name: {
                    required: "Imię jest wymagane",
                    min: (n)=>`Imię musi mieć co najmniej ${n} znaki`
                },
                email: {
                    required: "E-mail jest wymagany",
                    invalid: "Nieprawidłowy format adresu e-mail"
                },
                password: {
                    required: "Hasło jest wymagane",
                    min: (n)=>`Hasło musi mieć co najmniej ${n} znaków`,
                    lowercase: "Hasło musi zawierać małą literę",
                    uppercase: "Hasło musi zawierać dużą literę",
                    number: "Hasło musi zawierać cyfrę",
                    special: "Hasło musi zawierać znak specjalny"
                },
                confirm: {
                    required: "Potwierdź hasło",
                    mismatch: "Hasła nie są identyczne"
                },
                terms: {
                    required: "Musisz zaakceptować regulamin"
                }
            }
        },
        dashboard: {
            subtitle: "Zarządzaj wspólnymi wyjazdami, zapraszaj znajomych i łatwo ogarniaj koszty.",
            empty: {
                title: "Nie masz jeszcze żadnych podróży",
                description: "Dołącz do istniejącej wyprawy za pomocą kodu zaproszenia albo stwórz nową podróż i zaproś znajomych."
            },
            actions: {
                joinTrip: "Dołącz do podróży",
                newTrip: "Nowa podróż",
                openTrip: "Otwórz podróż",
                copyCode: "Kopiuj kod zaproszenia",
                archive: "Archiwizuj podróż",
                restore: "Przywróć podróż",
                delete: "Usuń podróż",
                moreActions: "Więcej akcji"
            },
            filters: {
                searchPlaceholder: "Szukaj po nazwie lub miejscu…",
                all: "Wszystkie",
                active: "Aktywne",
                organizer: "Jestem organizatorem",
                participant: "Jestem uczestnikiem",
                moreFilters: "Więcej filtrów",
                dateRange: "Zakres dat",
                from: "Od",
                to: "Do",
                location: "Miejsce docelowe",
                locationPlaceholder: "np. Chorwacja",
                participantsCount: "Liczba uczestników",
                min: "Min.",
                max: "Maks.",
                reset: "Wyczyść filtry",
                apply: "Zastosuj"
            },
            sort: {
                label: "Sortowanie",
                startDate: "Data rozpoczęcia",
                name: "Nazwa",
                lastActivity: "Ostatnia aktywność",
                role: "Rola"
            },
            dialogs: {
                joinTitle: "Dołącz do podróży",
                joinDescription: "Wpisz kod zaproszenia, który otrzymałeś od organizatora wyprawy.",
                joinPlaceholder: "Wpisz kod zaproszenia (np. TRIP-2025-ABC)",
                cancel: "Anuluj",
                joinButton: "Dołącz",
                newTripTitle: "Nowa podróż",
                newTripDescription: "Utwórz nową wyprawę, ustal miejsce, daty i zaproś znajomych.",
                tripName: "Nazwa podróży",
                tripNamePlaceholder: "np. Majówka w Chorwacji",
                destination: "Miejsce docelowe",
                destinationPlaceholder: "np. Split, Chorwacja",
                startDate: "Data rozpoczęcia",
                endDate: "Data zakończenia",
                createButton: "Utwórz podróż",
                archiveTitle: "Zarchiwizować tę podróż?",
                archiveButton: "Archiwizuj",
                restoreTitle: "Przywrócić tę podróż?",
                restoreDescription: "Podróż zostanie ponownie oznaczona jako aktywna.",
                restoreButton: "Przywróć",
                deleteTitle: "Usunąć tę podróż?",
                deleteDescription: "Tej operacji nie można cofnąć. Wszystkie dane podróży zostaną usunięte.",
                deleteButton: "Usuń podróż"
            },
            roles: {
                organizer: "Organizator",
                participant: "Uczestnik"
            },
            moreMembers: "osób więcej",
            toasts: {
                codeCopied: "Kod zaproszenia skopiowany",
                tripDeleted: "Podróż została usunięta.",
                tripRestored: "Podróż została przywrócona.",
                invalidCode: "Nieprawidłowy kod zaproszenia.",
                joinedTrip: "Dołączono do podróży."
            },
            pagination: {
                previous: "Poprzednia",
                next: "Następna"
            },
            /* Uzupełnienie z origin/main */ modules: {
                voting: {
                    name: "Głosowanie",
                    description: "Podejmujcie decyzje wspólnie"
                },
                costs: {
                    name: "Koszty",
                    description: "Rozliczajcie wspólne wydatki"
                },
                schedule: {
                    name: "Harmonogram",
                    description: "Planujcie trasę i atrakcje"
                },
                checklist: {
                    name: "Lista kontrolna",
                    description: "Co zabrać i co zrobić"
                }
            }
        }
    },
    en: {
        brand: "ShareWay",
        nav: {
            login: "Log in",
            signup: "Sign up",
            logout: "Log out",
            profile: "Profile",
            settings: "Settings"
        },
        hero: {
            kicker: "Trip planning has never been easier",
            title: "ShareWay — plan and split group trips together",
            subtitle: "From collaborative planning to transparent cost sharing. No chaos, no spreadsheets.",
            ctaStart: "Start for free",
            ctaHow: "See how it works"
        },
        cta: {
            badge: "Free sign-up — no credit card",
            title: "Ready for your best adventure?",
            text1: "Join thousands already planning trips with",
            text2: "Start for free and see how simple group travel can be.",
            primary: "Start planning",
            secondary: "I already have an account",
            foot: "No commitments • Cancel anytime • 24/7 support"
        },
        how: {
            heading: "How it works?",
            sub: "Three simple steps to a perfectly organized trip",
            steps: [
                {
                    title: "Create a group",
                    description: "Create a trip and invite friends. Anyone can join in seconds."
                },
                {
                    title: "Plan together",
                    description: "Pick places, set the route and schedule together. Vote on ideas."
                },
                {
                    title: "Settle up easily",
                    description: "Add expenses, split costs automatically and settle stress-free after the trip."
                }
            ]
        },
        showcase: {
            heading: "See ShareWay in action",
            sub: "Clear costs and itinerary always at hand",
            expensesTitle: "Trip expenses",
            paidBy: "Paid by",
            total: "Total",
            perPerson: "Per person",
            itineraryTitle: "Itinerary",
            startLabel: "Start"
        },
        features: {
            heading: "Everything your trip needs",
            sub: "ShareWay brings planning, collaboration and cost sharing together — in a single clear app",
            items: [
                {
                    title: "Plan together in one place",
                    description: "Invite friends, collect ideas and keep your trip schedule in one shared space that everyone can access."
                },
                {
                    title: "Clear cost sharing",
                    description: "Add expenses during the trip and let ShareWay help you see who owes what to whom — no spreadsheets needed."
                },
                {
                    title: "Itinerary and places in one view",
                    description: "Save key stops, times and locations so the whole group follows the same, always up-to-date plan."
                },
                {
                    title: "Trip checklist",
                    description: "Create a shared checklist of things to pack and tasks to do before you leave, so nobody forgets the essentials."
                },
                {
                    title: "Group voting",
                    description: "Run quick polls to choose dates, stays or activities instead of endless back-and-forth in chat apps."
                },
                {
                    title: "Secure data",
                    description: "Your trip plans and cost data are stored with attention to security and privacy best practices."
                }
            ]
        },
        footer: {
            description: "Group trip planning and cost sharing made simple. It's easier to get where you want when you travel together.",
            productTitle: "Product",
            productItems: [
                "Features",
                "Pricing",
                "FAQ"
            ],
            companyTitle: "Company",
            companyItems: [
                "About",
                "Blog",
                "Contact"
            ],
            legalTitle: "Legal",
            legalItems: [
                "Privacy policy",
                "Terms of use",
                "Cookies"
            ],
            social: {
                facebook: "Facebook",
                instagram: "Instagram",
                twitter: "Twitter"
            },
            rights: "All rights reserved."
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
                    invalidCredentials: "Invalid email or password."
                }
            },
            register: {
                title: "Sign up",
                subtitle: "Join our community of travelers",
                submit: "Sign up",
                haveAccount: "Already have an account?",
                signIn: "Log in"
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
                and: "and"
            },
            toast: {
                loginSuccess: "Logged in successfully!",
                registerSuccess: "Account created successfully!",
                logoutSuccess: "Logged out successfully!"
            },
            validation: {
                name: {
                    required: "Name is required",
                    min: (n)=>`Name must be at least ${n} characters long`
                },
                email: {
                    required: "Email is required",
                    invalid: "Invalid email format"
                },
                password: {
                    required: "Password is required",
                    min: (n)=>`Password must be at least ${n} characters long`,
                    lowercase: "Password must contain a lowercase letter",
                    uppercase: "Password must contain an uppercase letter",
                    number: "Password must contain a number",
                    special: "Password must contain a special character"
                },
                confirm: {
                    required: "Please confirm your password",
                    mismatch: "Passwords do not match"
                },
                terms: {
                    required: "You must accept the terms"
                }
            }
        },
        dashboard: {
            subtitle: "Manage group trips, invite friends and keep costs under control with ease.",
            empty: {
                title: "You don’t have any trips yet",
                description: "Join an existing trip using an invite code or create a new one and invite your friends."
            },
            actions: {
                joinTrip: "Join a trip",
                newTrip: "New trip",
                openTrip: "Open trip",
                copyCode: "Copy invite code",
                archive: "Archive trip",
                restore: "Restore trip",
                delete: "Delete trip",
                moreActions: "More actions"
            },
            filters: {
                searchPlaceholder: "Search by name or destination…",
                all: "All",
                active: "Active",
                organizer: "I’m an organizer",
                participant: "I’m a participant",
                moreFilters: "More filters",
                dateRange: "Date range",
                from: "From",
                to: "To",
                location: "Destination",
                locationPlaceholder: "e.g. Croatia",
                participantsCount: "Number of participants",
                min: "Min",
                max: "Max",
                reset: "Clear filters",
                apply: "Apply"
            },
            sort: {
                label: "Sort by",
                startDate: "Start date",
                name: "Name",
                lastActivity: "Last activity",
                role: "Role"
            },
            dialogs: {
                joinTitle: "Join a trip",
                joinDescription: "Enter the invite code you received from the trip organizer.",
                joinPlaceholder: "Enter invite code (e.g. TRIP-2025-ABC)",
                cancel: "Cancel",
                joinButton: "Join",
                newTripTitle: "New trip",
                newTripDescription: "Create a new trip, set dates and destination, then invite your friends.",
                tripName: "Trip name",
                tripNamePlaceholder: "e.g. May getaway in Croatia",
                destination: "Destination",
                destinationPlaceholder: "e.g. Split, Croatia",
                startDate: "Start date",
                endDate: "End date",
                createButton: "Create trip",
                archiveTitle: "Archive this trip?",
                archiveButton: "Archive",
                restoreTitle: "Restore this trip?",
                restoreDescription: "The trip will be marked as active again.",
                restoreButton: "Restore",
                deleteTitle: "Delete this trip?",
                deleteDescription: "This action cannot be undone. All trip data will be removed.",
                deleteButton: "Delete trip"
            },
            roles: {
                organizer: "Organizer",
                participant: "Participant"
            },
            moreMembers: "more people",
            toasts: {
                codeCopied: "Invite code copied",
                tripDeleted: "Trip has been deleted.",
                tripRestored: "Trip has been restored.",
                invalidCode: "Invalid invite code.",
                joinedTrip: "You joined the trip."
            },
            pagination: {
                previous: "Previous",
                next: "Next"
            },
            /* modules from origin/main */ modules: {
                voting: {
                    name: "Voting",
                    description: "Make decisions together"
                },
                costs: {
                    name: "Costs",
                    description: "Split shared expenses"
                },
                schedule: {
                    name: "Schedule",
                    description: "Plan route and attractions"
                },
                checklist: {
                    name: "Checklist",
                    description: "What to pack and do"
                }
            }
        }
    }
};
const getTranslations = (lang)=>dict[lang];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/context/LanguageContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useI18n",
    ()=>useI18n
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const I18nContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function LanguageProvider({ initialLang, children }) {
    _s();
    const [lang, setLangState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLang);
    const setLang = (l)=>{
        setLangState(l);
        try {
            localStorage.setItem("lang", l);
        } catch  {}
        if (typeof document !== "undefined") {
            document.cookie = `lang=${encodeURIComponent(l)}; path=/; max-age=31536000; samesite=lax`;
            document.documentElement.setAttribute("lang", l);
        }
    };
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LanguageProvider.useMemo[t]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dict"][lang]
    }["LanguageProvider.useMemo[t]"], [
        lang
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LanguageProvider.useMemo[value]": ()=>({
                lang,
                setLang,
                t
            })
    }["LanguageProvider.useMemo[value]"], [
        lang,
        t
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(I18nContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/app/context/LanguageContext.tsx",
        lineNumber: 49,
        columnNumber: 10
    }, this);
}
_s(LanguageProvider, "A+dnZsHmxC0evrh2a71aqGchjlw=");
_c = LanguageProvider;
function useI18n() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(I18nContext);
    if (!ctx) {
        throw new Error("useI18n must be used within LanguageProvider");
    }
    return ctx;
}
_s1(useI18n, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/ui/toaster.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppToaster",
    ()=>AppToaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function AppToaster() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        position: "top-center",
        richColors: true
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/ui/toaster.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = AppToaster;
var _c;
__turbopack_context__.k.register(_c, "AppToaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_033b02c8._.js.map