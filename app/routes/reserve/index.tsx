import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, TextField } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import LoadingButton from '@mui/lab/LoadingButton';

import { sendToSentry } from "~/utils/sentry";
import { isValidEmail } from "~/utils/validate";
import DisabledMintSection from "~/components/DisabledMintSection";

const RESERVE_COLLECTION_MUTATION = gql`
    mutation reserveArtist($input:ReserveCollectionInput!) {
        ReserveCollection(input:$input) {
            position
        }
    }
`;

const RESERVATION_QUERY = gql`
    query getReservation($instagram: String!, $skipReservation: Boolean!) {
        me {
            id
            email
            collection {
                id
            }
        }
        reservation(instagram: $instagram) @skip(if: $skipReservation) {
            instagram
            lineLength
        }
    }
`;

export const meta: MetaFunction = () => {
  return {
    title: "Reserve Artist | Supertrue"
  };
};

const styles = {
  container: {
    marginTop: 0
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

export default function Reserve() {
  const [email, setEmail] = useState("");
  const [reserveStatus, setReserveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [igHandle, setIgHandle] = useState("");

  const { data } = useQuery(RESERVATION_QUERY, {
    variables: { instagram: igHandle || "", skipReservation: !igHandle }
  });

  useEffect(() => {
      if (email === "" && data?.me?.email) {
        setEmail(data.me.email)
      }
    },
    [email, data]
  );

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
          instagram
        }
      },
    });
    setIsLoading(false);
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Box mb={6}>
        <DisabledMintSection igHandle={igHandle} />
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
            disabled={isLoading}
            value={igHandle}
            onChange={({ target: { value } }) => setIgHandle(value.trim().toLowerCase().slice(0,32))}
          />
          <TextField
            fullWidth
            type="email"
            label="YOUR EMAIL"
            variant="standard"
            margin="normal"
            disabled={isLoading}
            value={email}
            onChange={({ target: { value } }) => setEmail(value.trim())}
          />
          <LoadingButton
            sx={styles.button}
            variant="contained"
            size="large"
            disabled={!igHandle || !isValidEmail(email)}
            loading={isLoading}
            onClick={() => reserve(igHandle)}
          >
            Add Artist
          </LoadingButton>
        </Box>
      </Box>
      <Typography paragraph>{reserveStatus}</Typography>
    </Container>
  )
}
