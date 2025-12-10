module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/components/ThemeProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        enableColorScheme: false,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/ThemeProvider.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/i18n.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
            dashboard: "Panel",
            logout: "Wyloguj"
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
                    description: "Zapraszaj znajomych, zbieraj propozycje i układaj harmonogram podróży w jednym miejscu, czytelnie dla całej grupy."
                },
                {
                    title: "Przejrzysty podział kosztów",
                    description: "Dodawaj wydatki w trakcie wyjazdu, a ShareWay pomoże policzyć, kto komu i ile powinien zwrócić — bez arkuszy i ręcznych podsumowań."
                },
                {
                    title: "Miejsca i harmonogram w jednym widoku",
                    description: "Zapisuj kluczowe punkty podróży, godziny i lokalizacje, aby każdy uczestnik miał dostęp do aktualnego planu."
                },
                {
                    title: "Lista kontrolna przed wyjazdem",
                    description: "Twórz wspólne checklisty rzeczy do zabrania i zadań do wykonania przed podróżą, żeby nikt nie zapomniał o najważniejszych rzeczach."
                },
                {
                    title: "Głosowania w grupie",
                    description: "Głosujcie nad terminami, noclegami czy atrakcjami i podejmujcie decyzje szybko, zamiast przedzierać się przez długie konwersacje."
                },
                {
                    title: "Bezpieczne dane",
                    description: "Plany podróży i dane dotyczące kosztów są przechowywane z zachowaniem zasad bezpieczeństwa i ochrony prywatności."
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
        }
    },
    en: {
        brand: "ShareWay",
        nav: {
            login: "Log in",
            signup: "Sign up",
            dashboard: "Dashboard",
            logout: "Log out"
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
            description: "Group trip planning and cost sharing made simple. It’s easier to get where you want when you travel together.",
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
        }
    }
};
const getTranslations = (lang)=>dict[lang];
}),
"[project]/app/context/LanguageContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useI18n",
    ()=>useI18n
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/i18n.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const I18nContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function LanguageProvider({ initialLang, children }) {
    const [lang, setLangState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialLang);
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
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dict"][lang], [
        lang
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            lang,
            setLang,
            t
        }), [
        lang,
        t
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(I18nContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/context/LanguageContext.tsx",
        lineNumber: 49,
        columnNumber: 10
    }, this);
}
function useI18n() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(I18nContext);
    if (!ctx) {
        throw new Error("useI18n must be used within LanguageProvider");
    }
    return ctx;
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d7be38d2._.js.map