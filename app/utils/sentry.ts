import * as Sentry from "@sentry/remix";
import { BrowserTracing } from "@sentry/tracing";

const isBrowser = typeof window !== "undefined";

const isCorrectEnv =
  ["production", "staging", "dev"].includes(ENV.ENVIRONMENT) &&
  isBrowser &&
  window.location.hostname !== "localhost";

export function sendToSentry(e: any) {
  if (isCorrectEnv) Sentry.captureException(e);
}

export function initSentry() {
  if (isCorrectEnv)
    Sentry.init({
      dsn: ENV.SENTRY_KEY,
      integrations: [new BrowserTracing()],
      environment: ENV.ENVIRONMENT,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
}
