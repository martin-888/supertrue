import React, { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { useMutation } from "@apollo/client";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { gql } from '~/__generated__/gql';

import FAQ from "./FAQ";

import { sendToSentry } from "~/utils/sentry";
import Post from "~/components/Post";
import Image from "~/components/Image";
import { getNFTImage } from "~/utils/imageUrl";

import generating from "~/assets/img/generating.jpg";

const styles = {
  image: {
    maxWidth: "385px",
    maxHeight: "385px",
  },
  price: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
};

const CREATE_CHECKOUT_LINK_MUTATION = gql(`
  mutation CreateCheckoutLink($input: CreateCheckoutLinkInput!) {
    CreateCheckoutLink(input: $input) {
      link
    }
  }
`);

const SHOW_CENTS_THRESHOLD = 10000;

function capitalizeFirstLetter(string: string) {
  return string.replace(/^./, string[0].toUpperCase());
}

export default function Artist() {
  const [minting, setMinting] = useState(false);
  const data = useLoaderData();

  const artist = data.collection;

  const isLoggedIn = !!data?.me?.address;

  const [createCheckoutLinkMutation] = useMutation(
    CREATE_CHECKOUT_LINK_MUTATION,
    {
      variables: { input: { artistId: Number(artist.artistId) } },
      // @ts-ignore
      onCompleted: ({ CreateCheckoutLink: { link } }) => {
        window.location.href = link;
      },
      onError: (e) => {
        console.log("CreateCheckoutLink failed", e.message);
        setMinting(false);
        sendToSentry(e);
      },
    }
  );

  const mintNFTPaper = async () => {
    setMinting(true);
    return createCheckoutLinkMutation();
  };

  return (
    <Container maxWidth="md">
      <Grid container mb={6}>
        <Grid item sm={12} md={6}>
          <div style={styles.image}>
            <Image
              alt={artist.name}
              src={getNFTImage(artist.artistId, artist.minted)}
              fallbackSrc={generating}
            />
          </div>
        </Grid>

        <Grid item sm={12} md={6} sx={{ paddingTop: { xs: 6, md: 0 } }}>
          <Typography variant="h2" className="title">
            Mint {artist.name}
          </Typography>
          <Typography variant="subtitle1" className="title">
            <a
              style={{ color: "black" }}
              target="_blank"
              rel="noreferrer"
              href={`https://www.instagram.com/${artist.instagram}`}
            >
              @{artist.instagram}
            </a>
          </Typography>

          <Box mb={1} my={3}>
            <Typography variant="h5" style={styles.price}>
              Price
            </Typography>
            <Typography>
              {(artist.price / 10 ** 18).toFixed(2)} MATIC (~$
              {artist.priceCents < SHOW_CENTS_THRESHOLD
                ? (artist.priceCents / 100).toFixed(2)
                : (artist.priceCents / 100).toFixed(0)}
              )
            </Typography>
            <br />
            <Typography variant="subtitle2">
              Price goes up per each additional NFT created.
            </Typography>
          </Box>
          <Box>
            <LoadingButton
              loading={minting}
              size="large"
              variant="contained"
              onClick={() =>
                (isLoggedIn || data?.me?.address) && mintNFTPaper()
              }
              href={
                isLoggedIn || data?.me?.address ? "" : "/account/login"
              }
            >
              Mint Fan #{artist.minted + 1}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>

      {artist?.description && (
        <Box mb={6}>
          <Paper elevation={2}>
            <Box p={3}>
              <Typography variant="h4" mb={2}>
                About
              </Typography>
              <Typography>{artist.description}</Typography>
            </Box>
          </Paper>
        </Box>
      )}

      <Typography mb={2} variant="h4">
        Posts
      </Typography>
      <Box mb={6}>
        {!artist?.posts.length ? (
          <Typography>
            {capitalizeFirstLetter(artist.name)} hasn't posted yet.
          </Typography>
        ) : (
          <>
            {artist.posts.map((p) => (
              <Box key={p.id} mb={4}>
                <Post
                  post={p}
                  artistName={artist.name}
                  artistId={artist.artistId}
                  username={artist.username}
                  instagram={artist.instagram}
                />
              </Box>
            ))}
          </>
        )}
      </Box>
      <FAQ />
    </Container>
  );
}
