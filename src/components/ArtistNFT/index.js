import React from "react";
import { Box, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import __ from "helpers/__";
import './ArtistNFT.scss';

/**
 * Component: Artist NFT
 */
 export default function ArtistNFT({ artist }) {
    return(
      <Grid item className="artist-nft">
        <Box className="image">
        <Link to={`/s/${artist.id}`} >
          <img src={__.getArtistNFTImage(artist)} />
        </Link>
        </Box>
        {/*<Box className="details">*/}
        {/*  <Box className="actions">*/}
        {/*    <Button size="large" variant="outlined" href={`/s/${artist.id}`}>Mint #{artist.minted+1}</Button>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </Grid>
    );
  }
