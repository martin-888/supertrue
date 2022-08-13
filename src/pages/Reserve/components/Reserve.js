import { useState } from "react";
import {
  Box,
  Typography,
  TextField
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import { isValidEmail } from "../../../utils/validate";
import DisabledSection from "./DisabledMintSection";

export default function ReservePage({
  reserve,
  email,
  setEmail,
  styles,
  loading,
  mutationLoading
}) {
  const [igHandle, setIgHandle] = useState("");
  return (
    <>
      <Box mb={6}>
        <DisabledSection igHandle={igHandle} />
      </Box>
      <Box>
        <Typography variant="h2" mb={2}>RESERVE YOUR SPOT</Typography>
        <Typography variant="subtitle1" className="explanation" mb={2}>
          Follow your favorite artists to receive a dated NFT with your Supertrue follower number. You'll be first on the allow list when they join!
        </Typography>
        <Box sx={styles.secondaryContainer} mb={8}>
          <TextField
            fullWidth
            label="ARTIST'S INSTAGRAM HANDLE"
            variant="standard"
            margin="normal"
            disabled={mutationLoading}
            value={igHandle}
            onChange={({ target: { value } }) => setIgHandle(value.trim().toLowerCase().slice(0,32))}
          />
          <TextField
            fullWidth
            type="email"
            label="YOUR EMAIL"
            variant="standard"
            margin="normal"
            disabled={mutationLoading}
            value={email}
            onChange={({ target: { value } }) => setEmail(value.trim())}
          />
          <LoadingButton
              sx={styles.button}
              variant="contained"
              size="large"
              disabled={!igHandle || !isValidEmail(email)}
              loading={mutationLoading}
              onClick={() => reserve(igHandle)}
            >
              Add Artist
            </LoadingButton>
        </Box>
      </Box>
    </>
  )
}
