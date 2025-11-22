"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useI18n } from "@/app/context/LanguageContext";

type LangCode = "pl" | "en";

type Props = {
  mode?: "button" | "menu";
  radius?: number;
  spread?: number;
  offsetX?: number;
  size?: number;
};

function FlagPL({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      aria-hidden
      focusable="false"
    >
      <mask id="m-pl">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#m-pl)">
        <path fill="#eee" d="M0 0h512v256H0z" />
        <path fill="#d80027" d="M0 256h512v256H0z" />
      </g>
    </svg>
  );
}

function FlagGB({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      aria-hidden
      focusable="false"
    >
      <mask id="m-gb">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#m-gb)">
        <path fill="#012169" d="M0 0h512v512H0z" />
        <path d="M0 0l512 512M512 0L0 512" stroke="#fff" strokeWidth="120" />
        <path d="M0 0l512 512M512 0L0 512" stroke="#C8102E" strokeWidth="72" />
        <path fill="#fff" d="M216 0h80v512h-80z" />
        <path fill="#fff" d="M0 216h512v80H0z" />
        <path fill="#C8102E" d="M236 0h40v512h-40z" />
        <path fill="#C8102E" d="M0 236h512v40H0z" />
      </g>
    </svg>
  );
}

function LangFlag({ code, size = 22 }: { code: LangCode; size?: number }) {
  return code === "pl" ? <FlagPL size={size} /> : <FlagGB size={size} />;
}

export default function LanguageToggle({
  mode = "button",
  radius = 42,
  spread = 22,
  offsetX = 0,
  size = 40,
}: Props) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const options: ReadonlyArray<{ code: LangCode; aria: string }> = [
    { code: "pl", aria: "Zmień język na polski" },
    { code: "en", aria: "Switch language to English" },
  ];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (mode === "menu") {
    return (
      <div
        className="w-full flex items-center justify-center gap-3"
        ref={wrapRef}
      >
        {options.map((o) => {
          const isActive = lang === o.code;
          return (
            <button
              key={o.code}
              onClick={() => setLang(o.code)}
              aria-label={o.aria}
              title={o.aria}
              className="relative flex items-center justify-center transition focus:outline-none"
              style={{ width: size, height: size, borderRadius: size / 2 }}
            >
              {isActive && (
                <>
                  <span
                    className="absolute inset-0 rounded-full ring-2 ring-primary/50"
                    aria-hidden
                  />
                  <span
                    className="absolute inset-0 rounded-full bg-primary/15 blur-md"
                    aria-hidden
                  />
                </>
              )}
              <span
                className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 bg-foreground/10 blur-sm transition"
                aria-hidden
              />
              <LangFlag code={o.code} size={Math.max(20, size - 16)} />
            </button>
          );
        })}
      </div>
    );
  }

  const targets: Array<{ code: LangCode; x: number; y: number }> = [
    { code: "pl", x: -spread + offsetX, y: radius },
    { code: "en", x: spread + offsetX, y: radius },
  ];

  const buttonAria = `Change language, current: ${
    lang === "pl" ? "Polski" : "English"
  }`;

  return (
    <div
      className="relative inline-flex"
      ref={wrapRef}
      style={{ overflow: "visible" }}
    >
      <Button
        variant="outline"
        size="icon"
        className="relative h-9 w-9 rounded-full border-0 shadow-sm bg-linear-to-b from-background/70 to-background/40 backdrop-blur-xl ring-1 ring-border/60"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonAria}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`absolute -inset-1 rounded-full blur-lg transition ${
            open ? "bg-primary/20" : "bg-transparent"
          }`}
          aria-hidden
        />
        <LangFlag code={lang} />
        <span className="sr-only">{lang === "pl" ? "Polski" : "English"}</span>
      </Button>

      {targets.map((p, i) => {
        const active = lang === p.code;
        return (
          <AnimatePresence key={p.code}>
            {open && (
              <motion.button
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.86 }}
                animate={{ opacity: 1, x: p.x, y: p.y, scale: 1 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.86 }}
                transition={{
                  type: "spring",
                  stiffness: 640,
                  damping: 32,
                  mass: 0.5,
                  delay: i * 0.035,
                }}
                onClick={() => {
                  setLang(p.code);
                  setOpen(false);
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-background/80 backdrop-blur-xl ring-1 ring-border/60 shadow-lg focus:outline-none"
                style={{ width: size, height: size, borderRadius: size / 2 }}
                aria-label={
                  p.code === "pl"
                    ? "Zmień język na polski"
                    : "Switch language to English"
                }
              >
                {active && (
                  <>
                    <span
                      className="absolute inset-0 rounded-full ring-2 ring-primary/50"
                      aria-hidden
                    />
                    <span
                      className="absolute inset-0 rounded-full bg-primary/15 blur-md"
                      aria-hidden
                    />
                  </>
                )}
                <LangFlag code={p.code} size={Math.max(20, size - 16)} />
              </motion.button>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}
