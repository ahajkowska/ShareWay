"use client";

import Logo from "./Logo";
import { useI18n } from "@/app/context/LanguageContext";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold">{t.brand}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{t.footer.social.facebook}</span>
              <span>{t.footer.social.instagram}</span>
              <span>{t.footer.social.twitter}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.footer.productTitle}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {t.footer.productItems.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumna: Firma */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.companyTitle}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {t.footer.companyItems.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumna: Prawne */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.legalTitle}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {t.footer.legalItems.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {year} {t.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
