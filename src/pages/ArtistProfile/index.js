import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import * as ethers from "ethers";
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import waitForMintedTransaction from "../../utils/waitForMintedTransaction";

const ME_QUERY = gql`
  query me {
    me {
      id
      address
      email
      description
      collection {
          id
          description
          artistId
          address
          minted
          name
          instagram
          pendingFunds
      }
    }
  }
`;

const UPDATE_COLLECTION_MUTATION = gql`
  mutation update($input: UpdateCollectionInput!) {
    UpdateCollection(input: $input) {
      collection {
        id
        description
      }
    }
  }
`;

const WITHDRAW_MUTATION = gql`
  mutation withdraw($input: WithdrawInput!) {
    Withdraw(input: $input) {
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

const styles = {
  title: { marginBottom: "10px" },
  subtitle: { marginTop: "40px", marginBottom: "10px" },
  tooltipIcon: { pl: "8px" },
  description: { backgroundColor: "grey.100", marginBottom: "10px" },
  bold: { fontWeight: "bold" },
  link: { color: "black" },
  error: { color: "red", marginTop: "20px" },
  secondaryContainer: {
    maxWidth: "380px",
  },
  withdrawBtn: { marginTop: "20px" },
  startingKit: { marginTop: "30px", maxWidth: "250px" },
};

export default function ArtistProfile() {
  const [refetching, setRefetching] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);
  const [description, setDescription] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const { data, loading, error, refetch } = useQuery(ME_QUERY);

  const me = data?.me;

  useEffect(() => {
      document.title = `Profile | Supertrue`;
    },[],
  );

  useEffect(
    () => setDescription(me?.collection?.description || description),
    [data]
  );

  useEffect(() => {
    if (!refetching) {
      return;
    }
    if (data?.me?.collection?.pendingFunds === "0") {
      setRefetching(false);
      setWithdrawing(false);
      return;
    }

    setTimeout(refetch, 5000);
  }, [data, refetching]);

  const updateCollection = () => {
    setUpdating(true);
    updateCollectionMutation();
  };

  const [updateCollectionMutation] = useMutation(UPDATE_COLLECTION_MUTATION, {
    variables: { input: { description } },
    onCompleted: () => {
      setTimeout(() => setUpdating(false), 1500);
    },
    onError: (e) => {
      console.log(e.message);
      setUpdating(false);
    },
  });

  const [withdrawMutation] = useMutation(WITHDRAW_MUTATION, {
    variables: { input: { account: withdrawAddress } },
    onCompleted: ({ Withdraw: { tx } }) =>
      waitForMintedTransaction({ provider, tx }).then(({ error }) => {
        if (error) {
          setWithdrawError(error);
          setWithdrawing(false);
          return;
        }

        setRefetching(false);
        return refetch();
      }),
    onError: (e) => {
      console.log(e.message);
      setWithdrawError(e.message);
      setWithdrawing(false);
    },
  });

  const withdraw = () => {
    setWithdrawError(null);
    withdrawMutation();
  };

  const CURRENY_OF_FUNDS = "Matic";
  const CURRENY_OF_WITHDRAWAL = "USD";
  const EXCHANGE_RATE_MATIC_TO_USD = 0.61;
  const funds = !me?.collection?.pendingFunds
    ? 0
    : ethers.utils.formatEther(me.collection?.pendingFunds);

  const minimumWithdraw = 100;
  const hasMinimumFunds = funds > minimumWithdraw;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={styles.title}>
        BIO
        <Tooltip title="Write your fans a message and tell them how you may want to reward them for buying your Supertrue NFT.">
          <InfoOutlinedIcon fontSize="small" sx={styles.tooltipIcon} />
        </Tooltip>
      </Typography>
      <TextField
        placeholder="What do you want to share?"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        sx={styles.description}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={!me?.collection}
      />
      <Button
        variant="contained"
        onClick={updateCollection}
        disabled={loading || !me?.collection || updating}
      >
        Update
      </Button>
      {updating && <Typography>Updating...</Typography>}
      <Typography variant="h4" sx={styles.subtitle}>
        BALANCE & WITHDRAW
      </Typography>
      <Typography>
        {"You have "}
        <span style={styles.bold}>
          {`${Number(funds).toFixed(2)} ${CURRENY_OF_FUNDS} available (≈ ${
            (funds * EXCHANGE_RATE_MATIC_TO_USD).toFixed(2)
          } ${CURRENY_OF_WITHDRAWAL}) from ${
            me?.collection?.minted
          } NFT sales.`}
        </span>
        <br />
        {`Withdrawal available at ${minimumWithdraw} ${CURRENY_OF_FUNDS}.`}
      </Typography>
      <Typography sx={{ mt: "20px", mb: "20px" }}>
        Enter your crypto address below.{" "}
        <a href="#" style={styles.link}>
          Click here for more info about how to transfer to USD.
        </a>{" "}
        All transfers are final! Triple check your address.{" "}
      </Typography>
      <Box sx={styles.secondaryContainer}>
        <TextField
          fullWidth
          label="0x..."
          placeholder={me?.address}
          variant="standard"
          margin="normal"
          value={withdrawAddress}
          onChange={(e) => setWithdrawAddress(e.target.value.trim())}
          disabled={withdrawing || !hasMinimumFunds}
        />
      </Box>
      <Button
        variant="contained"
        onClick={withdraw}
        disabled={loading || withdrawing || !hasMinimumFunds}
        sx={styles.withdrawBtn}
      >
        Withdraw
      </Button>
      {withdrawError && (
        <Typography sx={styles.error}>{withdrawError}</Typography>
      )}

      <Typography variant="h4" sx={styles.subtitle}>
        SHARING KIT
      </Typography>
      <Typography>
        This is an image you can share on your instagram{" "}
      </Typography>
      {me?.collection?.artistId && (
        <img
          alt="Starting Kit Material"
          style={styles.startingKit}
          src={`https://supertrue-api.herokuapp.com/api/artist/${me.collection.artistId}/share`}
        />
      )}
    </Container>
  );
}
