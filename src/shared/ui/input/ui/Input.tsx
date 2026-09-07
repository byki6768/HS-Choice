import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  bubble?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, bubble, required, className = "", ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-accent">*</span> : null}
      </label>
      {bubble}
      <input
        id={id}
        ref={ref}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : bubble ? `${id}-hint` : undefined
        }
        className={`min-h-12 w-full rounded-2xl border bg-background px-4 text-base text-foreground outline-none transition placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
          error
            ? "border-red-400 focus-visible:ring-red-400"
            : "border-border"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});
