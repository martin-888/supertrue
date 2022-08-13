import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import { isValidEmail } from "../../../utils/validate";
import DisabledSection from "./DisabledMintSection";

export default function ReservedArtistPage({
  reserve,
  email,
  setEmail,
  styles,
  igHandle,
  reservation,
  user,
  error,
  loading,
  mutationLoading
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  const placeInLine = reservation?.lineLength + 1 || '';

  const ReservationNotFound = ({igHandle}) => (
    <Box>
      <Typography variant="h2" mb={2}>Artist Reservation Not Found</Typography>
      <Typography variant="subtitle1">
        {igHandle} has not been reserved yet. Be the first!
      </Typography>
      <Button
        sx={styles.button}
        variant="contained"
        size="large"
        href="/reserve"
      >
        RESERVE {igHandle}
      </Button>
    </Box>
  );

  const ClaimCTA = ({igHandle}) => {
    const localStyles = {
      box: {
        display: "flex",
        alignItems: "center",
        padding: 2,
        marginBottom: 8,
        flexDirection: isMobile ? "column" : "row",
      },
      subtitle: {
        paddingRight: 2,
        fontWeight: 600,
        marginBottom: isMobile ? 2 : 'initial'
      }
    };

    return (
      <Paper elevation={2}>
        <Box sx={localStyles.box}>
          <Typography variant="subtitle1" sx={localStyles.subtitle}>
            Are you {igHandle}?
          </Typography>
          <Button
            size="large"
            variant="contained"
            href={`/claim/${igHandle}`}
          >
            CLAIM THIS PROFILE
          </Button>
        </Box>
      </Paper>
    )
  };

  return (
    <>
      {loading && (
        <Box sx={styles.centerContainer}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={styles.centerContainer}>
          <Typography variant="h2">
            `An error occurred getting reservation info for ${igHandle}, please refresh page.`
          </Typography>
        </Box>
      )}

      {!loading && !reservation && (
        <ReservationNotFound igHandle={igHandle}/>
      )}

      {reservation && (
        <>
          {!user?.collection?.id && <ClaimCTA igHandle={reservation.instagram}/>}
          <Box mb={6}>
            <DisabledSection igHandle={reservation.instagram} placeInLine={placeInLine} />
          </Box>
          <Box>
            <Typography variant="h2" mb={2}>RESERVE YOUR SPOT</Typography>
            <Typography variant="subtitle1">
              You'll be added to the allow list and keep your position in line when @{igHandle} joins. Currently, you're #{placeInLine} in line.
            </Typography>
            <Box sx={styles.secondaryContainer} mb={8}>
              <TextField
                fullWidth
                type="email"
                label="YOUR EMAIL"
                variant="standard"
                margin="normal"
                value={email}
                disabled={mutationLoading}
                onChange={({ target: { value } }) => setEmail(value.trim())}
              />
              <LoadingButton
                  sx={styles.button}
                  variant="contained"
                  size="large"
                  disabled={!isValidEmail(email)}
                  loading={mutationLoading}
                  onClick={() => reserve(igHandle)}
                >
                  RESERVE
                </LoadingButton>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}
