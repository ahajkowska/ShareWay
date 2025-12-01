"use client";

import AuthSplitLayout from "../components/AuthSplitLayout";
import LoginForm from "../components/LoginForm";
import { useI18n } from "@/app/context/LanguageContext";

const DARK = "/auth/dark-login.jpg";
const LIGHT = "/auth/light-login.jpg";

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <AuthSplitLayout
      title={t.auth.login.title}
      subtitle={t.auth.login.subtitle}
      bgSrcLight={LIGHT}
      bgSrcDark={DARK}
      sideSrcLight={LIGHT}
      sideSrcDark={DARK}
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
