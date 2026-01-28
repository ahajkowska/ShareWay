"use client";

import { useSearchParams } from "next/navigation";
import AuthSplitLayout from "../components/AuthSplitLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { Suspense } from "react";

const DARK = "/auth/dark-register.jpg";
const LIGHT = "/auth/light-register.jpg"; // Re-using register images for now

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    return (
        <AuthSplitLayout
            title="Reset Password"
            subtitle="Enter your new password below"
            bgSrcLight={LIGHT}
            bgSrcDark={DARK}
            sideSrcLight={LIGHT}
            sideSrcDark={DARK}
        >
            {token ? (
                <ResetPasswordForm token={token} />
            ) : (
                <div className="text-center text-destructive">
                    Invalid or missing reset token.
                </div>
            )}
        </AuthSplitLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
