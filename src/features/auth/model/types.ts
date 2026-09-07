export type AuthCredentials = {
  email: string;
  password: string;
};

export type EmailAuthPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type PhoneAuthPayload = {
  phone: string;
  password: string;
  passwordConfirm: string;
  countryCode?: string;
};

export type EmailLoginPayload = {
  email: string;
  password: string;
};

export type PhoneLoginPayload = {
  phone: string;
  password: string;
};

export type GoogleAuthIntent = "login" | "signup";

export const PHONE_EMAIL_DOMAIN = "phone.hs-choice.app";

export const AUTH_MESSAGES = {
  welcome: "다시 만나 반가워요!",
  notFound: "없는 아이디입니다. 회원이 아니시면 신규 가입으로 가세요",
  wrongPassword: "틀린 비밀 번호입니다, 다시 확인하여 주세요",
  alreadyRegistered: "이미 가입된 회원입니다",
  passwordTooShort: "비밀번호는 6자 이상이어야 해요.",
} as const;

export function digitsOnlyPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function nationalPhoneDigits(phone: string) {
  const digits = digitsOnlyPhone(phone);

  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits;
}

export function phoneToAuthEmail(phone: string) {
  return `${nationalPhoneDigits(phone)}@${PHONE_EMAIL_DOMAIN}`;
}

export function phoneAuthEmails(phone: string) {
  const national = nationalPhoneDigits(phone);
  const emails = [phoneToAuthEmail(national)];

  if (national.length === 10) {
    emails.push(`0${national}@${PHONE_EMAIL_DOMAIN}`);
  }

  return [...new Set(emails)];
}

export function isPhoneAuthEmail(email: string | null | undefined) {
  return Boolean(email?.endsWith(`@${PHONE_EMAIL_DOMAIN}`));
}

export function phoneFromAuthEmail(email: string | null | undefined) {
  if (!isPhoneAuthEmail(email) || !email) {
    return null;
  }

  return email.slice(0, -`@${PHONE_EMAIL_DOMAIN}`.length);
}
