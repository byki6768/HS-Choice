"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  getLogoSpectrum,
  msUntilNextHour,
  type LogoSpectrum,
} from "../model/logo-spectrum";

type LogoSpectrumFrameProps = {
  children: ReactNode;
};

export function LogoSpectrumFrame({ children }: LogoSpectrumFrameProps) {
  const [spectrum, setSpectrum] = useState<LogoSpectrum | null>(null);

  useEffect(() => {
    let timeoutId = 0;

    function applyNow() {
      setSpectrum(getLogoSpectrum());
    }

    function scheduleNext() {
      timeoutId = window.setTimeout(() => {
        applyNow();
        scheduleNext();
      }, msUntilNextHour());
    }

    applyNow();
    scheduleNext();

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        applyNow();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const overlayStyle: CSSProperties | undefined = spectrum
    ? { backgroundImage: spectrum.overlay }
    : undefined;
  const sheenStyle: CSSProperties | undefined = spectrum
    ? { backgroundImage: spectrum.sheen }
    : undefined;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-white" aria-hidden />
      <div
        aria-hidden
        className="logo-spectrum-shift absolute inset-0 transition-[background-image] duration-1000"
        style={overlayStyle}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={sheenStyle}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
