
"use client";
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export async function getRecaptchaToken(
  action: string = "global_action"
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) return reject("grecaptcha not loaded");

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LdLof0rAAAAAFQvsu9MZvuOdXIK3qCRXpgs_J-n", { action })
        .then(resolve)
        .catch(reject);
    });
  });
}
