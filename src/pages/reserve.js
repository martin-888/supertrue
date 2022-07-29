import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button
} from "@mui/material";

export default function ReservePage() {
  const [instagramUrl, setInstagramUrl] = useState("");

  const styles = {
    container: {
      marginBottom: 8,
      marginTop: 8
    },
    secondaryContainer: {
      maxWidth: "380px",
    },
    button: {
      marginTop: 4,
    },
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Box>
        <Typography variant="h2" mb={2}>ADD ARTIST</Typography>
        <Box sx={styles.secondaryContainer} mb={8}>
          <TextField
            fullWidth
            label="INSTAGRAM URL"
            variant="standard"
            margin="normal"
            value={instagramUrl}
            onChange={({ target: { value } }) => setInstagramUrl(value.trim())}
          />
          <Button
              sx={styles.button}
              variant="contained"
              size="large"
              onClick={() => {
                /*
                1. call forthcoming endpoint to reserve artist
                2. on success, route user to /reserve/artistName
                */
              }}
              disabled={!instagramUrl}
            >
              Add Artist
            </Button>
        </Box>
      </Box>
    </Container>
  )
}
