import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Container, Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import { gql } from '~/__generated__/gql';

import Bio from "~/components/Settings/Bio";
import Pricing from "~/components/Settings/Pricing";
import Balance from "~/components/Settings/Balance";
import Sharing from "~/components/Settings/Sharing";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("token_api")) {
    return redirect("/account/login?redirect=/account/settings");
  }

  return null;
};

const ME_QUERY = gql(`
  query meSettings {
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
`);

export default function Settings() {
  const { data, loading, startPolling, stopPolling } = useQuery(ME_QUERY);

  const me = data?.me;

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
        defaultPrice={Math.trunc(
          (me?.collection?.startPriceCents || 1000) / 100
        )}
      />
      <Box mb={8} />
      <Balance
        user={me}
        loading={loading}
        startPolling={startPolling}
        stopPolling={stopPolling}
      />
      <Box mb={8} />
      <Sharing artistId={me?.collection!.artistId} loading={loading} />
    </Container>
  );
}
