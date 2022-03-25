import React, { useState, useMemo, useEffect } from "react";
import { TextField, Typography, Button, Container, Box, Grid, CircularProgress } from "@mui/material";
import { Contract } from "ethers";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";

import { addresses, abis } from "../../contracts";
import * as api from "../../api";
import useWeb3Modal from "../../hooks/useWeb3Modal";

const price = 0.002; // TODO load from smart contract

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
  const { provider, loadWeb3Modal } = useWeb3Modal(); //, logoutOfWeb3Modal
  const navigate = useNavigate();
  // eslint-disable-next-line no-restricted-globals
  const search = useMemo(() => queryString.parse(window.location.search), [location.search]);
  const [name, setName] = useState(search.name);
  const [instagram, setInstagram] = useState('');
  const [artistExists, setArtistExists] = useState(false);
  const [instagramTouched, setInstagramTouched] = useState(false);
  const [instagramValid, setInstagramValid] = useState(true);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [nameValid, setNameValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const [existingArtistID, setExistingArtistID] = useState(null);

  useEffect(() => {
    //Fetch Artists
    api.getArtists().then(resp => setArtists(resp.artists));
  }, []);

  useEffect(() => {
    //Extract Instagram handle
    const match = instagram.match(/instagram.com\/([\w._]+)/);
    setInstagramValid(!!match);

    //Check if Artist Already Exists
    const artist = artists?.find(artist => artist.igHandle === match?.[1])
    setExistingArtistID(artist?.id);

    const exists = !!match?.[1] && !!artists.find(artist => artist.igHandle === match?.[1]);
    setArtistExists(exists);

    if (exists) {
      setInstagramValid(false);
    }

    setInstagramHandle(match?.[1]);
  }, [instagram]);

  useEffect(() => {
    const value = name || "";
    const match = value.match(/^([\w -]+)$/);
    setNameValid(!!match && value.trim().length > 0);
    setName(match?.[1]);
  }, [name]);

  const createArtist = async () => {
    setLoading(true);

    // TODO check if account has enough funds

    try {
      //Create Artist on Chain
      const { receipt, tx } = await create({ provider, instagram: instagramHandle, name });
      //Log
      console.log({ receipt, tx });
      //Create Artist in DB
      const { artist, errCode } = await api.createArtist({ tx: receipt.transactionHash });

      if (errCode || !artist?.id) {
        console.error("New Artist not Found", {artist, tx, receipt});
        setLoading(false);
      } else {
        // TODO show success message and ask for waiting
        //Redirect to Artist Page
        setTimeout(() => navigate(`/artist/${artist.id}`), 30000);
      }
    }
    catch(error) {
      console.error("Failed to create Artist", error);
      setLoading(false);
      // TODO handle errors / show the user an error message
    }
  };

  return (
    <>
      <Container maxWidth="sm">
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

          <Box sx={{ m: 2 }}>
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
          </Box>

          <Box sx={{ m: 2 }}>
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
          </Box>

          {loading && (
            <Box sx={{ m: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <Box sx={{ m: 4 }}>
            {artistExists ? (
              <Button
                size="large"
                variant="contained"
                href={`/artist/${existingArtistID}`}
              >
                Open {artists.find(artist => artist.id === existingArtistID).name}
              </Button>
              ) : (
                <Box textAlign="center">
                  <Typography><label>Price:</label> {price} ETH</Typography>
                  <Box sx={{ m: 2 }} />
                  <Button
                    disabled={!instagramValid || !nameValid || loading}
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
