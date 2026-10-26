// Shared newsletter subscription state and API handling for blog signup forms.
import { useState, type FormEvent } from "react";
import { cmsApiBase } from "./cmsApi";

type Status = "idle" | "error" | "done";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readCsrfToken(): string {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="))
    ?.slice("XSRF-TOKEN=".length);
  return cookie ? decodeURIComponent(cookie) : "";
}

export function useNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (value: string) => {
    setEmail(value);
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage("");
    setBusy(true);

    try {
      if (!cmsApiBase) {
        throw new Error("Newsletter subscriptions are not configured right now. Please try again later.");
      }

      if (!readCsrfToken()) {
        const csrfUrl = `${new URL(cmsApiBase, window.location.origin).origin}/sanctum/csrf-cookie`;
        const csrfResponse = await fetch(csrfUrl, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!csrfResponse.ok) {
          throw new Error(`Could not start a secure subscription session (HTTP ${csrfResponse.status}). Please try again.`);
        }
      }

      const csrfToken = readCsrfToken();
      const response = await fetch(`${cmsApiBase}/newsletter-subscriptions`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const errors = isRecord(payload) && isRecord(payload.errors) ? payload.errors : null;
        const emailErrors = errors?.email;
        const validationMessage = Array.isArray(emailErrors) && typeof emailErrors[0] === "string"
          ? emailErrors[0]
          : "";
        const responseMessage = isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : "";
        throw new Error(validationMessage || responseMessage || `Could not subscribe (HTTP ${response.status}). Please try again.`);
      }

      setStatus("done");
      setMessage(
        isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : "Thanks for subscribing to our newsletter."
      );
      setEmail("");
    } catch (cause) {
      setStatus("error");
      setMessage(cause instanceof Error ? cause.message : "Could not subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return { email, status, message, busy, onChange, submit };
}
