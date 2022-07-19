import React from "react";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { Box, Typography } from "@mui/material";

const isCorrectEnv = ["production", "staging", "dev"].includes(process.env.REACT_APP_ENVIRONMENT) && window.location.hostname !== "localhost";

export function sendToSentry(e) {
  if (isCorrectEnv) Sentry.captureException(e);
}

export function initializeSentry() {
  if (isCorrectEnv) Sentry.init(
    {
      dsn: process.env.REACT_APP_SENTRY_KEY,
      integrations: [new BrowserTracing()],
      environment: process.env.REACT_APP_ENVIRONMENT,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    }
  );
}

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    margin: "10em",
  },
};

function ErrBoundary() {
  return (
    <Box sx={styles.center}>
      <Typography variant="h1">Something went wrong.</Typography>
    </Box>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrBoundary/>;
    }

    return this.props.children;
  }
}

export function SentryErrorBoundaryWithFallback({children}) {
  if (isCorrectEnv) {
    return (
      <Sentry.ErrorBoundary fallback={ErrBoundary}>
        {children}
      </Sentry.ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  }
}