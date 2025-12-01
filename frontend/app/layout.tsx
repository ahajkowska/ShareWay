import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { LanguageProvider } from "@/app/context/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { AppToaster } from "./components/ui/toaster";

export const metadata: Metadata = {
  title: "ShareWay",
  description: "Wspólne planowanie i rozliczanie podróży grupowych",
};

const DEFAULT_LANG: Lang = "pl";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLang = DEFAULT_LANG;

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="shareway-theme"
        >
          <LanguageProvider initialLang={initialLang}>
            {children}
            <AppToaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
