import { createContext, useContext } from "react";
import { Magic } from 'magic-sdk';

const AppContext = createContext();

const envVars = {
  network: process.env.REACT_APP_NETWORK,
  magicKey: process.env.REACT_APP_MAGIC_KEY,
  infuraKey: process.env.REACT_APP_INFURA_KEY,
  chainId: process.env.REACT_APP_CHAIN_ID,
  firebaseStorageUrl: process.env.REACT_APP_FIREBASE_STORAGE_URL
};

const { magicKey, network } = envVars;

const magic = new Magic(magicKey, { network });

export function AppProvider(props) {
  return <AppContext.Provider value={{envVars, magic}} {...props} />;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("must be rendered within AppContext Provider");
  return context;
}