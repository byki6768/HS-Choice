import { syncProfileFromAuthUser, updateNickname } from "@/entities/user";
import { createBrowserClient } from "@/shared/api";
import { routes } from "@/shared/config";
import { toFriendlyError } from "@/shared/lib";
import { useAuthStore } from "../model/store";
import {
  AUTH_MESSAGES,
  nationalPhoneDigits,
  phoneAuthEmails,
  phoneToAuthEmail,
  type EmailAuthPayload,
  type EmailLoginPayload,
  type GoogleAuthIntent,
  type PhoneAuthPayload,
  type PhoneLoginPayload,
} from "../model/types";
import {
  validateEmail,
  validatePassword,
  validatePasswordPair,
  validatePhone,
} from "../model/validate";

const AUTH_NEXT_COOKIE = "hs-choice-auth-next";
const AUTH_INTENT_COOKIE = "hs-choice-auth-intent";

function toSafeNextPath(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : routes.home;
}

function setAuthCookie(name: string, value: string, maxAge = 600) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export async function signInWithGoogle(
  next: string = routes.home,
  intent: GoogleAuthIntent = "login",
) {
  const supabase = createBrowserClient();
  const safeNext = toSafeNextPath(next);

  setAuthCookie(AUTH_NEXT_COOKIE, safeNext);
  setAuthCookie(AUTH_INTENT_COOKIE, intent);

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL(routes.authCallback, window.location.origin).toString(),
    },
  });
}

export async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  useAuthStore.getState().clear();
  return { error };
}

export async function syncSession() {
  const supabase = createBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    useAuthStore.getState().clear();
    return null;
  }

  const user = await syncProfileFromAuthUser(session.user);
  useAuthStore.getState().setUser(user);
  return user;
}

export async function saveNickname(nickname: string) {
  const currentUser = useAuthStore.getState().user;

  if (!currentUser) {
    throw new Error("로그인이 필요해요. 다시 로그인해 주세요.");
  }

  const profile = await updateNickname(currentUser.id, nickname);
  useAuthStore.getState().setNickname(profile.nickname ?? nickname.trim());
  return profile.nickname;
}

function isAlreadyRegisteredError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("user already exists")
  );
}

async function accountExists(identifier: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc("auth_account_exists", {
    identifier,
  });

  if (error) {
    return null;
  }

  return Boolean(data);
}

async function findExistingPhoneEmail(phone: string) {
  for (const email of phoneAuthEmails(phone)) {
    if ((await accountExists(email)) === true) {
      return email;
    }
  }

  return null;
}

async function signInWithPasswordAccount(email: string, password: string) {
  const exists = await accountExists(email);

  if (exists === false) {
    throw new Error(AUTH_MESSAGES.notFound);
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data.session) {
    await syncSession();
    return data;
  }

  if (error && /email not confirmed/i.test(error.message)) {
    throw new Error("로그인하지 못했어요. 다시 시도해 주세요.");
  }

  if (exists === true || /invalid login credentials/i.test(error?.message ?? "")) {
    throw new Error(AUTH_MESSAGES.wrongPassword);
  }

  throw new Error(AUTH_MESSAGES.notFound);
}

async function signUpWithPasswordAccount(input: {
  email: string;
  password: string;
  metadata?: Record<string, string>;
}) {
  const exists = await accountExists(input.email);

  if (exists === true) {
    throw new Error(AUTH_MESSAGES.alreadyRegistered);
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        signed_up: true,
        ...input.metadata,
      },
    },
  });

  if (error) {
    if (isAlreadyRegisteredError(error.message)) {
      throw new Error(AUTH_MESSAGES.alreadyRegistered);
    }

    throw new Error("계정 정보를 저장하지 못했어요. 다시 시도해 주세요.");
  }

  if ((data.user?.identities?.length ?? 0) === 0) {
    throw new Error(AUTH_MESSAGES.alreadyRegistered);
  }

  if (data.session) {
    await syncSession();
    return data;
  }

  const signedIn = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (signedIn.data.session) {
    await syncSession();
    return signedIn.data;
  }

  throw new Error("계정을 저장하지 못했어요. 다시 시도해 주세요.");
}

export async function signInWithEmail(payload: EmailLoginPayload) {
  const email = payload.email.trim().toLowerCase();
  const emailError = validateEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  const passwordError = validatePassword(payload.password);
  if (passwordError) {
    throw new Error(passwordError);
  }

  return signInWithPasswordAccount(email, payload.password);
}

export async function signInWithPhone(payload: PhoneLoginPayload) {
  const phoneError = validatePhone(payload.phone);
  if (phoneError) {
    throw new Error(phoneError);
  }

  const passwordError = validatePassword(payload.password);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const existingEmail = await findExistingPhoneEmail(payload.phone);

  if (!existingEmail) {
    throw new Error(AUTH_MESSAGES.notFound);
  }

  return signInWithPasswordAccount(existingEmail, payload.password);
}

export async function signUpWithEmail(payload: EmailAuthPayload) {
  const email = payload.email.trim().toLowerCase();
  const emailError = validateEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  const passwordError = validatePasswordPair(
    payload.password,
    payload.passwordConfirm,
  );
  if (passwordError) {
    throw new Error(passwordError);
  }

  return signUpWithPasswordAccount({
    email,
    password: payload.password,
    metadata: { login_method: "email" },
  });
}

export async function signUpWithPhone(payload: PhoneAuthPayload) {
  const phoneError = validatePhone(payload.phone);
  if (phoneError) {
    throw new Error(phoneError);
  }

  const passwordError = validatePasswordPair(
    payload.password,
    payload.passwordConfirm,
  );
  if (passwordError) {
    throw new Error(passwordError);
  }

  if (await findExistingPhoneEmail(payload.phone)) {
    throw new Error(AUTH_MESSAGES.alreadyRegistered);
  }

  const digits = nationalPhoneDigits(payload.phone);
  const countryCode = payload.countryCode?.trim() || "+82";

  return signUpWithPasswordAccount({
    email: phoneToAuthEmail(digits),
    password: payload.password,
    metadata: {
      login_method: "phone",
      phone: digits,
      country_code: countryCode,
    },
  });
}

export async function deleteAccount() {
  const supabase = createBrowserClient();
  const { error } = await supabase.rpc("delete_own_account");

  if (error) {
    throw toFriendlyError(
      error,
      "회원 탈퇴를 완료하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  await supabase.auth.signOut();
  useAuthStore.getState().clear();
}
