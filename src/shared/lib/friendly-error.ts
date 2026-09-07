const TECHNICAL_MESSAGE_PATTERN =
  /row-level security|rls policy|jwt expired|pgrst|postgrest|supabase|permission denied|violates|duplicate key|does not exist|undefined is not|cannot read propert|failed to fetch|failed to |missing environment|networkerror|invalid api key|authapierror|status code|syntax error|typeerror|referenceerror/i;

export const FRIENDLY_ERROR_FALLBACK =
  "잠시 문제가 생겼어요. 조금 뒤에 다시 시도해 주세요.";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message.trim();
  }

  return "";
}

export function toFriendlyErrorMessage(
  error: unknown,
  fallback = FRIENDLY_ERROR_FALLBACK,
) {
  const message = getErrorMessage(error);

  if (!message) {
    return fallback;
  }

  if (!/[가-힣]/.test(message) || TECHNICAL_MESSAGE_PATTERN.test(message)) {
    return fallback;
  }

  return message;
}

export function toFriendlyError(
  error: unknown,
  fallback = FRIENDLY_ERROR_FALLBACK,
) {
  return new Error(toFriendlyErrorMessage(error, fallback));
}
