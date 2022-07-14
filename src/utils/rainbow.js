import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const INFURA_ID = process.env.REACT_APP_INFURA_KEY;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

export const { chains, provider } = configureChains(
  CHAIN_ID === "137" ? [chain.polygon] : [chain.rinkeby],
  [
    infuraProvider({ infuraId: INFURA_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Supertrue',
  chains
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});