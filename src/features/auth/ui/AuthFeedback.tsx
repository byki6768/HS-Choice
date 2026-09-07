type AuthFeedbackProps = {
  message: string;
};

export function AuthFeedback({ message }: AuthFeedbackProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
      role="status"
      aria-live="polite"
    >
      <p className="rounded-3xl bg-surface px-8 py-6 text-center text-lg font-bold text-foreground shadow-xl sm:text-xl">
        {message}
      </p>
    </div>
  );
}
