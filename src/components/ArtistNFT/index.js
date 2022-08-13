import React from "react";
import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import LivePreviewNFT from "components/LivePreviewNFT";
import __ from "helpers/__";
import Image from "../Image";
import generating from "../../assets/img/generating.jpg";
import { breakLongHandle } from "../../utils/breakLongHandle";

/**
 * Component: Artist NFT
 */
export default function ArtistNFT({ artist }) {
  return (
    <Grid item className="artist-nft">
      <Box className="image">
        {artist.artistId ? (
          <Link to={`/${artist.owner.username}`}>
            <Image
              src={__.getNFTImage(artist.id, artist.minted)}
              fallbackSrc={generating}
            />
          </Link>
        ) : (
          <Link to={`/reserve/${artist.instagram}`}>
            <Box sx={{ opacity: 0.8 }}>
              <LivePreviewNFT title={"@" + breakLongHandle(artist.instagram)} />
            </Box>
          </Link>
        )}
      </Box>
    </Grid>
  );
}
