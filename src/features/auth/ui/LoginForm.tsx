"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/shared/ui";
import { routes } from "@/shared/config";
import { toFriendlyErrorMessage } from "@/shared/lib";
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithPhone,
  signUpWithEmail,
  signUpWithPhone,
} from "../api";
import { AUTH_MESSAGES } from "../model/types";
import { validateEmail, validatePhone } from "../model/validate";
import { AuthFeedback } from "./AuthFeedback";
import { PasswordField } from "./PasswordField";
import { PhoneFields } from "./PhoneFields";
import { SpeechBubble } from "./SpeechBubble";

type AuthStep = "menu" | "login" | "signup";
type AuthMethod = "google" | "email" | "phone";

type LoginFormProps = {
  mode?: string | null;
  initialError?: string | null;
};

function parseAuthStep(mode?: string | null): AuthStep {
  return mode === "login" || mode === "signup" ? mode : "menu";
}

export function LoginForm({ mode, initialError }: LoginFormProps) {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const step = parseAuthStep(mode);
  const [method, setMethod] = useState<AuthMethod | null>(
    initialError === "not_member" ? "email" : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [idMessage, setIdMessage] = useState<string | null>(
    initialError === "not_member" ? AUTH_MESSAGES.notFound : null,
  );
  const [googleMessage, setGoogleMessage] = useState<string | null>(
    initialError === "auth" ? AUTH_MESSAGES.authFailed : null,
  );
  const [welcome, setWelcome] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+82");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function goTo(nextStep: AuthStep) {
    clearFieldMessages();

    if (nextStep === "menu") {
      router.push(routes.login);
      return;
    }

    router.push(`${routes.login}?mode=${nextStep}`);
  }

  function clearFieldMessages() {
    setPasswordTooShort(false);
    setPasswordMismatch(false);
    setWrongPassword(false);
    setIdMessage(null);
    setGoogleMessage(null);
  }

  useEffect(() => {
    function dismissOnNavigate(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      if (target.closest("form")) {
        return;
      }

      if (!target.closest("a, button")) {
        return;
      }

      clearFieldMessages();
    }

    document.addEventListener("pointerdown", dismissOnNavigate, true);
    return () => {
      document.removeEventListener("pointerdown", dismissOnNavigate, true);
    };
  }, []);

  function toggleMethod(nextMethod: AuthMethod) {
    setPassword("");
    setPasswordConfirm("");
    clearFieldMessages();
    setCountryCode("+82");
    setMethod((current) => (current === nextMethod ? null : nextMethod));
  }

  function changeEmail(value: string) {
    setEmail(value);
    setIdMessage(
      value.trim().length > 0 && Boolean(validateEmail(value))
        ? AUTH_MESSAGES.emailInvalid
        : null,
    );
  }

  function changePhone(value: string) {
    setPhone(value);
    setIdMessage(null);
  }

  function changePassword(value: string) {
    setPassword(value);
    setWrongPassword(false);
    const tooShort = value.length > 0 && value.length < 6;
    setPasswordTooShort(tooShort);

    if (tooShort) {
      setPasswordMismatch(false);
      return;
    }

    if (passwordConfirm.length > 0) {
      setPasswordMismatch(value !== passwordConfirm);
    }
  }

  function changePasswordConfirm(value: string) {
    setPasswordConfirm(value);

    if (password.length < 6) {
      setPasswordMismatch(false);
      return;
    }

    setPasswordMismatch(value.length > 0 && value !== password);
  }

  function passwordFieldBubble() {
    if (passwordTooShort) {
      return AUTH_MESSAGES.passwordTooShort;
    }

    if (wrongPassword) {
      return AUTH_MESSAGES.wrongPassword;
    }

    return undefined;
  }

  function confirmFieldBubble() {
    if (passwordMismatch) {
      return AUTH_MESSAGES.passwordMismatch;
    }

    return undefined;
  }

  function identifierBubble(inputId: string) {
    if (!idMessage) {
      return undefined;
    }

    return <SpeechBubble id={`${inputId}-hint`} message={idMessage} />;
  }

  function focusIdField() {
    window.requestAnimationFrame(() => {
      if (method === "phone") {
        phoneRef.current?.focus();
        return;
      }

      emailRef.current?.focus();
    });
  }

  async function handleGoogle(intent: "login" | "signup") {
    clearFieldMessages();
    setIsSubmitting(true);
    setMethod("google");

    const { error: googleError } = await signInWithGoogle(routes.home, intent);

    if (googleError) {
      setGoogleMessage(
        intent === "login"
          ? AUTH_MESSAGES.googleLoginFailed
          : AUTH_MESSAGES.googleSignupFailed,
      );
      setIsSubmitting(false);
    }
  }

  function showWelcomeAndGoHome() {
    setWelcome(true);
    window.setTimeout(() => {
      router.replace(routes.home);
      router.refresh();
    }, 1200);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGoogleMessage(null);

    if (method === "email") {
      const emailError = validateEmail(email);
      if (emailError) {
        setIdMessage(emailError);
        focusIdField();
        return;
      }
    }

    if (method === "phone") {
      const phoneError = validatePhone(phone);
      if (phoneError) {
        setIdMessage(phoneError);
        focusIdField();
        return;
      }
    }

    setIdMessage(null);

    if (password.length < 6) {
      setPasswordTooShort(true);
      setPasswordMismatch(false);
      setWrongPassword(false);
      window.requestAnimationFrame(() => {
        passwordRef.current?.focus();
      });
      return;
    }

    if (step === "signup" && password !== passwordConfirm) {
      setPasswordTooShort(false);
      setWrongPassword(false);
      setPasswordMismatch(true);
      window.requestAnimationFrame(() => {
        passwordConfirmRef.current?.focus();
      });
      return;
    }

    setPasswordTooShort(false);
    setPasswordMismatch(false);
    setWrongPassword(false);
    setIsSubmitting(true);

    try {
      if (step === "signup" && method === "email") {
        await signUpWithEmail({ email, password, passwordConfirm });
        router.replace(routes.home);
        router.refresh();
        return;
      }

      if (step === "signup" && method === "phone") {
        await signUpWithPhone({
          phone,
          password,
          passwordConfirm,
          countryCode,
        });
        router.replace(routes.home);
        router.refresh();
        return;
      }

      if (step === "login" && method === "email") {
        await signInWithEmail({ email, password });
        showWelcomeAndGoHome();
        return;
      }

      if (step === "login" && method === "phone") {
        await signInWithPhone({ phone, password });
        showWelcomeAndGoHome();
        return;
      }
    } catch (submitError) {
      const message = toFriendlyErrorMessage(
        submitError,
        "요청을 처리하지 못했어요. 다시 시도해 주세요.",
      );
      setIsSubmitting(false);

      if (
        message === AUTH_MESSAGES.emailInvalid ||
        message === AUTH_MESSAGES.phoneRequired ||
        message === AUTH_MESSAGES.phoneInvalid ||
        message === AUTH_MESSAGES.notFound ||
        message === AUTH_MESSAGES.alreadyRegistered
      ) {
        setIdMessage(message);
        focusIdField();
        return;
      }

      if (message === AUTH_MESSAGES.passwordTooShort) {
        setPasswordTooShort(true);
        setPasswordMismatch(false);
        setWrongPassword(false);
        window.requestAnimationFrame(() => {
          passwordRef.current?.focus();
        });
        return;
      }

      if (message === AUTH_MESSAGES.wrongPassword) {
        setPasswordTooShort(false);
        setPasswordMismatch(false);
        setWrongPassword(true);
        window.requestAnimationFrame(() => {
          passwordRef.current?.focus();
          passwordRef.current?.select();
        });
        return;
      }

      if (message === AUTH_MESSAGES.passwordMismatch) {
        setPasswordTooShort(false);
        setWrongPassword(false);
        setPasswordMismatch(true);
        window.requestAnimationFrame(() => {
          passwordConfirmRef.current?.focus();
        });
        return;
      }

      setIdMessage(message);
      focusIdField();
    }
  }

  function googleButton(intent: "login" | "signup") {
    const label =
      intent === "login"
        ? isSubmitting && method === "google"
          ? "이동 중..."
          : "Google 로그인"
        : isSubmitting && method === "google"
          ? "이동 중..."
          : "Google 로그인 가입";

    return (
      <div className="flex flex-col gap-1">
        {googleMessage ? <SpeechBubble message={googleMessage} /> : null}
        <Button
          type="button"
          loading={isSubmitting && method === "google"}
          disabled={isSubmitting}
          onClick={() => void handleGoogle(intent)}
        >
          {label}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {welcome ? <AuthFeedback message={AUTH_MESSAGES.welcome} /> : null}

      {step !== "menu" ? (
        <button
          type="button"
          onClick={() => goTo("menu")}
          disabled={isSubmitting}
          className="mb-1 inline-flex min-h-11 items-center self-start text-sm font-medium text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          이전으로
        </button>
      ) : null}

      {step === "menu" ? (
        <>
          <Button type="button" onClick={() => goTo("login")}>
            로그인
          </Button>
          <Button type="button" variant="secondary" onClick={() => goTo("signup")}>
            신규 가입
          </Button>
        </>
      ) : null}

      {step === "login" ? (
        <>
          {googleButton("login")}
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => toggleMethod("email")}
            aria-expanded={method === "email"}
          >
            E-Mail 로그인
          </Button>
          {method === "email" ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 sm:p-4"
            >
              <Input
                id="login-email"
                ref={emailRef}
                label="이메일"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                disabled={isSubmitting}
                placeholder="name@example.com"
                bubble={identifierBubble("login-email")}
                onChange={(event) => changeEmail(event.target.value)}
              />
              <PasswordField
                id="login-email-password"
                ref={passwordRef}
                label="비밀번호"
                name="password"
                required
                value={password}
                disabled={isSubmitting}
                placeholder="**********"
                bubble={passwordFieldBubble()}
                onChange={(event) => changePassword(event.target.value)}
              />
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "처리 중..." : "로그인"}
              </Button>
            </form>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => toggleMethod("phone")}
            aria-expanded={method === "phone"}
          >
            휴대폰번호 로그인
          </Button>
          {method === "phone" ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 sm:p-4"
            >
              <PhoneFields
                id="login-phone"
                countryCode={countryCode}
                phone={phone}
                disabled={isSubmitting}
                inputRef={phoneRef}
                bubble={identifierBubble("login-phone")}
                onCountryCodeChange={setCountryCode}
                onPhoneChange={changePhone}
              />
              <PasswordField
                id="login-phone-password"
                ref={passwordRef}
                label="비밀번호"
                name="password"
                required
                value={password}
                disabled={isSubmitting}
                placeholder="**********"
                bubble={passwordFieldBubble()}
                onChange={(event) => changePassword(event.target.value)}
              />
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "처리 중..." : "로그인"}
              </Button>
            </form>
          ) : null}
        </>
      ) : null}

      {step === "signup" ? (
        <>
          {googleButton("signup")}
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => toggleMethod("email")}
            aria-expanded={method === "email"}
          >
            E-Mail로 가입하기
          </Button>
          {method === "email" ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 sm:p-4"
            >
              <Input
                id="signup-email"
                ref={emailRef}
                label="이메일"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                disabled={isSubmitting}
                placeholder="name@example.com"
                bubble={identifierBubble("signup-email")}
                onChange={(event) => changeEmail(event.target.value)}
              />
              <p className="-mt-1 text-xs leading-5 text-muted">
                인증 없이 로그인 아이디로만 저장합니다.
              </p>
              <PasswordField
                id="signup-email-password"
                ref={passwordRef}
                label="비밀번호"
                name="password"
                autoComplete="new-password"
                required
                value={password}
                disabled={isSubmitting}
                placeholder="**********"
                bubble={passwordFieldBubble()}
                onChange={(event) => changePassword(event.target.value)}
              />
              <PasswordField
                id="signup-email-password-confirm"
                ref={passwordConfirmRef}
                label="비밀번호 확인"
                name="passwordConfirm"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                disabled={isSubmitting}
                placeholder="**********"
                bubble={confirmFieldBubble()}
                onChange={(event) => changePasswordConfirm(event.target.value)}
              />
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "처리 중..." : "가입하기"}
              </Button>
            </form>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => toggleMethod("phone")}
            aria-expanded={method === "phone"}
          >
            휴대폰번호로 가입하기
          </Button>
          {method === "phone" ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 sm:p-4"
            >
              <PhoneFields
                id="signup-phone"
                countryCode={countryCode}
                phone={phone}
                disabled={isSubmitting}
                inputRef={phoneRef}
                bubble={identifierBubble("signup-phone")}
                onCountryCodeChange={(value) => {
                  setCountryCode(value);
                  setIdMessage(null);
                }}
                onPhoneChange={changePhone}
              />
              <p className="-mt-1 text-xs leading-5 text-muted">
                인증 없이 로그인 아이디로만 저장합니다.
              </p>
              <PasswordField
                id="signup-phone-password"
                ref={passwordRef}
                label="비밀번호"
                name="password"
                autoComplete="new-password"
                required
                value={password}
                disabled={isSubmitting}
                placeholder="**********"
                bubble={passwordFieldBubble()}
                onChange={(event) => changePassword(event.target.value)}
              />
              <PasswordField
                id="signup-phone-password-confirm"
                ref={passwordConfirmRef}
                label="비밀번호 확인"
                name="passwordConfirm"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                disabled={isSubmitting}
                placeholder="**********"
                bubble={confirmFieldBubble()}
                onChange={(event) => changePasswordConfirm(event.target.value)}
              />
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "처리 중..." : "가입하기"}
              </Button>
            </form>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
