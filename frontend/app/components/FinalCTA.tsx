"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";

export default function FinalCTA() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden py-32 bg-gradient-hero">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-16 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-16 w-52 h-52 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">{t.cta.badge}</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
            {t.cta.title}
          </h2>

          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
            {t.cta.text1}{" "}
            <span className="font-semibold text-white">ShareWay</span>.
            <br className="hidden sm:block" />
            {t.cta.text2}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="
                  text-lg px-10 h-14 font-semibold shadow-2xl group
                  bg-amber-500 hover:bg-amber-600 text-white
                  dark:bg-sky-500 dark:hover:bg-sky-400
                  transition-all duration-300
                "
              >
                {t.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="
                  text-lg px-10 h-14 font-semibold rounded-xl
                  bg-transparent text-white border-2 border-white
                  hover:bg-white/10
                  transition-all duration-300
                "
              >
                {t.cta.secondary}
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 text-sm text-white/70"
          >
            {t.cta.foot}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
