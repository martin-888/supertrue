import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import { Contract, utils } from "ethers";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@mui/material";

import { abis } from "../../contracts";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import __ from "helpers/__";
import useAccountBalance from "../../hooks/useAccountBalance";
import useLogInWallet from "../../hooks/useLogInWallet";

import "./Artist.scss";
import Post from "components/Post";
import FAQ from "./FAQ";
import waitForMintedTransaction from "../../utils/waitForMintedTransaction";

const NETWORK = process.env.REACT_APP_NETWORK;
const NETWORK_RPC_URL = process.env.REACT_APP_NETWORK_RPC_URL;
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

const ARTIST_QUERY = gql`
  query getArtist($artistId: Int) {
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

async function mint({ provider, contractAddress, price }) {
  const supertrueNFT = new Contract(
    contractAddress,
    abis.supertrueNFT,
    provider.getSigner()
  );

  const address = provider.getSigner().getAddress();

  const tx = await supertrueNFT.mint(address, { value: price });

  const receipt = await tx.wait();

  return { tx, receipt };
}

function capitalizeFirstLetter(string) {
  return string.replace(/^./, string[0].toUpperCase());
}

/**
 * Component: Single Artist Page
 */
export default function Artist() {
  const location = useLocation();
  const { provider, chainId } = useWeb3Modal();
  const { login, isLoggedIn } = useLogInWallet();
  const balance = useAccountBalance();
  const { id } = useParams();
  const { data, loading, error, refetch } = useQuery(ARTIST_QUERY, {
    variables: { artistId: Number(id) },
  });

  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

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

  const mintNFT = async () => {
    if (chainId !== CHAIN_ID) {
      alert(`To mint NFT first you need to switch to ${NETWORK.toUpperCase()} network.`);

      const hexChainId = `0x${CHAIN_ID.toString(16)}`;

      let error;

      await provider.send('wallet_switchEthereumChain', [{chainId: hexChainId}])
        .catch(err => {
          if (err.code !== 4902) {
            error = `wallet_switchEthereumChain error ${err}`
            return;
          }

          return provider.send('wallet_addEthereumChain',
            [{ chainId: hexChainId, rpcUrls: [NETWORK_RPC_URL] }]
          )
            .catch(addErr => {
              error = `wallet_addEthereumChain error ${addErr}`
            })
        })

      if (error) {
        // TODO show to user
        console.error(error);
        return;
      }
    }

    if (balance < utils.parseUnits(artist?.price, "wei").toBigInt()) {
      alert("Not enough funds in your wallet.");
      return;
    }

    setMinting(true);

    await mint({
      provider,
      contractAddress: artist.address,
      price: artist.price,
    })
      .then(() => setTimeout(() => setMinted(true) && refetch(), 5000))
      .catch((err) => console.error(err.message))
      .finally(() => setTimeout(() => setMinting(false), 5000));
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
          <img
            src={__.getNFTImage(artist.artistId, artist.minted)}
            alt={artist.name}
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

          {minted && (
            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                color="success"
                target="_blank"
                LinkComponent="a"
                href={`https://opensea.io/assets/matic/${artist.address}/${
                  artist.minted + 1
                }`}
              >
                Show On OpenSea
              </Button>
            </Box>
          )}

          <Box className="actions">
            <Box>
              {minting ? (
                <CircularProgress />
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  onClick={!isLoggedIn ? login : mintNFTPaper}
                  disabled={minting}
                >
                  Mint Fan #{artist.minted + 1}
                </Button>
              )}
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
