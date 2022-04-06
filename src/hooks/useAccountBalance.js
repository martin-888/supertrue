import { useEffect, useState } from "react";
import useWeb3Modal from "./useWeb3Modal";

function useAccountBalance() {
  const { provider, account } = useWeb3Modal();
  const [ balance, setBalance ] = useState(null);

  useEffect(() => {
    (async () => {
      if (!account || !provider) {
        setBalance(null);
        return;
      }

      const newBalance = await provider.getBalance(account);

      setBalance(newBalance.toBigInt());
    })()
  }, [provider, account]);

  return balance;
}

export default useAccountBalance;
