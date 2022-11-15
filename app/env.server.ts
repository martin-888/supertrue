import invariant from "tiny-invariant";

export function getEnv() {
  invariant(process.env.MAGIC_KEY, "MAGIC_KEY should be defined");
  invariant(process.env.INFURA_KEY, "INFURA_KEY should be defined");
  invariant(process.env.SENTRY_KEY, "SENTRY_KEY should be defined");
  invariant(process.env.ENVIRONMENT, "ENVIRONMENT should be defined");
  invariant(process.env.GRAPHQL_URL, "GRAPHQL_URL should be defined");
  invariant(
    process.env.FIREBASE_STORAGE_URL,
    "FIREBASE_STORAGE_URL should be defined"
  );
  invariant(process.env.CHAIN_ID, "CHAIN_ID should be defined");
  invariant(process.env.NETWORK, "NETWORK should be defined");
  invariant(process.env.NETWORK_RPC_URL, "NETWORK_RPC_URL should be defined");

  return {
    MAGIC_KEY: process.env.MAGIC_KEY,
    INFURA_KEY: process.env.INFURA_KEY,
    SENTRY_KEY: process.env.SENTRY_KEY,
    ENVIRONMENT: process.env.ENVIRONMENT,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    FIREBASE_STORAGE_URL: process.env.FIREBASE_STORAGE_URL,
    CHAIN_ID: process.env.CHAIN_ID,
    NETWORK: process.env.NETWORK,
    NETWORK_RPC_URL: process.env.NETWORK_RPC_URL,
  };
}

export type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
