import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import Web3Modal from "web3modal";

const INFURA_ID = process.env.REACT_APP_INFURA_KEY;
const NETWORK = process.env.REACT_APP_NETWORK;

function useWeb3Modal(config = {}) {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [chainId, setChainId] = useState();
  const [loadWeb3ModalError, setLoadWeb3ModalError] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, network = NETWORK } = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
          },
        },
      },
    });
  }, [infuraId, network]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    setLoadWeb3ModalError(null);
    const newProvider = await web3Modal
      .connect()
      .catch((e) => setLoadWeb3ModalError(e?.message));

    if (!newProvider) {
      // console.error("useWeb3Modal() No Provider Found");
      return;
    }

    const signerProvider = new providers.Web3Provider(newProvider);
    setProvider(signerProvider);

    //Set Current Chain ID
    signerProvider.detectNetwork().then((res) => setChainId(res?.chainId));
    //Set Current Account
    signerProvider
      .listAccounts()
      .then((accounts) => setAccount(accounts?.[0]?.toLowerCase()));

    newProvider.on("accountsChanged", (accounts) => {
      console.log(`account changed to:`, accounts?.[0]);
      setAccount(accounts?.[0]?.toLowerCase());
    });

    newProvider.on("chainChanged", (chainId) => {
      console.log(`chain changed to ${chainId}`);
      setChainId(chainId);
    });

    // newProvider.on("networkChanged", (networkId) => {
    //   console.log(`network changed to ${networkId}! updating providers`);
    // });

    // Subscribe to session disconnection
    newProvider.on("disconnect", (code, reason) => {
      console.log("disconnect");
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      setAccount(null);
      window.location.reload();
    },
    [web3Modal]
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [
    autoLoad,
    autoLoaded,
    loadWeb3Modal,
    setAutoLoaded,
    web3Modal.cachedProvider,
  ]);

  return {
    provider,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    account,
    chainId,
    loadWeb3ModalError,
  };
}

export default useWeb3Modal;
