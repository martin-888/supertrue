import React from "react";
import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import LivePreviewNFT from "~/components/LivePreviewNFT";
import { getNFTImage } from "~/utils/imageUrl";
import Image from "~/components/Image";
import generating from "~/assets/img/generating.jpg";
import { breakLongHandle } from "~/utils/breakLongHandle";

type ArtistNFTProps = {
  artist: {
    id: number;
    instagram?: string;
    minted: number;
    owner?: {
      username: string;
    };
  };
};

export default function ArtistNFT({ artist }: ArtistNFTProps) {
  return (
    <Grid item className="artist-nft">
      <Box className="image">
        {artist.owner ? (
          <Link to={`/${artist.owner.username}`}>
            <Image
              src={getNFTImage(artist.id, artist.minted)}
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
