import { AUTH_MESSAGES, digitsOnlyPhone } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePassword(password: string) {
  if (!password) {
    return "비밀번호를 입력해 주세요.";
  }

  if (password.length < 6) {
    return AUTH_MESSAGES.passwordTooShort;
  }

  return null;
}

export function validatePasswordPair(password: string, passwordConfirm: string) {
  const passwordError = validatePassword(password);

  if (passwordError) {
    return passwordError;
  }

  if (password !== passwordConfirm) {
    return AUTH_MESSAGES.passwordMismatch;
  }

  return null;
}

export function validateEmail(email: string) {
  if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
    return AUTH_MESSAGES.emailInvalid;
  }

  return null;
}

export function validatePhone(phone: string) {
  const digits = digitsOnlyPhone(phone);

  if (!digits) {
    return AUTH_MESSAGES.phoneRequired;
  }

  if (digits.length !== 10) {
    return AUTH_MESSAGES.phoneInvalid;
  }

  return null;
}
