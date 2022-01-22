import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contract } from "@ethersproject/contracts";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";

import { abis } from "../../contracts";
import { getArtist } from "../../api";
import useWeb3Modal from "../../hooks/useWeb3Modal";

async function mint({ provider, contractAddress }) {
  // creating connection to the smart contract
  const forwardNFT = new Contract(contractAddress, abis.forwardNFT, provider.getSigner());

  // get connected metamask wallet address
  const address = await provider.getSigner().getAddress();

  // just debug for you
  // console.log({ address })

  // the price is slowly increasing with each NFT so we need to get current price
  // const value = await forwardNFT.getCurrentPrice(); // TODO fix
  // console.log(await forwardNFT.owner())
  const value = 2500000000000000;

  // calling the smart contract function
  // first param is amount of NFTs, second is address where it should be mint into
  return forwardNFT.mint(1, address, { value })
    .then(tx => tx.wait().then(receipt => ({ tx, receipt })))
}

export default function Artist() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [artist, setArtist] = useState(null);
  const [minted, setMinted] = useState(false);
  const { id } = useParams();

  useEffect(() => getArtist({ id }).then(response => {
    setArtist(response.artist);
    setLoading(false);
  }), [])

  const mintNFT = async () => {
    setMinting(true);

    await mint({ provider, contractAddress: artist.contractAddress })
      .then(({ tx, receipt }) => setTimeout(() => setMinted(true), 3000))
      .finally(() => setTimeout(() => setMinting(false), 3000));
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
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h5">Artist Not Found</Typography>
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <img width="400" height="400" src={`https://us-central1-supertrue-5bc93.cloudfunctions.net/api/artist/${artist.id}/image/${artist.minted}`} />
      <Box sx={{ m: 4 }} />
      <Typography variant="h5">Price: 0.02 ETH</Typography>
      <Box sx={{ m: 4 }} />
      {minting && (
        <>
          <CircularProgress />
          <Box sx={{ m: 4 }} />
        </>
      )}
      {minted && (
        <>
          <Button
            variant="contained"
            color="success"
            target="_blank"
            href={`https://testnets.opensea.io/assets/${artist.contractAddress}/${artist.minted + 1}`}
          >
            Show On OpenSea
          </Button>
          <Box sx={{ m: 4 }} />
        </>
      )}
      <Button
        size="large"
        variant="contained"
        onClick={!provider ? loadWeb3Modal : mintNFT}
        disabled={minting}
      >
        Mint
      </Button>
      <Box sx={{ m: 4 }} />
    </Grid>
  );
}
