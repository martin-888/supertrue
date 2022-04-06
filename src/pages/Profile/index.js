import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, Container} from "@mui/material";

import useWeb3Modal from "../../hooks/useWeb3Modal";

import ClaimAccount from "./sections/ClaimAccount";
import Collection from "./sections/Collection";
import Assets from "./sections/Assets";

const MY_PROFILE_QUERY = gql`
    query myNfts($userId: ID!) {
        user(id: $userId) {
            collection {
                id
                artistId
                address
                minted
                name
                instagram
                pendingFunds
            }
            nfts {
                id
                tokenId
                artistId
                collection {
                    address
                    minted
                    name
                    instagram
                }
            }
        }
    }
`;

export default function Profile() {
  const { account } = useWeb3Modal();
  const { data, loading, error } = useQuery(MY_PROFILE_QUERY, {
    variables: { userId: (account || "").toLowerCase() }
  });
  const [contractAddress, setContractAddress] = useState(null);

  useEffect(() => setContractAddress(data?.user?.collection?.address), [data]);

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <ClaimAccount
        collection={data?.user?.collection}
        contractAddress={contractAddress}
        setContractAddress={address => setContractAddress(address)}
      />
      <Box sx={{ mb:4 }} />
      <Collection collection={data?.user?.collection} contractAddress={contractAddress} />
      <Box sx={{ mb:4 }} />
      <Assets nfts={data?.user?.nfts} loading={loading} />
    </Container>
  );
}
