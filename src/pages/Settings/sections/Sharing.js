import React  from "react";
import { Typography } from "@mui/material";

import Image from "../../../components/Image";
import generating from "../../../assets/img/generating.jpg";
import __ from "../../../helpers/__";

const styles = {
  startingKit: { maxWidth: "250px" },
};

export default function Sharing({ artistId }) {
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
          src={__.getShareImage(artistId)}
          fallbackSrc={generating}
        />
      )}
    </section>
  );
}
