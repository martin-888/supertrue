import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { gql } from '~/__generated__/gql';

import { apolloClient } from "~/contexts/apollo";

const ARTIST_QUERY = gql(`
  query getArtistId($id: Int!) {
    collection(artistId: $id) {
      id
      username
    }
  }
`);

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "params.id should be defined");

  const { data } = await apolloClient(request).query({
    query: ARTIST_QUERY,
    variables: { id: parseInt(params.id) },
  });

  if (!data?.collection?.username) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return redirect(`/${data.collection.username}`);
};
