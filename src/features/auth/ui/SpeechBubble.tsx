type SpeechBubbleProps = {
  message: string;
  id?: string;
};

export function SpeechBubble({ message, id }: SpeechBubbleProps) {
  return (
    <div className="flex justify-center pb-2" role="status" aria-live="polite">
      <p
        id={id}
        className="relative max-w-full rounded-2xl bg-foreground px-3 py-2 text-center text-sm font-semibold text-background shadow-md"
      >
        {message}
        <span
          aria-hidden
          className="absolute top-full left-1/2 -translate-x-1/2 border-x-[7px] border-t-[8px] border-x-transparent border-t-foreground"
        />
      </p>
    </div>
  );
}
