import Image from "next/image";

type ChoiceOptionMediaProps = {
  src: string | null;
  alt: string;
  label: string;
  sizes: string;
  priority?: boolean;
  labelClassName?: string;
};

export function ChoiceOptionMedia({
  src,
  alt,
  label,
  sizes,
  priority = false,
  labelClassName = "",
}: ChoiceOptionMediaProps) {
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-500 ease-out group-hover:scale-105 group-active:scale-100"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-muted" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
      <p
        className={`absolute inset-x-0 bottom-0 p-3 text-left font-semibold leading-snug text-white drop-shadow-sm sm:p-4 ${labelClassName}`}
      >
        {label}
      </p>
    </>
  );
}
