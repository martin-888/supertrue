import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Contract } from "ethers";

import useWeb3Modal from "../../../../hooks/useWeb3Modal";
import { abis } from "../../../../contracts";

const requestedChainId = Number.parseInt(process.env.REACT_APP_CHAIN_ID || 0, 10);

const ME_QUERY = gql`
    query me {
        me {
            id
            address
            email
            nfts {
                id
                tokenId
                artistId
            }
            collection {
                id
                artistId
                address
                minted
                name
            }
        }
    }
`;

async function mintTransaction({ provider, contractAddress, price }) {
  const supertrueNFT = new Contract(contractAddress, abis.supertrueNFT, provider.getSigner());

  const address = provider.getSigner().getAddress();

  const tx = await supertrueNFT.mint(address, { value: price });

  const receipt = await tx.wait();

  return { tx, receipt };
}

export default function Mint() {
  const [refetching, setRefetching] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintingError, setMintingError] = useState(null);
  const address = localStorage.getItem("address");
  const { account, provider, chainId } = useWeb3Modal();

  const { data, loading, error, refetch } = useQuery(ME_QUERY);

  useEffect(() => {
    if (!refetching) {
      return;
    }
    // find condition has to be changed for minting not it's own artist NFT
    if (data?.me?.nfts?.find(nft => nft.artistId === address)) {
      setRefetching(false);
      setMinting(false);
      return;
    }

    setTimeout(refetch,5000);
  }, [data, refetching]);

  const mint = async () => {
    if (chainId !== requestedChainId) {
      const hexChainId = `0x${requestedChainId.toString(16)}`;

      await provider.send('wallet_switchEthereumChain', [{chainId: hexChainId}]);
    }

    setMinting(true);
    setMintingError(null);

    const contractAddress = data.me.collection.address;

    const contract = new Contract(contractAddress, abis.supertrueNFT, provider.getSigner());

    const price = await contract.price();

    // TODO check that enough funds (>price) are in connected wallet and if not show error message

    const { tx, receipt } = await mintTransaction({ provider, contractAddress, price });

    if (!receipt || !receipt.blockNumber) {
      setMintingError("Transaction has not been successful.");
      setMinting(false);
      return;
    }

    setRefetching(true);
    await refetch();
  }

  if (loading) {
    return (
      <div>
        <h3>Mint</h3>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h3>Mint</h3>
      {!data?.me && <p>You've to be login for minting</p>}
      {mintingError && <p>{mintingError}</p>}
      <button disabled={!data?.me?.collection || minting} onClick={mint}>Mint my NFT</button>
    </div>
  );
}
