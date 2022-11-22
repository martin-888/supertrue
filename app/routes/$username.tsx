import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import React from "react";
import { useCatch } from "@remix-run/react";
import { Container } from "@mui/material";

import { gql } from '~/__generated__/gql';

import Username from '~/views/Username';

import { apolloClient } from "~/contexts/apollo";

export const meta: MetaFunction = ({ data }) => {
  if (!data?.collection?.name) {
    return {
      title: `Page Not Found | Supertrue`,
    };
  }

  return {
    title: `${data.collection.name} (@${data.collection.username}) | Supertrue`,
    "og:title": `Follow ${data.collection.name} (@${data.collection.username}) on Supertrue`,
  };
};

const COLLECTION_QUERY = gql(`
  query getArtistUsername($username: String!) {
    me {
      address
    }
    collection(username: $username) {
      username
      id
      artistId
      minted
      name
      description
      symbol
      instagram
      address
      price
      priceCents
      posts {
        id
        lastNftID
        content
        createdAt
      }
    }
  }
`);

export const loader: LoaderFunction = async ({ params, request }) => {
  const { data } = await apolloClient(request).query({
    variables: { username: params.username || "" },
    query: COLLECTION_QUERY,
  });

  if (!data?.collection) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return { collection: data.collection, me: data.me };
};

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <Container maxWidth="md">
      <h1>{caught.status} - Artist Not Found :(</h1>
    </Container>
  );
}

export default Username;
