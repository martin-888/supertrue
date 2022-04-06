import React from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import __ from "../../../helpers/__";
import useWeb3Modal from "../../../hooks/useWeb3Modal";

const Assets = ({ nfts, loading }) => {
  const { account } = useWeb3Modal();

  const getContent = () => {
    if (!account) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">Connect your wallet to see your NFTs</Typography>
        </Grid>
      );
    }
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
    if (!nfts?.length) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">No NFTs Collected</Typography>
        </Grid>
      );
    }

    return (
      <Grid container spacing={8}>
        {nfts.map((nft) => (
          <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
            <Box className="image">
              <img src={__.getNFTImage(nft.artistId, nft.tokenId)} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Typography variant="h2">MY ASSETS</Typography>
      <Box sx={{mb:4}} />
      {getContent()}
    </Box>
  );
}

export default Assets;
