"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { resetPassword } from "@/lib/api";
import { useI18n } from "@/app/context/LanguageContext";

import { PasswordChecklist } from "../hooks/usePasswordChecklist";
import { FieldError } from "../hooks/useFieldError";
import { ServerErrorBanner } from "../hooks/useServerErrorBanner";

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const { lang } = useI18n();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [serverError, setServerError] = useState<string>();

    const isPL = lang === 'pl';

    const t = {
        labels: {
            password: isPL ? "Nowe hasło" : "New Password",
            confirm: isPL ? "Potwierdź hasło" : "Confirm Password",
            submit: isPL ? "Zresetuj hasło" : "Reset Password"
        },
        validation: {
            min: isPL ? "Minimum 8 znaków" : "Minimum 8 characters",
            required: isPL ? "Wymagane" : "Required",
            mismatch: isPL ? "Hasła muszą być identyczne" : "Passwords must match"
        },
        success: isPL ? "Hasło zostało zresetowane. Możesz się teraz zalogować." : "Password reset successfully. You can now login.",
        error: isPL ? "Nie udało się zresetować hasła. Token mógł wygasł lub być nieprawidłowy." : "Failed to reset password. Token might be invalid or expired."
    };

    const labels = useMemo(
        () => ({
            min: isPL ? "Min. 8 znaków" : "8+ chars",
            lower: isPL ? "mała litera" : "lowercase",
            upper: isPL ? "duża litera" : "uppercase",
            number: isPL ? "cyfra" : "number",
            special: isPL ? "znak specjalny" : "special char",
        }),
        [isPL]
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
                password: Yup.string()
                    .min(8, t.validation.min)
                    .matches(/[a-z]/, labels.lower)
                    .matches(/[A-Z]/, labels.upper)
                    .matches(/\d/, labels.number)
                    .matches(/[^A-Za-z0-9]/, labels.special)
                    .required(t.validation.required),
                confirm: Yup.string()
                    .oneOf([Yup.ref("password")], t.validation.mismatch)
                    .required(t.validation.required),
            }),
        [t, labels]
    );

    return (
        <Formik
            initialValues={{
                password: "",
                confirm: "",
            }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                    setServerError(undefined);
                    await resetPassword(token, values.password);

                    toast.success(t.success, { duration: 2200 });
                    resetForm();
                    router.replace("/login");
                } catch (err: any) {
                    setServerError(err.message || t.error);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting, setFieldValue, errors, touched, values }) => (
                <Form className="space-y-4">
                    <ServerErrorBanner message={serverError} />

                    <div className="space-y-1">
                        <label htmlFor="reg-password" className="text-sm font-medium">
                            {t.labels.password}
                        </label>
                        <div className="relative">
                            <Field
                                id="reg-password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                autoComplete="new-password"
                                className={`w-full h-11 rounded-xl border bg-background/70 px-4 pr-10 outline-none focus:ring-2 focus:ring-ring ${touched.password && errors.password
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
                                aria-label={showPass ? "Hide" : "Show"}
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
                            {t.labels.confirm}
                        </label>
                        <div className="relative">
                            <Field
                                id="reg-confirm"
                                name="confirm"
                                type={showConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                className={`w-full h-11 rounded-xl border bg-background/70 px-4 pr-10 outline-none focus:ring-2 focus:ring-ring ${touched.confirm && errors.confirm ? "border-destructive" : ""
                                    }`}
                                placeholder="••••••••"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("confirm", e.target.value);
                                    setServerError(undefined);
                                }}
                            />
                            <button
                                type="button"
                                aria-label={showConfirm ? "Hide" : "Show"}
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

                    <Button type="submit" disabled={isSubmitting} className="w-full h-11">
                        {isSubmitting && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
                        )}
                        {t.labels.submit}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
