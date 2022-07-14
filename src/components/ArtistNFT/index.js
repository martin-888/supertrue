import React from "react";
import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import __ from "helpers/__";
import Image from "../Image";
import generating from "../../assets/img/generating.jpg";

/**
 * Component: Artist NFT
 */
export default function ArtistNFT({ artist }) {
  return(
    <Grid item className="artist-nft">
      <Box className="image">
      <Link to={`/s/${artist.id}`} >
        <Image
          src={__.getNFTImage(artist.id, artist.minted)}
          fallbackSrc={generating}
        />
      </Link>
      </Box>
    </Grid>
  );
}
