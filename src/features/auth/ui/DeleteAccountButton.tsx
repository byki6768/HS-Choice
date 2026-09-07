"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { routes } from "@/shared/config";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { deleteAccount } from "../api";

export function DeleteAccountButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm("정말 탈퇴할까요?");

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await deleteAccount();
      router.replace(routes.home);
      router.refresh();
    } catch (deleteError) {
      setError(
        toFriendlyErrorMessage(
          deleteError,
          "회원 탈퇴를 완료하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        variant="danger"
        loading={isSubmitting}
        onClick={handleDelete}
      >
        {isSubmitting ? "탈퇴 처리 중..." : "회원 탈퇴"}
      </Button>
    </div>
  );
}
