import React, { useEffect } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { gql } from '~/__generated__/gql';

import FAQ from "./FAQ";

const ME_QUERY = gql(`
  query meClaim {
    me {
      id
      collection {
        id
        name
        artistId
        username
      }
    }
  }
`);

const RESERVATION_QUERY = gql(`
  query getReservationHandle($instagram: String!) {
    reservation(instagram: $instagram) {
      instagram
      lineLength
      collection {
        name
      }
    }
  }
`);

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    marginTop: 4,
    marginBottom: 4,
    maxWidth: 360,
  },
};

export default function ClaimPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading } = useQuery(ME_QUERY);
  const instagram = location.pathname.split("/")[2];
  const { data: reservationData, loading: reservationDataLoading } = useQuery(
    RESERVATION_QUERY,
    {
      variables: { instagram },
    }
  );
  const lineLength = reservationData?.reservation?.lineLength;

  //check if reservation exists or already claimed
  useEffect(() => {
    if (!reservationDataLoading && !reservationData?.reservation)
      navigate(`/reserve/${instagram}`);

    const artistName = reservationData?.reservation?.collection?.name;
    if (artistName) navigate(`/${artistName}`);
  }, [reservationData, reservationDataLoading, navigate, instagram]);

  if (loading || reservationDataLoading) {
    return (
      <Box sx={styles.center}>
        <CircularProgress />
      </Box>
    );
  }

  if (data?.me?.collection?.name) {
    return (
      <Container maxWidth="md">
        <Typography variant="body1" mb={2}>
          You're not eligible to claim this collection because your account is
          already associated with another collection.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box>
        <Box mb={4}>
          <FAQ instagram={instagram || ""} lineLength={lineLength || 0} />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Button
            sx={styles.button}
            size="large"
            variant="contained"
            href={`/account/new/${instagram}`}
            fullWidth
          >
            Claim Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
