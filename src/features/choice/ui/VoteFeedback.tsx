type VoteFeedbackProps = {
  message: string;
};

export function VoteFeedback({ message }: VoteFeedbackProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
      role="alert"
      aria-live="assertive"
    >
      <p className="rounded-3xl bg-surface px-8 py-6 text-center text-lg font-bold text-foreground shadow-xl sm:text-xl">
        {message}
      </p>
    </div>
  );
}
