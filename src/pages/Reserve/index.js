import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
} from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";

import { sendToSentry } from "../../utils/sentry";
import ReservePage from "./components/Reserve";
import ReservedArtistPage from "./components/ReservedArtist";

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
  const location = useLocation();
  const igHandle = location.pathname.split("/")[2];

  const { data, loading, error } = useQuery(RESERVATION_QUERY, {
    variables: { instagram: igHandle || "", skipReservation: !igHandle }
  });

  useEffect(() => email === "" && data?.me?.email && setEmail(data.me.email),
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

  const reserve = async (igHandle) => {
    setIsLoading(true);
    setReserveStatus("");
    await reserveCollectionMutation({
      variables: {
        input: {
          email,
          instagram: igHandle
        }
      },
    });
    setIsLoading(false);
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      {igHandle ? (
        <ReservedArtistPage
          reserve={reserve}
          email={email}
          setEmail={setEmail}
          styles={styles}
          loading={loading}
          igHandle={igHandle}
          error={error}
          reservation={data?.reservation}
          user={data?.me}
          mutationLoading={isLoading}
        />
      ) : (
        <ReservePage
          reserve={reserve}
          email={email}
          setEmail={setEmail}
          styles={styles}
          loading={loading}
          mutationLoading={isLoading}
        />
      )}
      <Typography paragraph>{reserveStatus}</Typography>
    </Container>
  )
}
