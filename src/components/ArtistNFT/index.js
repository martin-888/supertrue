import React from "react";
import { Box, Grid, Button } from "@mui/material";
import { CheckCircle } from '@mui/icons-material';
import __ from "helpers/__";
import './ArtistNFT.scss';

/**
 * Component: Artist NFT
 */
 export default function ArtistNFT(props) {
    const { artist } = props;
    return(
      <Grid item className="artist-nft">
        <Box className="image">

		 <a href={`/artist/${artist.id}`} target="_blank" >
          <img src={__.getArtistNFTImage(artist)} />
		</a>
        </Box>
        <Box className="details">
          <Box className="actions">

           {/*** {artist.owner && <CheckCircle style={{width:'24px', height:'24px', color:'#111'}}/>} ****/}



            <Button size="large" variant="outlined" href={`/s/${artist.id}`}>Mint #{artist.minted+1}</Button>
          </Box>
        </Box>
      </Grid>
    );
  }
