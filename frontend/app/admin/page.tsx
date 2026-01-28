"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/app/context/LanguageContext";
import UsersManagement from "./components/UsersManagement";

export default function AdminPage() {
  const { lang } = useI18n();

  const t = {
    pl: {
      title: "Panel Administratora",
      subtitle: "Zarządzaj użytkownikami",
    },
    en: {
      title: "Admin Panel",
      subtitle: "Manage users",
    },
  }[lang];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t.subtitle}
        </p>
      </motion.div>

      {/* Content */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <UsersManagement />
      </div>
    </div>
  );
}
