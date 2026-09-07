"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { SpeechBubble } from "./SpeechBubble";

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  error?: string;
  bubble?: string;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { id, label, error, bubble, required, className = "", ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-0.5 text-accent">*</span> : null}
        </label>
        {bubble ? <SpeechBubble id={`${inputId}-hint`} message={bubble} /> : null}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            required={required}
            autoComplete={props.autoComplete ?? "current-password"}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : bubble
                  ? `${inputId}-hint`
                  : undefined
            }
            className={`min-h-12 w-full rounded-2xl border bg-background py-2 pr-14 pl-4 text-base tracking-[0.2em] text-foreground outline-none transition placeholder:tracking-normal placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              error
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-border"
            } ${className}`}
            {...props}
            type={visible ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
            aria-pressed={visible}
            className="absolute top-1/2 right-2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-xl text-muted transition hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";

function EyeIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 6.8C4.4 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.9 0 3.6-.5 5-.1M10 5.2C10.6 5.1 11.3 5 12 5c6 0 9.5 7 9.5 7s-.8 1.6-2.3 3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
