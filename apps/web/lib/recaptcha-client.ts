"use client";

// Client helper for reCAPTCHA Enterprise. Executes the site key for a given
// action and returns a token, then our /api/auth/recaptcha route assesses it.
declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      };
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

// Resolve once the enterprise script has loaded and grecaptcha is ready.
function ready(): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.grecaptcha?.enterprise) {
        window.grecaptcha.enterprise.ready(() => resolve());
      } else if (Date.now() - start > 10_000) {
        reject(new Error("reCAPTCHA failed to load"));
      } else {
        setTimeout(tick, 100);
      }
    };
    tick();
  });
}

// Get a fresh token for an action ("LOGIN" | "SIGNUP"). Tokens are single-use.
export async function getRecaptchaToken(action: string): Promise<string> {
  if (!SITE_KEY) throw new Error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  await ready();
  return window.grecaptcha!.enterprise.execute(SITE_KEY, { action });
}
