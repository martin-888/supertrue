import { createContext } from "react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { parse as cookieParse } from "cookie";

const isBrowser = typeof window !== "undefined";

const initialState = isBrowser ? window.__INITIAL_STATE__ : {};

export function initApollo(token: string, ssrMode = true) {
  const httpLink = createHttpLink({
    uri: ENV.GRAPHQL_URL,
  });

  const authLink = setContext((_, { headers }) => {
    if (!token?.length) {
      return headers;
    }

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
    ssrMode,
  });
}

export function apolloClient(request: Request) {
  const cookie = cookieParse(request.headers.get("cookie") || "");
  const token = cookie?.token_api;

  return initApollo(token, true);
}

export default createContext(initialState);
