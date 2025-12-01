"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Mail, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { toast } from "sonner";

import { PasswordChecklist } from "../hooks/usePasswordChecklist";
import { FieldError } from "../hooks/useFieldError";
import { ServerErrorBanner } from "../hooks/useServerErrorBanner";
import { useExplainRegisterError } from "../hooks/useExplainRegisterError";

export default function RegisterForm() {
  const { t } = useI18n();
  const router = useRouter();
  const { explainRegisterError } = useExplainRegisterError();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string>();

  const isPL = t.nav?.login !== "Log in";

  const labels = useMemo(
    () => ({
      min: t.auth.validation.password.min(8),
      lower:
        (t as any)?.auth?.validation?.password?.lowercase ??
        (isPL ? "Mała litera" : "At least one lowercase letter"),
      upper:
        (t as any)?.auth?.validation?.password?.uppercase ??
        (isPL ? "Duża litera" : "At least one uppercase letter"),
      number:
        (t as any)?.auth?.validation?.password?.number ??
        (isPL ? "Cyfra" : "At least one number"),
      special: isPL ? "Znak specjalny" : "At least one special character",
    }),
    [t, isPL]
  );

  const strengthLabels = useMemo(
    () => ({
      weak: isPL ? "Słabe" : "Weak",
      medium: isPL ? "Średnie" : "Medium",
      strong: isPL ? "Silne" : "Strong",
      veryStrong: isPL ? "Bardzo silne" : "Very strong",
    }),
    [isPL]
  );

  const schema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .min(2, t.auth.validation.name.min(2))
          .required(t.auth.validation.name.required),
        email: Yup.string()
          .email(t.auth.validation.email.invalid)
          .required(t.auth.validation.email.required),
        password: Yup.string()
          .min(8, t.auth.validation.password.min(8))
          .matches(/[a-z]/, labels.lower)
          .matches(/[A-Z]/, labels.upper)
          .matches(/\d/, labels.number)
          .matches(/[^A-Za-z0-9]/, labels.special)
          .required(t.auth.validation.password.required),
        confirm: Yup.string()
          .oneOf([Yup.ref("password")], t.auth.validation.confirm.mismatch)
          .required(t.auth.validation.confirm.required),
        terms: Yup.boolean().oneOf([true], t.auth.validation.terms.required),
      }),
    [t, labels]
  );

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirm: "",
        terms: false,
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          setServerError(undefined);

          console.log("Register:", values);

          toast.success(t.auth.toast.registerSuccess, {
            description: values.name,
            duration: 2200,
          });

          resetForm();
          router.replace("/login");
        } catch (err: any) {
          setServerError(explainRegisterError(err, isPL));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, errors, touched, values }) => (
        <Form className="space-y-4">
          <ServerErrorBanner message={serverError} />

          <div className="space-y-1">
            <label htmlFor="reg-name" className="text-sm font-medium">
              {t.auth.common.nameLabel}
            </label>
            <div className="relative">
              <Field
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                className={`w-full h-11 rounded-xl border bg-background/70 px-4 pr-10 outline-none focus:ring-2 focus:ring-ring ${
                  touched.name && errors.name ? "border-destructive" : ""
                }`}
                placeholder={isPL ? "Alex Podróżnik" : "Alex Traveler"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("name", e.target.value);
                  setServerError(undefined);
                }}
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FieldError name="name" id="reg-name-error" />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-email" className="text-sm font-medium">
              {t.auth.common.emailLabel}
            </label>
            <div className="relative">
              <Field
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                className={`w-full h-11 rounded-xl border bg-background/70 px-4 pr-10 outline-none focus:ring-2 focus:ring-ring ${
                  touched.email && errors.email ? "border-destructive" : ""
                }`}
                placeholder="you@example.com"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("email", e.target.value);
                  setServerError(undefined);
                }}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FieldError name="email" id="reg-email-error" />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-sm font-medium">
              {t.auth.common.passwordLabel}
            </label>
            <div className="relative">
              <Field
                id="reg-password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                className={`w-full h-11 rounded-xl border bg-background/70 px-4 pr-10 outline-none focus:ring-2 focus:ring-ring ${
                  touched.password && errors.password
                    ? "border-destructive"
                    : ""
                }`}
                placeholder="••••••••"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("password", e.target.value);
                  setServerError(undefined);
                }}
              />
              <button
                type="button"
                aria-label={
                  showPass
                    ? t.auth.common.hidePassword
                    : t.auth.common.showPassword
                }
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError name="password" id="reg-password-error" />

            {values.password.length > 0 && (
              <PasswordChecklist
                password={values.password}
                labels={labels}
                strengthLabels={strengthLabels}
              />
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-confirm" className="text-sm font-medium">
              {t.auth.common.confirmPasswordLabel}
            </label>
            <div className="relative">
              <Field
                id="reg-confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className={`w-full h-11 rounded-xl border bg-background/70 px-4 pr-10 outline-none focus:ring-2 focus:ring-ring ${
                  touched.confirm && errors.confirm ? "border-destructive" : ""
                }`}
                placeholder="••••••••"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("confirm", e.target.value);
                  setServerError(undefined);
                }}
              />
              <button
                type="button"
                aria-label={
                  showConfirm
                    ? t.auth.common.hidePassword
                    : t.auth.common.showPassword
                }
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError name="confirm" id="reg-confirm-error" />
          </div>

          <label className="flex items-start gap-3 text-sm">
            <Field
              type="checkbox"
              name="terms"
              className="mt-1 h-4 w-4 rounded border-muted bg-background"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("terms", e.target.checked);
                setServerError(undefined);
              }}
            />
            <span>
              {t.auth.common.termsPrefix}{" "}
              <Link href="#" className="text-primary hover:underline">
                {t.auth.common.terms}
              </Link>{" "}
              {t.auth.common.and}{" "}
              <Link href="#" className="text-primary hover:underline">
                {t.auth.common.privacy}
              </Link>
              .
            </span>
          </label>
          <FieldError name="terms" id="reg-terms-error" />

          <Button type="submit" disabled={isSubmitting} className="w-full h-11">
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
            )}
            {t.auth.register.submit}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t.auth.register.haveAccount}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t.auth.register.signIn}
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
