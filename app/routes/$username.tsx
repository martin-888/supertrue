import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import React, { useState } from "react";
import { useCatch, useLoaderData } from "@remix-run/react";
import { useMutation } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { gql } from '~/__generated__/gql';

import { apolloClient } from "~/contexts/apollo";
import { sendToSentry } from "~/utils/sentry";
import Post from "~/components/Post";
import Image from "~/components/Image";
import { getNFTImage } from "~/utils/imageUrl";

import generating from "~/assets/img/generating.jpg";

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

function FAQ() {
  return (
    <Box mb={4}>
      <Typography mb={2} variant="h4">
        FAQ
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">WHY MINT A SUPERTRUE NFT?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Supertrue mints a discovery NFT showing what date you started
            officially supporting the artist. In lieu of owning an album, we
            give you a personal track record of artists you truly believe in.
            It’s like creating a digital archive of artists you’ve gotten
            behind. This becomes more interesting and useful as you build your
            collection.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">WHAT’S IN IT FOR THE ARTIST</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We built this with the artists in mind. Funds are held for the
            artist to claim minus our service fee. When an artist sets out to
            build an instagram following they get nothing. When an artist sets
            out to build a supertrue following and reaches 1,000 fans, they have
            8k USD to master their album. At 10,000 fans they have 100,000 USD
            to go on tour. All the while you benefit by getting credit you
            deserve of supporting them when they needed it the most.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">
            WHAT HAPPENS WHEN AN ARTIST I BELIEVE IN GROWS
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Congratulations! You’ve helped someone on their way up and now
            they’re on they’re on their way up. Supertrue saves your spot in
            time that you’ve backed that artist, and gives them the ability to
            reward their supertrue fans. How exactly they do it is up to them.
            We suggest to artist to give early access, exclusive shows, and
            special merch only available to their supertrue fans.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">
            CAN I SELL OR TRADE MY SUPERTRUE NFT
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If you’re ready auction off one of the special pieces of your
            collection as it grows in value, that’s up to you. The artist will
            get a 20% cut of your sale and everyone will be happy. We understand
            the feeling of collecting your winnings and using them to find
            someone new who is about to make their start. Happy collecting!
            Happy trading!
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

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
