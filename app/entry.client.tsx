import * as React from "react";
import { parse as cookieParse } from "cookie";
import { ApolloProvider } from "@apollo/client";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

import { initApollo } from "~/contexts/apollo";
import { initSentry } from "~/utils/sentry";

initSentry();

function hydrate() {
  const cookie = cookieParse(document.cookie);
  const token = cookie?.token;

  const client = initApollo(token, false);

  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <ApolloProvider client={client}>
          <RemixBrowser />
        </ApolloProvider>
      </React.StrictMode>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
