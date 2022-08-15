import React  from "react";
import { Typography } from "@mui/material";

import Image from "~/components/Image";
import { getShareImage } from "~/utils/imageUrl";

import generating from "~/assets/img/generating.jpg";

const styles = {
  startingKit: { maxWidth: "250px" },
};

type SharingProps = {
  artistId: number;
}

export default function Sharing({ artistId }: SharingProps) {
  return (
    <section>
      <Typography variant="h3" mb={2}>
        SHARING KIT
      </Typography>
      <Typography mb={2}>
        Share on your instagram.
      </Typography>
      {artistId && (
        <Image
          alt="Starting Kit Material"
          style={styles.startingKit}
          src={getShareImage(artistId)}
          fallbackSrc={generating}
        />
      )}
    </section>
  );
}
