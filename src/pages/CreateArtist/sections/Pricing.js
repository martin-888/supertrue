import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PricingForm from "../../../components/PricingForm";

export default function Pricing({
  loading,
  defaultPrice,
  startPolling,
  stopPolling,
  artistId
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultPrice !== 10) {
      navigate(`/s/${artistId}`);
    }
  }, [defaultPrice]);

  return (
    <section>
      <Typography variant="h3" mb={2}>
        PRICING
      </Typography>

      <Box mb={4}>
        <Typography mb={2}>
          Customize pricing of your collection.
        </Typography>
        <Typography mb={2}>
          Price is increasing with each mint up to 1000 NFTs is minted.
        </Typography>
        <Typography mb={4}>
          After price becomes constant.
        </Typography>

        <Typography mb={1} variant="h4">
          Starting price
        </Typography>
        <Typography mb={1}>
          - price of the first minted NFT
        </Typography>
        <Typography mb={4}>
          - has to be in range of $10 - $1000
        </Typography>

        <Typography mb={1} variant="h4">
          Ending price
        </Typography>
        <Typography mb={1}>
          - a constant price reached once 1000 NFTs is minted
        </Typography>
        <Typography mb={1}>
          - it's automatically 5 * starting price
        </Typography>
      </Box>

      <PricingForm
        loading={loading}
        defaultPrice={defaultPrice}
        startPolling={startPolling}
        stopPolling={stopPolling}
        buttonAlwaysActive
        onNoChange={() => navigate(`/s/${artistId}`)}
      />
    </section>
  );
}
