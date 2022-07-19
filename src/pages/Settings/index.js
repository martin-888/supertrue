import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

import Bio from "./sections/Bio";
import Pricing from "./sections/Pricing";
import Balance, { BALANCE_USER_FRAGMENT } from "./sections/Balance";
import Sharing from "./sections/Sharing";

const ME_QUERY = gql`
  ${BALANCE_USER_FRAGMENT}
  query me {
    me {
      id
      collection {
          id
          artistId
          description
          startPriceCents
          pendingFunds
      }
      ...BalanceUserFragment
    }
  }
`;

export default function Settings() {
  const { data, loading, startPolling, stopPolling } = useQuery(ME_QUERY);

  const me = data?.me;

  useEffect(() => {
      document.title = `Settings | Supertrue`;
    },[],
  );

  return (
    <Container maxWidth="md">
      <Bio
        key={me?.collection?.description}
        loading={loading}
        defaultDescription={me?.collection?.description}
        hasCollection={!!me?.collection}
      />
      <Box mb={8} />
      <Pricing
        loading={loading}
        startPolling={startPolling}
        stopPolling={stopPolling}
        defaultPrice={Math.trunc((me?.collection?.startPriceCents || 1000)/100)}
      />
      <Box mb={8} />
      <Balance
        user={me}
        loading={loading}
        startPolling={startPolling}
        stopPolling={stopPolling}
      />
      <Box mb={8} />
      <Sharing
        artistId={me?.collection?.artistId}
        loading={loading}
      />
    </Container>
  );
}
