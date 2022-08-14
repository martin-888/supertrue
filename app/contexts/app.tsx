import { createContext, useContext } from "react";
import type { Magic as MagicType } from 'magic-sdk';
import { Magic } from 'magic-sdk';

const isBrowser = typeof window !== "undefined";

// @ts-ignore
const magic = !isBrowser ? {} : new Magic(ENV.MAGIC_KEY, { network: ENV.NETWORK });

type AppContext = {
  magic: MagicType
}

// @ts-ignore
const AppContext = createContext<AppContext>({ magic });

export function AppProvider() {
  // @ts-ignore
  return <AppContext.Provider value={{ magic }} />;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("must be rendered within AppContext Provider");
  return context;
}
