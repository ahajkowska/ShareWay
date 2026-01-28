"use client";

import AuthSplitLayout from "../components/AuthSplitLayout";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

const DARK = "/auth/dark-login.jpg";
const LIGHT = "/auth/light-login.jpg";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      title="Zapomniałeś hasła?"
      subtitle="Podaj e-mail, a wyślemy link do resetu."
      bgSrcLight={LIGHT}
      bgSrcDark={DARK}
      sideSrcLight={LIGHT}
      sideSrcDark={DARK}
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
