import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { LanguageProvider } from "@/app/context/LanguageContext";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "ShareWay",
  description: "Wspólne planowanie i rozliczanie podróży grupowych",
};

const DEFAULT_LANG: Lang = "pl";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLang = DEFAULT_LANG;

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider initialLang={initialLang}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
