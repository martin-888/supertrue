import React, { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { useMutation, useQuery } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Container,
  Typography,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import { gql } from '~/__generated__/gql';

import { sendToSentry } from "~/utils/sentry";
import { isValidEmail } from "~/utils/validate";
import DisabledMintSection from "~/components/DisabledMintSection";

const RESERVE_COLLECTION_MUTATION = gql(`
  mutation reserveArtist($input: ReserveCollectionInput!) {
    ReserveCollection(input: $input) {
      position
    }
  }
`);

const RESERVATION_QUERY = gql(`
  query getReservationReserveHandle($instagram: String!) {
    me {
      id
      email
      collection {
        id
      }
    }
    reservation(instagram: $instagram) {
      instagram
      lineLength
    }
  }
`);

const styles = {
  container: {
    marginTop: 0,
  },
  secondaryContainer: {
    maxWidth: "380px",
    marginBottom: 1,
  },
  centerContainer: {
    textAlign: "center",
  },
  button: {
    marginTop: 4,
  },
};

export default function ReserveHandle() {
  const [email, setEmail] = useState("");
  const [reserveStatus, setReserveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const igHandle = params.handle;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  const { data, loading, error } = useQuery(RESERVATION_QUERY, {
    variables: { instagram: igHandle || "" },
  });

  const reservation = data?.reservation;
  const user = data?.me;
  const placeInLine = (reservation?.lineLength + 1).toString() || "";

  useEffect(() => {
    if (email === "" && data?.me?.email) {
      setEmail(data.me.email);
    }
  }, [email, data]);

  const [reserveCollectionMutation] = useMutation(RESERVE_COLLECTION_MUTATION, {
    onCompleted: () => {
      setReserveStatus("Your spot has been reserved!");
    },
    onError: (e) => {
      setReserveStatus(e.message);
      sendToSentry(e);
      console.log(`reserveCollectionMutation error: ${e}`);
    },
  });

  const reserve = async (instagram: string) => {
    setIsLoading(true);
    setReserveStatus("");
    await reserveCollectionMutation({
      variables: {
        input: {
          email,
          instagram,
        },
      },
    });
    setIsLoading(false);
  };

  const ReservationNotFound = ({ igHandle }: { igHandle: string }) => (
    <Box>
      <Typography variant="h2" mb={2}>
        Artist Reservation Not Found
      </Typography>
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

  const ClaimCTA = ({ igHandle }: { igHandle: string }) => {
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
        marginBottom: isMobile ? 2 : "initial",
      },
    };

    return (
      <Paper elevation={2}>
        <Box sx={localStyles.box}>
          <Typography variant="subtitle1" sx={localStyles.subtitle}>
            Are you {igHandle}?
          </Typography>
          <Button size="large" variant="contained" href={`/claim/${igHandle}`}>
            CLAIM THIS PROFILE
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      {loading && (
        <Box sx={styles.centerContainer}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={styles.centerContainer}>
          <Typography variant="h2">
            `An error occurred getting reservation info for ${igHandle}, please
            refresh page.`
          </Typography>
        </Box>
      )}

      {!loading && !reservation && <ReservationNotFound igHandle={igHandle!} />}

      {reservation && (
        <>
          {!user?.collection?.id && (
            <ClaimCTA igHandle={reservation.instagram} />
          )}
          <Box mb={6}>
            <DisabledMintSection
              igHandle={reservation.instagram}
              placeInLine={placeInLine}
            />
          </Box>
          <Box>
            <Typography variant="h2" mb={2}>
              RESERVE YOUR SPOT
            </Typography>
            <Typography variant="subtitle1">
              You'll be added to the allow list and keep your position in line
              when @{igHandle} joins. Currently, you're #{placeInLine} in line.
            </Typography>
            <Box sx={styles.secondaryContainer} mb={8}>
              <TextField
                fullWidth
                type="email"
                label="YOUR EMAIL"
                variant="standard"
                margin="normal"
                value={email}
                disabled={isLoading}
                onChange={({ target: { value } }) => setEmail(value.trim())}
              />
              <LoadingButton
                sx={styles.button}
                variant="contained"
                size="large"
                disabled={!isValidEmail(email)}
                loading={isLoading}
                onClick={() => reserve(igHandle!)}
              >
                RESERVE
              </LoadingButton>
            </Box>
          </Box>
        </>
      )}
      <Typography paragraph>{reserveStatus}</Typography>
    </Container>
  );
}
