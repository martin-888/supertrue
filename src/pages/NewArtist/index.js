import React, { useState, useMemo, useEffect } from "react";
import { TextField, Typography, Button, Container, Box, Grid, CircularProgress } from "@mui/material";
import { Contract, utils } from "ethers";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import millify from 'millify';
import { useDebounce } from 'use-debounce';

import { addresses, abis } from "../../contracts";
import * as api from "../../api";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import useAccountBalance from "../../hooks/useAccountBalance";

const price = 0.002; // TODO load from smart contract
const priceInWei = utils.parseEther(price.toString(10)).toBigInt();
const maxFollowers = 200000;

// TODO add search param to collections
const COLLECTIONS_QUERY = gql`
    {
        collections(first: 100) {
            id
            artistId
            minted
            name
            instagram
            owner {
                id
            }
        }
    }
`;

const errorMessagesInstagram = {
  "missing-instagram": "Missing instagram handle.",
  "instagram-not-valid": "Instagram handle is not valid.",
  "instagram-not-found": "Instagram doesn't exist.",
  "followers-over-limit": `Artist can't have more than 200k followers.`,
};

async function create({ provider, instagram, name }) {
  // creating connection to the smart contract
  const superTrueCreator = new Contract(addresses.superTrueCreator, abis.superTrueCreator, provider.getSigner());

  const creationPrice = await superTrueCreator.getCreationPrice();

  // calling the smart contract function
  const tx = await superTrueCreator.createArtist(name, instagram, instagram, { value: creationPrice });

  // wait till the transaction is mint/confirmed
  const receipt = await tx.wait();

  return { tx, receipt };
}

export default function NewArtist() {
  const { provider, loadWeb3Modal } = useWeb3Modal();
  const balance = useAccountBalance();
  const navigate = useNavigate();
  // eslint-disable-next-line no-restricted-globals
  const search = useMemo(() => queryString.parse(window.location.search), [location.search]);
  const [name, setName] = useState(search.name);
  const [instagram, setInstagram] = useState('');
  const [debouncedInstagram] = useDebounce(instagram, 500);
  const [artistExists, setArtistExists] = useState(false);
  const [instagramTouched, setInstagramTouched] = useState(false);
  const [instagramValid, setInstagramValid] = useState(true);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [lastFetchedInstagramHandle, setLastFetchedInstagramHandle] = useState('');
  const [nameValid, setNameValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [existingArtistID, setExistingArtistID] = useState(null);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState(null);
  const collectionsQuery = useQuery(COLLECTIONS_QUERY);

  useEffect(() => {
    setError(null);
    setIsAvailable(false);

    //Extract Instagram handle
    const match = instagram.match(/instagram.com\/([\w._]{1,30})/);
    setInstagramValid(!!match);

    const igHandle = match?.[1];

    //Check if Artist Already Exists
    const artist = collectionsQuery.data?.collections?.find(artist => artist.instagram === igHandle)
    setExistingArtistID(artist?.artistId);

    const exists = !!igHandle && collectionsQuery.data?.collections?.find(artist => artist.instagram === igHandle);
    setArtistExists(exists);

    if (exists) {
      setInstagramValid(false);
    }

    setInstagramHandle(igHandle || '');
  }, [instagram]);

  useEffect(() => {
    if (instagramHandle === "" || instagramHandle === lastFetchedInstagramHandle) {
      return;
    }

    api.getInstagramData(instagramHandle)
      .then(({ followers, errCode }) => {
        setLastFetchedInstagramHandle(instagramHandle);
        if (errCode) {
          setFollowers(null);
          setInstagramValid(false);
          setError(errorMessagesInstagram[errCode])
          return;
        }

        setFollowers(followers);
        if (followers < maxFollowers) {
          return;
        }
        setInstagramValid(false);
        setError(errorMessagesInstagram["followers-over-limit"])
      })
      .catch((error) => {
        console.error("Fetching instagram data failed", error);
        setError("Something went wrong.");
      })
  }, [debouncedInstagram])

  useEffect(() => {
    const value = name || "";
    const match = value.match(/^([\w ._-]+)$/);
    setNameValid(!!match && value.trim().length > 0);
    setName(match?.[1]);
  }, [name]);

  const createArtist = async () => {
    if (balance < priceInWei) {
      alert("Not enough funds in your wallet.");
      return;
    }

    setLoading(true);

    //Create Artist on Chain
    const { receipt, tx } = await create({ provider, instagram: instagramHandle, name })
      .catch(error => {
        console.error("Failed to create Artist", error);
        return {};
      })

    if (!tx) {
      setError("Artist creation failed.");
      setLoading(false);
      return;
    }

    console.log({ receipt, tx });

    //Create Artist in DB
    const { artist, errCode } = await api.createArtist({ tx: receipt.transactionHash })
      .catch(error => {
        console.error("createArtist api call failed", error);
        return {};
      })

    if (errCode || !artist?.id) {
      console.error("New Artist not Found", {artist, tx, receipt});
      setError("Artist creation failed.");
      setLoading(false);
      return;
    }

    // TODO show success message and ask for waiting
    //Redirect to Artist Page
    setTimeout(() => navigate(`/artist/${artist.id}`), 30000);
  };

  return (
    <>
      <Container maxWidth="xs">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h3" component="h3" sx={{ opacity: artistExists ? "0.3" : "1", textAlign:'center' }}>
            Register Artist:
            <br />
            <span style={{textTransform:'uppercase'}}>{name || "?"}</span>
          </Typography>

          <Box sx={{ mb: 4 }} />

          <TextField
            autoFocus
            fullWidth
            error={!nameValid}
            color={nameValid ? "success" : null}
            id="standard-basic"
            label="Name"
            variant="standard"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <Box sx={{ mb: 2 }} />

          <TextField
            fullWidth
            error={instagramTouched && !instagramValid}
            color={!(instagramTouched && !instagramValid) ? "success" : null}
            placeholder="https://www.instagram.com/drake/"
            id="standard-basic"
            label="Instagram Link"
            variant="standard"
            onChange={e => {
              setInstagram(e.target.value);
              setInstagramTouched(true);
            }}
          />

          <Box sx={{ mb: 4 }} />

          <Box sx={{ mb: 4 }}>
            {artistExists ? (
              <Button
                size="large"
                variant="contained"
                href={`/artist/${existingArtistID}`}
              >
                Open {collectionsQuery.data.collections.find(artist => artist.artistId === existingArtistID).name}
              </Button>
              ) : (
                <Box textAlign="center">
                  <Box sx={{ mb: 4 }}>
                    <Typography>Followers: {followers === null || instagramHandle !== lastFetchedInstagramHandle ? "-" : millify(followers)}</Typography>
                  </Box>
                  {(loading || collectionsQuery.loading) || instagramValid && instagramHandle !== lastFetchedInstagramHandle && (
                    <Box sx={{ mb: 2 }}>
                      <CircularProgress />
                    </Box>
                  )}
                  {error !== null && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant='h3'>{error}</Typography>
                    </Box>
                  )}
                  <Typography><label>Price:</label> {price} ETH</Typography>
                  <Box sx={{ mb: 2 }} />
                  <Button
                    disabled={error || loading || !instagramValid || instagramHandle !== lastFetchedInstagramHandle}
                    size="large"
                    variant="contained"
                    onClick={!provider ? loadWeb3Modal : createArtist}
                  >
                    Create {name}
                  </Button>
                </Box>
            )}
          </Box>

        </Grid>
      </Container>
    </>
  );
}
