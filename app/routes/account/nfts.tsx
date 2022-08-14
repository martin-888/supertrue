import React from "react";
import { LoaderFunction, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";

import ArtistNFT from "~/components/ArtistNFT";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("token")) {
    return redirect("/account/login?redirect=/account/nfts");
  }

  return null;
}

const NFTS_QUERY = gql`
    query myNfts {
        me {
            id
            nfts {
                id
                tokenId
                artistId
                collection {
                    username
                }
            }
        }
    }
`;

export default function NFTs() {
  const { data, loading } = useQuery(NFTS_QUERY);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  if (!data?.me?.nfts?.length) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {data?.me?.id ? (
            <Typography variant="h5">No Supertrue NFTs found</Typography>
          ) : (
            <>
              <Typography variant="h5" mb={5} textAlign="center">
                Log in to see your Supertrue NFTs.
              </Typography>
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate("/account/login")}
              >
                Log In
              </Button>
            </>
          )}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Grid container spacing={4}>
        {data.me.nfts.map((nft) => (
          <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
            <ArtistNFT
              artist={{
                id: nft.artistId,
                minted: nft.tokenId,
                owner: { username: nft.collection.username },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
