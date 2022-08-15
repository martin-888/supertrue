import { createContext, useContext } from "react";
import type { Magic as MagicType } from "magic-sdk";
import { Magic } from "magic-sdk";

const isBrowser = typeof window !== "undefined";

// @ts-ignore
const magic = !isBrowser
  ? {}
  : new Magic(ENV.MAGIC_KEY, { network: ENV.NETWORK });

type AppContextProps = {
  magic: MagicType;
  isLoggedIn: boolean;
};

// @ts-ignore
const AppContext = createContext<AppContextProps>({ magic });

type AppProviderProps = {
  isLoggedIn: boolean;
  children: any;
};

export function AppProvider({ isLoggedIn, children }: AppProviderProps) {
  // @ts-ignore
  return (
    <AppContext.Provider value={{ magic, isLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("must be rendered within AppContext Provider");
  return context;
}
