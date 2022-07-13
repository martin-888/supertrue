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

export const { chains, provider } = configureChains(
  [chain.rinkeby, chain.polygon ],
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