import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  children,
  loading = false,
  disabled,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClassName =
    variant === "secondary"
      ? "border border-border bg-surface text-foreground hover:bg-surface-muted"
      : variant === "danger"
        ? "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
        : "bg-foreground text-background hover:opacity-90";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60 touch-manipulation sm:min-h-12 ${variantClassName} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
        />
      ) : null}
      {children}
    </button>
  );
}
