import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShareWay",
  description: "Wspólne planowanie i rozliczanie podróży grupowych",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
