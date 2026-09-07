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
    return "비밀번호 확인이 일치하지 않아요.";
  }

  return null;
}

export function validateEmail(email: string) {
  if (!email.trim()) {
    return "이메일을 입력해 주세요.";
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return "올바른 이메일 주소를 입력해 주세요.";
  }

  return null;
}

export function validatePhone(phone: string) {
  const digits = digitsOnlyPhone(phone);

  if (!digits) {
    return "휴대폰 번호를 입력해 주세요.";
  }

  if (digits.length !== 10) {
    return "휴대폰 번호 10자리를 입력해 주세요.";
  }

  return null;
}
