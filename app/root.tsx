import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { parse as cookieParse } from "cookie";
import { withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { withSentry } from "@sentry/remix";

import type { ENV } from "~/env.server";
import { getEnv } from "~/env.server";
import ApolloContext from "~/contexts/apollo";
import { AppProvider } from "~/contexts/app";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { wagmiClient, chains } from "~/utils/rainbow";
import { getSession } from "~/sessions.server";
import theme from "~/theme";
import clientStyleContext from "~/contexts/clientStyleContext";

import rainbowStylesUrl from "@rainbow-me/rainbowkit/styles.css";
import appStylesUrl from "~/app.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: rainbowStylesUrl },
    { rel: "stylesheet", href: appStylesUrl },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Space+Mono&family=DM+Serif+Display&display=swap",
    },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "icon", href: "/192.png", type: "image/png", sizes: "192x192" },
    { rel: "apple-touch-icon", href: "/192.png" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Supertrue",
  viewport: "width=device-width,initial-scale=1",
  description: "Supertrue - Follow your favorite artists via NFTs",
  "twitter:site": "@supertruesocial",
  "og:title": "Supertrue - Follow your favorite artists via NFTs",
  "og:type": "website",
  "og:description":
    "Get rewarded for believing in and following creators early. Receive a dated and numbered NFT for any profile you mint.",
  "og:site_name": "Supertrue",
  "og:image": "/og.jpg",
  "emotion-insertion-point": "emotion-insertion-point",
  "theme-color": theme.palette.primary.main,
});

type LoaderData = {
  address?: string;
  ENV: ENV;
};

export const loader: LoaderFunction = async ({ request }) => {
  const ENV = getEnv();

  const cookie = cookieParse(request.headers.get("Cookie") || "");
  const token = cookie?.token_api;

  const session = await getSession(request.headers.get("Cookie"));

  if (
    session.has("token_api") &&
    session.has("address") &&
    session.get("token_api") === token
  ) {
    return json({ address: session.get("address"), ENV });
  }

  return json({ ENV });
};

const App = withEmotionCache((_, emotionCache) => {
  const initialState = useContext(ApolloContext);
  const { address, ENV } = useLoaderData<LoaderData>();
  const clientStyleData = useContext(clientStyleContext);

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      // eslint-disable-next-line no-underscore-dangle
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#FFFFFF",
              accentColorForeground: "#212121",
              borderRadius: "small",
              fontStack: "system",
            })}
          >
            <AppProvider isLoggedIn={!!address}>
              <ThemeProvider theme={theme}>
                <Header address={address} />
                <Outlet />
                <Footer />
              </ThemeProvider>
            </AppProvider>
          </RainbowKitProvider>
        </WagmiConfig>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV=${JSON.stringify(ENV)}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__=${JSON.stringify(
              initialState
            ).replace(/</g, "\\u003c")};`,
          }}
        />
      </body>
    </html>
  );
});

export default withSentry(App);
