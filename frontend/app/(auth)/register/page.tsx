"use client";

import AuthSplitLayout from "../components/AuthSplitLayout";
import RegisterForm from "../components/RegisterForm";
import { useI18n } from "@/app/context/LanguageContext";

const DARK = "/auth/dark-register.jpg";
const LIGHT = "/auth/light-register.jpg";

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <AuthSplitLayout
      title={t.auth.register.title}
      subtitle={t.auth.register.subtitle}
      bgSrcLight={LIGHT}
      bgSrcDark={DARK}
      sideSrcLight={LIGHT}
      sideSrcDark={DARK}
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
