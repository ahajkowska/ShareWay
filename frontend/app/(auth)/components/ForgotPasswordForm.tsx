"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";
import { FieldError } from "../hooks/useFieldError";
import { ServerErrorBanner } from "../hooks/useServerErrorBanner";

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string>();

  const schema = Yup.object({
    email: Yup.string().email("Nieprawidłowy e-mail").required("Wymagane"),
  });

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setServerError(undefined);
        try {
          const res = await fetch(apiUrl("/auth/forgot-password"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: values.email }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            // Prefer friendly validation feedback instead of raw backend errors
            if (res.status === 400 || res.status === 404) {
              throw new Error("Nieprawidłowy e-mail.");
            }
            throw new Error(data?.message || "Nie udało się wysłać maila.");
          }
          toast.success("Wysłano link do resetu hasła");
          resetForm();
        } catch (err: any) {
          setServerError(err?.message || "Nie udało się wysłać maila.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, errors, touched }) => (
        <Form className="space-y-4">
          <ServerErrorBanner message={serverError} />

          <div className="space-y-1">
            <label htmlFor="forgot-email" className="text-sm font-medium">
              E-mail
            </label>
            <div className="relative">
              <Field
                id="forgot-email"
                name="email"
                type="email"
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
            <FieldError name="email" id="forgot-email-error" />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-11">
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
            )}
            Wyślij link
          </Button>
        </Form>
      )}
    </Formik>
  );
}
