"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { toast } from "sonner";

import { useRememberedEmail } from "../hooks/useRememberedEmail";
import { useExplainLoginError } from "../hooks/useExplainLoginError";
import { FieldError } from "../hooks/useFieldError";
import { ServerErrorBanner } from "../hooks/useServerErrorBanner";

export default function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const { remember, email, update } = useRememberedEmail();
  const { explainLoginError } = useExplainLoginError();

  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState<string>();

  const schema = Yup.object({
    email: Yup.string()
      .email(t.auth.validation.email.invalid)
      .required(t.auth.validation.email.required),
    password: Yup.string()
      .min(8, t.auth.validation.password.min(8))
      .required(t.auth.validation.password.required),
    remember: Yup.boolean(),
  });

  return (
    <Formik
      initialValues={{ email: email || "", password: "", remember }}
      enableReinitialize
      validationSchema={schema}
      validateOnMount
      onSubmit={async (values, { setSubmitting }) => {
        setServerError(undefined);
        try {
          console.log("Login attempt:", values);
          update(values.remember, values.email);

          toast.success(t.auth.toast.loginSuccess, {
            description: `${values.email}`,
            duration: 2000,
          });

          router.replace(from || "/dashboard");
        } catch (err: any) {
          const pretty = explainLoginError(err, t);
          setServerError(pretty);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, errors, touched, values }) => (
        <Form className="space-y-4">
          <ServerErrorBanner message={serverError} />

          <div className="space-y-1">
            <label htmlFor="login-email" className="text-sm font-medium">
              {t.auth.common.emailLabel}
            </label>
            <div className="relative">
              <Field
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(touched.email && errors.email)}
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
            <FieldError name="email" id="login-email-error" />
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="text-sm font-medium">
              {t.auth.common.passwordLabel}
            </label>
            <div className="relative">
              <Field
                id="login-password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={Boolean(touched.password && errors.password)}
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
                  show ? t.auth.common.hidePassword : t.auth.common.showPassword
                }
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError name="password" id="login-password-error" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <Field
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-muted bg-background"
                checked={values.remember}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("remember", e.target.checked)
                }
              />
              {t.auth.common.rememberMe}
            </label>
            <Link href="#" className="text-sm text-primary hover:underline">
              {t.auth.common.forgotPassword}
            </Link>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-11">
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
            )}
            {t.auth.login.submit}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t.auth.login.noAccount}{" "}
            <Link href="/register" className="text-primary hover:underline">
              {t.auth.login.createOne}
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
