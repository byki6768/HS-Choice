"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react";

type PhoneFieldsProps = {
  id: string;
  countryCode: string;
  phone: string;
  disabled?: boolean;
  bubble?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  onCountryCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};

const COUNTRY_CODES = Array.from({ length: 100 }, (_, index) => index);

const fieldClassName =
  "min-h-12 rounded-2xl border border-border bg-background text-base text-foreground outline-none transition placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60";

function digitsFromCountryCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 2);
}

function toCountryCode(value: string) {
  const digits = digitsFromCountryCode(value);

  if (!digits) {
    return "+82";
  }

  const parsed = Number.parseInt(digits, 10);
  const next = Number.isNaN(parsed) ? 82 : Math.min(99, Math.max(0, parsed));
  return `+${next}`;
}

function CountryCodeField({
  id,
  value,
  disabled = false,
  onChange,
}: {
  id: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(digitsFromCountryCode(value) || "82");
  const selected = Number.parseInt(digitsFromCountryCode(toCountryCode(draft)), 10);

  useEffect(() => {
    setDraft(digitsFromCountryCode(value) || "82");
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedItem = listRef.current?.querySelector("[data-selected='true']");
    selectedItem?.scrollIntoView({ block: "center" });
  }, [open, selected]);

  function commit(next: number) {
    const code = `+${Math.min(99, Math.max(0, next))}`;
    setDraft(code.slice(1));
    onChange(code);
  }

  function handleTyped(raw: string) {
    const digits = digitsFromCountryCode(raw);
    setDraft(digits);

    if (digits) {
      onChange(toCountryCode(digits));
    }
  }

  return (
    <div ref={rootRef} className="relative w-[6.25rem] shrink-0">
      <div className={`${fieldClassName} flex items-center pr-1 pl-2`}>
        <span aria-hidden className="text-muted">
          +
        </span>
        <input
          id={id}
          name="countryCode"
          type="text"
          inputMode="numeric"
          autoComplete="tel-country-code"
          disabled={disabled}
          value={draft}
          placeholder="82"
          aria-label="국가번호"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className="min-w-0 flex-1 bg-transparent px-1 text-center tracking-wide outline-none"
          onFocus={() => setOpen(true)}
          onChange={(event) => handleTyped(event.target.value)}
          onBlur={() => {
            const next = toCountryCode(draft);
            setDraft(next.slice(1));
            onChange(next);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              commit(selected + 1);
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              commit(selected - 1);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label="국가번호 목록 열기"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setOpen((current) => !current)}
        >
          <ChevronIcon />
        </button>
      </div>
      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="국가번호"
          className="absolute top-[calc(100%+0.35rem)] left-0 z-30 max-h-52 w-full overflow-y-auto rounded-2xl border border-border bg-surface py-1 shadow-lg"
        >
          {COUNTRY_CODES.map((code) => {
            const isSelected = code === selected;

            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  data-selected={isSelected ? "true" : undefined}
                  aria-selected={isSelected}
                  className={`flex min-h-10 w-full items-center justify-center px-2 text-sm font-medium transition ${
                    isSelected
                      ? "bg-accent text-white"
                      : "text-foreground hover:bg-surface-muted"
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    commit(code);
                    setOpen(false);
                  }}
                >
                  +{code}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="size-4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneFields({
  id,
  countryCode,
  phone,
  disabled = false,
  bubble,
  inputRef,
  onCountryCodeChange,
  onPhoneChange,
}: PhoneFieldsProps) {
  const codeId = `${id}-code`;
  const numberId = `${id}-number`;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground">
        휴대폰 번호
        <span className="ml-0.5 text-accent">*</span>
      </p>
      {bubble}
      <div className="flex gap-2">
        <CountryCodeField
          id={codeId}
          value={countryCode}
          disabled={disabled}
          onChange={onCountryCodeChange}
        />
        <input
          id={numberId}
          ref={inputRef}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required
          disabled={disabled}
          value={phone}
          placeholder="10-1234-5678"
          aria-label="휴대폰 번호"
          aria-describedby={bubble ? `${id}-hint` : undefined}
          className={`${fieldClassName} min-w-0 flex-1 px-4`}
          onChange={(event) => onPhoneChange(event.target.value)}
        />
      </div>
    </div>
  );
}
