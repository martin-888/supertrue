import React from "react";
import { Typography, Box } from "@mui/material";

import type { PricingFormProps } from "~/components/PricingForm";
import PricingForm from "./components/PricingForm";

type PricingProps = PricingFormProps;

export default function Pricing({
  loading,
  defaultPrice,
  startPolling,
  stopPolling,
}: PricingProps) {
  return (
    <section>
      <Typography variant="h3" mb={2}>
        PRICING
      </Typography>

      <Box mb={4}>
        <Typography mb={2}>Customize pricing of your collection.</Typography>
        <Typography mb={2}>
          Price is increasing with each mint up to 1000 NFTs is minted.
        </Typography>
        <Typography mb={4}>After price becomes constant.</Typography>

        <Typography mb={1} variant="h4">
          Starting price
        </Typography>
        <Typography mb={1}>- price of the first minted NFT</Typography>
        <Typography mb={4}>- has to be in range of $10 - $1000</Typography>

        <Typography mb={1} variant="h4">
          Ending price
        </Typography>
        <Typography mb={1}>
          - a constant price reached once 1000 NFTs is minted
        </Typography>
        <Typography mb={1}>- it's automatically 5 * starting price</Typography>
      </Box>

      <PricingForm
        key={defaultPrice}
        loading={loading}
        defaultPrice={defaultPrice}
        startPolling={startPolling}
        stopPolling={stopPolling}
      />
    </section>
  );
}
