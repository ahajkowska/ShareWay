"use client";

import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  subtitle: string;
  bgSrcLight: string;
  bgSrcDark: string;
  sideSrcLight: string;
  sideSrcDark: string;
  sideAlt?: string;
  children: React.ReactNode;
};

export default function AuthSplitLayout({
  title,
  subtitle,
  bgSrcLight,
  bgSrcDark,
  sideSrcLight,
  sideSrcDark,
  sideAlt = "auth side",
  children,
}: Props) {
  return (
    <section className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgSrcLight}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover block dark:hidden blur-[6px] scale-[1.03]"
        />
        <Image
          src={bgSrcDark}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover hidden dark:block blur-[6px] scale-[1.03]"
        />
      </div>

      <div
        className="
          relative z-10 mx-4 w-full max-w-5xl overflow-hidden rounded-2xl
          border border-primary/50 bg-card text-card-foreground
          ring-1 ring-primary/30
          [box-shadow:0_10px_30px_rgba(0,0,0,.20),0_0_24px_hsl(var(--primary)/0.30)]
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative hidden md:block min-h-[520px]">
            <Image
              src={sideSrcLight}
              alt={sideAlt}
              fill
              priority
              sizes="(max-width: 768px) 0vw, (max-width: 1200px) 40vw, 35vw"
              className="object-cover block dark:hidden"
            />
            <Image
              src={sideSrcDark}
              alt={sideAlt}
              fill
              priority
              sizes="(max-width: 768px) 0vw, (max-width: 1200px) 40vw, 35vw"
              className="object-cover hidden dark:block"
            />
          </div>

          <div className="p-6 sm:p-10 bg-card">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
