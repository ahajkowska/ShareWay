"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";

import { Button } from "./ui/button";
import { useI18n } from "@/app/context/LanguageContext";

const slides = ["/hero-main.jpg", "/hero-main2.jpg", "/hero-main3.jpg"];

export default function Hero() {
  const { t, lang } = useI18n();
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index]}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index]}
              alt="Tło hero"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-br from-primary/70 via-secondary/50 to-background/70" />
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slajd ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-10 bg-white" : "w-2.5 bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-copy-${lang}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: "easeOut",
            }}
            className="max-w-5xl mx-auto"
            aria-live="polite"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                delay: 0.1,
              }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 text-white border border-white/30"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{t.hero.kicker}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: 0.2,
              }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight"
            >
              {t.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: 0.3,
              }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: 0.4,
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="
                    text-lg px-8 h-14 shadow-2xl group
                    bg-amber-500 hover:bg-amber-600 text-white
                    dark:bg-sky-500 dark:hover:bg-sky-400
                  "
                >
                  {t.hero.ctaStart}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </Button>
              </Link>

              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="
                    text-lg px-8 h-14
                    bg-white/10 backdrop-blur-sm
                    border-2 border-white/30 text-white
                    hover:bg-white/20
                  "
                >
                  {t.hero.ctaHow}
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
