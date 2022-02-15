import React, { useState, useMemo, useEffect } from "react";
import { TextField, Typography, Button, Container, Box, Grid, CircularProgress } from "@mui/material";
import { Contract } from "@ethersproject/contracts";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";

import { addresses, abis } from "../../contracts";
import * as api from "../../api";
import useWeb3Modal from "../../hooks/useWeb3Modal";

async function create({ provider, instagram, name }) {
  // creating connection to the smart contract
  const forwardCreator = new Contract(addresses.forwardCreator, abis.forwardCreator, provider.getSigner());

  // calling the smart contract function
  const tx = await forwardCreator.createArtist(name, instagram);

  // wait till the transaction is mint/confirmed
  const receipt = await tx.wait();

  return { tx, receipt };
}

export default function NewArtist() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
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
    api.getArtists().then(resp => setArtists(resp.artists))
  }, []);

  useEffect(() => {
    const match = instagram.match(/instagram.com\/([\w-]+)/);
    setInstagramValid(!!match);

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

    const { receipt, tx } = await create({ provider, instagram: instagramHandle, name })
    // .catch() // TODO handle errors

    console.log({ receipt, tx });

    const { artist } = await api.createArtist({ tx: receipt.transactionHash });

    setTimeout(() => navigate(`/artist/${artist.id}`), 5000);
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
          <Typography
            variant="h3"
            component="h3"
            sx={{ opacity: artistExists ? "0.3" : "1" }}
          >
            Add {name || "?"}
          </Typography>
          <Box sx={{ m: 2 }} />
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
          <Box sx={{ m: 2 }} />
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
          <Box sx={{ m: 4 }} />
          {loading && (
            <>
              <CircularProgress />
              <Box sx={{ m: 4 }} />
            </>
          )}
          {artistExists ? (
            <Button
              size="large"
              variant="contained"
              href={`/artist/${existingArtistID}`}
            >
              Open {artists.find(artist => artist.id === existingArtistID).name}
            </Button>
            ) : (
            <Button
              disabled={!instagramValid || !nameValid || loading}
              size="large"
              variant="contained"
              onClick={!provider ? loadWeb3Modal : createArtist}
            >
              Create {name}
            </Button>
          )}
          <Box sx={{ m: 4 }} />
        </Grid>
      </Container>
    </>
  );
}
