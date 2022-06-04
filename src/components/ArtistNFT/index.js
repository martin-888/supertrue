import React from "react";
import { Box, Grid, Button } from "@mui/material";
import __ from "helpers/__";
import './ArtistNFT.scss';

/**
 * Component: Artist NFT
 */
 export default function ArtistNFT({ artist }) {
    return(
      <Grid item className="artist-nft">
        <Box className="image">
        <a href={`/s/${artist.id}`} target="_blank" >
          <img src={__.getArtistNFTImage(artist)} />
        </a>
        </Box>
        <Box className="details">
          <Box className="actions">
            <Button size="large" variant="outlined" href={`/s/${artist.id}`}>Mint #{artist.minted+1}</Button>
          </Box>
        </Box>
      </Grid>
    );
  }
