import React, { useEffect, useState } from "react";
import { TextField, Typography, Box, InputAdornment } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { gql, useMutation } from "@apollo/client";
import * as ethers from "ethers";

import waitForMintedTransaction from "../../../utils/waitForMintedTransaction";

const styles = {
  error: { color: "red", marginTop: 2 },
  input: { maxWidth: "180px", marginRight: 2 }
};

const UPDATE_PRICING_MUTATION = gql`
    mutation updatePricing($input: UpdatePricingInput!) {
        UpdatePricing(input: $input) {
            tx
        }
    }
`;

const NETWORK = process.env.REACT_APP_NETWORK;
const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
const provider = new ethers.providers.InfuraProvider(
  NETWORK,
  INFURA_KEY
);

export default function Pricing({ loading, defaultPrice, startPolling, stopPolling }) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [price, setPrice] = useState(defaultPrice);

  useEffect(() => {
    if (defaultPrice === price) {
      stopPolling();
      setUpdating(false);
    }
  }, [defaultPrice, price]);

  const [updatePricingMutation] = useMutation(UPDATE_PRICING_MUTATION, {
    variables: { input: { startPrice: price * 100 } },
    onCompleted: ({ UpdatePricing: { tx } }) =>
      waitForMintedTransaction({ provider, tx }).then(({ error }) => {
        if (error) {
          setUpdateError(error);
          setUpdating(false);
          return;
        }

        startPolling(5000);
      }),
    onError: (e) => {
      console.log(e.message);
      setUpdateError(e.message);
      setUpdating(false);
    },
  });

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

      <Box>
        <TextField
          label="Start Price"
          variant="standard"
          type="number"
          margin="normal"
          value={price}
          mr={2}
          sx={styles.input}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          error={!!priceError}
          helperText={priceError}
          disabled={updating}
          onChange={({ target: { value } }) => {
            if (value < 1) {
              setPriceError("Must be at least $10");
              setPrice("");
            } else if (value < 10) {
              setPriceError("Must be at least $10");
              setPrice(Number(value));
            } else if (value > 1000) {
              setPrice(1000);
            } else {
              setPrice(Number(value));
              setPriceError(null);
            }
          }}
        />
        <TextField
          label="End Price"
          variant="standard"
          type="number"
          margin="normal"
          sx={styles.input}
          value={price * 5}
          disabled
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Box>

      <LoadingButton
        loading={updating}
        variant="contained"
        disabled={loading || !!priceError || price === defaultPrice}
        onClick={() => {
          setUpdating(true);
          setUpdateError(null);
          updatePricingMutation();
        }}
      >
        Update
      </LoadingButton>

      {updateError && (
        <Typography mt={2} sx={styles.error}>{updateError}</Typography>
      )}
    </section>
  );
}
