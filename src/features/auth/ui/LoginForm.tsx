"use client";

import { FormEvent, useRef, useState } from "react";
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
import { AuthFeedback } from "./AuthFeedback";
import { PasswordField } from "./PasswordField";
import { PhoneFields } from "./PhoneFields";
import { SpeechBubble } from "./SpeechBubble";

type AuthStep = "menu" | "login" | "signup";
type AuthMethod = "google" | "email" | "phone";

type LoginFormProps = {
  mode?: string | null;
};

function parseAuthStep(mode?: string | null): AuthStep {
  return mode === "login" || mode === "signup" ? mode : "menu";
}

export function LoginForm({ mode }: LoginFormProps) {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const step = parseAuthStep(mode);
  const [method, setMethod] = useState<AuthMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordBubble, setPasswordBubble] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+82");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function goTo(nextStep: AuthStep) {
    if (nextStep === "menu") {
      router.push(routes.login);
      return;
    }

    router.push(`${routes.login}?mode=${nextStep}`);
  }

  function toggleMethod(nextMethod: AuthMethod) {
    setError(null);
    setPassword("");
    setPasswordConfirm("");
    setPasswordBubble(false);
    setAlreadyRegistered(false);
    setCountryCode("+82");
    setMethod((current) => (current === nextMethod ? null : nextMethod));
  }

  function changePassword(value: string) {
    setPassword(value);
    setPasswordBubble(value.length > 0 && value.length < 6);
  }

  async function handleGoogle(intent: "login" | "signup") {
    setError(null);
    setIsSubmitting(true);
    setMethod("google");

    const { error: googleError } = await signInWithGoogle(routes.home, intent);

    if (googleError) {
      setError(
        intent === "login"
          ? "Google 로그인에 실패했어요. 다시 시도해 주세요."
          : "Google 가입에 실패했어요. 다시 시도해 주세요.",
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
    setError(null);
    setAlreadyRegistered(false);

    if (password.length < 6) {
      setPasswordBubble(true);
      window.requestAnimationFrame(() => {
        passwordRef.current?.focus();
      });
      return;
    }

    setPasswordBubble(false);
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

      if (message === AUTH_MESSAGES.passwordTooShort) {
        setPasswordBubble(true);
        window.requestAnimationFrame(() => {
          passwordRef.current?.focus();
        });
        return;
      }

      if (message === AUTH_MESSAGES.alreadyRegistered) {
        setAlreadyRegistered(true);
        return;
      }

      setError(message);

      if (message === AUTH_MESSAGES.wrongPassword) {
        window.requestAnimationFrame(() => {
          passwordRef.current?.focus();
          passwordRef.current?.select();
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {welcome ? <AuthFeedback message={AUTH_MESSAGES.welcome} /> : null}
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      ) : null}

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
          <Button
            type="button"
            loading={isSubmitting && method === "google"}
            disabled={isSubmitting}
            onClick={() => void handleGoogle("login")}
          >
            {isSubmitting && method === "google" ? "이동 중..." : "Google 로그인"}
          </Button>
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
                label="이메일"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                disabled={isSubmitting}
                placeholder="name@example.com"
                onChange={(event) => setEmail(event.target.value)}
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
                bubble={
                  passwordBubble ? AUTH_MESSAGES.passwordTooShort : undefined
                }
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
                onCountryCodeChange={setCountryCode}
                onPhoneChange={setPhone}
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
                bubble={
                  passwordBubble ? AUTH_MESSAGES.passwordTooShort : undefined
                }
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
          <Button
            type="button"
            loading={isSubmitting && method === "google"}
            disabled={isSubmitting}
            onClick={() => void handleGoogle("signup")}
          >
            {isSubmitting && method === "google"
              ? "이동 중..."
              : "Google 로그인 가입"}
          </Button>
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
                label="이메일"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                disabled={isSubmitting}
                placeholder="name@example.com"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setAlreadyRegistered(false);
                }}
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
                bubble={
                  passwordBubble ? AUTH_MESSAGES.passwordTooShort : undefined
                }
                onChange={(event) => changePassword(event.target.value)}
              />
              <PasswordField
                id="signup-email-password-confirm"
                label="비밀번호 확인"
                name="passwordConfirm"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                disabled={isSubmitting}
                placeholder="**********"
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
              {alreadyRegistered ? (
                <SpeechBubble message={AUTH_MESSAGES.alreadyRegistered} />
              ) : null}
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
                onCountryCodeChange={(value) => {
                  setCountryCode(value);
                  setAlreadyRegistered(false);
                }}
                onPhoneChange={(value) => {
                  setPhone(value);
                  setAlreadyRegistered(false);
                }}
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
                bubble={
                  passwordBubble ? AUTH_MESSAGES.passwordTooShort : undefined
                }
                onChange={(event) => changePassword(event.target.value)}
              />
              <PasswordField
                id="signup-phone-password-confirm"
                label="비밀번호 확인"
                name="passwordConfirm"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                disabled={isSubmitting}
                placeholder="**********"
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
              {alreadyRegistered ? (
                <SpeechBubble message={AUTH_MESSAGES.alreadyRegistered} />
              ) : null}
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
