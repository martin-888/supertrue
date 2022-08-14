import '@rainbow-me/rainbowkit/styles.css';
import {
  chain,
  configureChains,
  createClient
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const INFURA_ID = "053054e14de8436ca32b539867081440";
const CHAIN_ID = "4";

export const { chains, provider } = configureChains(
  CHAIN_ID === "137" ? [chain.polygon] : [chain.rinkeby],
  [
    infuraProvider({ apiKey: INFURA_ID }),
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
