import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import __ from "helpers/__";
import useLogInWallet from "../../hooks/useLogInWallet";
import Post from "../../components/Post";
import Image from "../../components/Image";
import FAQ from "./FAQ";

import "./Artist.scss";
import generating from "../../assets/img/generating.jpg";

const ARTIST_QUERY = gql`
  query getArtist($artistId: Int) {
    me { address }
    collection(artistId: $artistId) {
      id
      artistId
      minted
      name
      description
      symbol
      instagram
      address
      price
      posts {
        id
        lastNftID
        content
        createdAt
      }
    }
  }
`;

const CREATE_CHECKOUT_LINK_MUTATION = gql`
    mutation CreateCheckoutLink($input: CreateCheckoutLinkInput!) {
        CreateCheckoutLink(input: $input) {
            link
        }
    }
`;

function capitalizeFirstLetter(string) {
  return string.replace(/^./, string[0].toUpperCase());
}

export default function Artist() {
  const location = useLocation();
  const { isLoggedIn } = useLogInWallet();
  const { id } = useParams();
  const { data, loading } = useQuery(ARTIST_QUERY, {
    variables: { artistId: Number(id) },
  });
  const [minting, setMinting] = useState(false);
  const artist = data?.collection;

  useEffect(() => {
      if (data?.collection?.name) {
        document.title = `${data.collection.name} Supertrue`
      }
    },[location, data],
  );

  const [createCheckoutLinkMutation] = useMutation(CREATE_CHECKOUT_LINK_MUTATION, {
    variables: { input: { artistId: Number(id) } },
    onCompleted: ({ CreateCheckoutLink: { link } }) => {
      window.location.href = link
    },
    onError: (e) => {
      console.log("CreateCheckoutLink failed", e.message);
      setMinting(false);
    },
  });

  const mintNFTPaper = async () => {
    setMinting(true);
    return createCheckoutLinkMutation();
  };

  if (loading) {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (!artist) {
    return (
      <Container maxWidth="md">
        <Grid>
          <Typography variant="h5">Artist Not Found</Typography>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Grid container mb={6} className="artist-single">
        <Grid item className="image" md={6}>
          <Image
            alt={artist.name}
            src={__.getNFTImage(artist.artistId, artist.minted)}
            fallbackSrc={generating}
          />
        </Grid>

        <Grid item className="details" md={6}>
          <Typography variant="h2" className="title">
            Mint {artist.name}
          </Typography>

          <Typography variant="subtitle1" className="title">
            <a
              style={{ color: "black" }}
              target="_blank"
              href={`https://www.instagram.com/${artist.instagram}`}
            >
              @{artist.instagram}
            </a>
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h5" className="price">
              <label>Price:</label>{" "}
            </Typography>{" "}
            <Typography>{(artist.price / 10 ** 18).toFixed(4)} MATIC</Typography>
            <br />
            <Typography variant="subtitle2">
              Price goes up per each additional NFT created.
            </Typography>
          </Box>

          <Box className="actions">
            <Box>
              <LoadingButton
                loading={minting}
                size="large"
                variant="contained"
                onClick={() => (isLoggedIn || data?.me?.address) && mintNFTPaper()}
                href={isLoggedIn || data?.me?.address ? undefined : "/login"}
              >
                Mint Fan #{artist.minted + 1}
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {artist?.description && (
        <Box mb={6}>
          <Paper className="about" elevation={2}>
            <Typography variant="h4">About</Typography>
            <Typography>{artist.description}</Typography>
          </Paper>
        </Box>
      )}

      <Typography mb={2} variant="h4">Posts</Typography>
      <Box mb={6}>
        {!artist?.posts.length ? (
          <Typography>{capitalizeFirstLetter(artist.name)} hasn't posted yet.</Typography>
        ) : (
          <>
            {artist.posts.map((p) => (
              <Box key={p.id} mb={4}>
                <Post
                  post={p}
                  artistName={artist.name}
                  artistId={artist.artistId}
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
