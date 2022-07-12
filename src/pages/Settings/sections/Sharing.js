import React  from "react";
import { Typography } from "@mui/material";

import __ from "helpers/__";

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
        This is an image you can share on your instagram
      </Typography>
      {artistId && (
        <img
          alt="Starting Kit Material"
          style={styles.startingKit}
          src={__.getShareImage(artistId)}
        />
      )}
    </section>
  );
}
