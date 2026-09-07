"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

export function ImageUploadField({
  label,
  file,
  onChange,
  disabled = false,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejectMessage, setRejectMessage] = useState<string | null>(null);
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function applyFile(nextFile: File | undefined) {
    if (!nextFile) {
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setRejectMessage("이미지 파일만 업로드할 수 있어요.");
      return;
    }

    setRejectMessage(null);
    onChange(nextFile);
  }

  function handleSelect(files: FileList | null) {
    applyFile(files?.[0]);
    resetInput();
  }

  function handleDelete() {
    setRejectMessage(null);
    onChange(null);
    resetInput();
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted">선택 사항 · 드래그 앤 드롭 또는 클릭</p>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => handleSelect(event.target.files)}
      />

      {file && previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="relative aspect-[16/10] bg-surface-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`${label} 미리보기`}
              className="size-full object-cover"
            />
          </div>
          <div className="flex gap-2 p-3">
            <button
              type="button"
              disabled={disabled}
              onClick={openFileDialog}
              className="min-h-12 flex-1 rounded-xl border border-border px-3 text-sm font-medium text-foreground transition touch-manipulation hover:bg-surface-muted disabled:opacity-60"
            >
              교체
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleDelete}
              className="min-h-12 flex-1 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600 transition touch-manipulation hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={openFileDialog}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!disabled) {
              setIsDragging(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) {
              setIsDragging(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (!disabled) {
              handleSelect(event.dataTransfer.files);
            }
          }}
          className={`flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-44 ${
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border bg-background hover:border-foreground/30 hover:bg-surface-muted/60"
          }`}
        >
          <span className="text-sm font-medium text-foreground">
            이미지를 놓거나 클릭해서 업로드
          </span>
          <span className="mt-1 text-xs text-muted">JPG, PNG, WEBP</span>
        </button>
      )}

      {rejectMessage ? (
        <p className="text-sm text-red-600 dark:text-red-400">{rejectMessage}</p>
      ) : null}
    </div>
  );
}
