"use client";

import { ErrorMessage } from "formik";

export function FieldError({ name, id }: { name: string; id: string }) {
  return (
    <ErrorMessage name={name}>
      {(msg) => (
        <p
          id={id}
          className="text-xs text-destructive font-medium mt-1"
          role="alert"
          aria-live="polite"
        >
          {msg as string}
        </p>
      )}
    </ErrorMessage>
  );
}
