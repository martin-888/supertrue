import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as ethers from "ethers";
import { gql, useMutation } from "@apollo/client";

import waitForMintedTransaction from "~/utils/waitForMintedTransaction";

const styles = {
  bold: { fontWeight: "bold" },
  link: { color: "black" },
  error: { color: "red", marginTop: 2 },
  secondaryContainer: {
    maxWidth: "380px",
  },
};

export const BALANCE_USER_FRAGMENT = gql`
  fragment BalanceUserFragment on User {
    id
    address
    collection {
      id
      pendingFunds
      minted
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

const minimumWithdraw = 100;

const NETWORK = ENV.NETWORK;
const INFURA_KEY = ENV.INFURA_KEY;

const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_KEY);

export type BalanceProps = {
  loading: boolean;
  user: any;
  startPolling: (ms: number) => void;
  stopPolling: () => void;
};

export default function Balance({
  user,
  startPolling,
  stopPolling,
  loading,
}: BalanceProps) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawAddress, setWithdrawAddress] = useState("");

  useEffect(() => {
    if (user?.collection?.pendingFunds === "0") {
      stopPolling();
      setWithdrawing(false);
    }
  }, [user]);

  const [withdrawMutation] = useMutation(WITHDRAW_MUTATION, {
    variables: { input: { account: withdrawAddress } },
    onCompleted: ({ Withdraw: { tx } }) =>
      waitForMintedTransaction({ provider, tx }).then(({ error }) => {
        if (error) {
          setWithdrawError(error);
          setWithdrawing(false);
          return;
        }

        startPolling(5000);
      }),
    onError: (e) => {
      console.log(e.message);
      setWithdrawError(e.message);
      setWithdrawing(false);
    },
  });

  const withdraw = () => {
    setWithdrawing(true);
    setWithdrawError(null);
    withdrawMutation();
  };

  const CURRENY_OF_FUNDS = "Matic";
  const CURRENY_OF_WITHDRAWAL = "USD";
  const EXCHANGE_RATE_MATIC_TO_USD = 0.61;
  const funds = !user?.collection?.pendingFunds
    ? 0
    : Number(ethers.utils.formatEther(user.collection?.pendingFunds));

  const hasMinimumFunds = funds > minimumWithdraw;

  return (
    <section>
      <Typography variant="h3" mb={2}>
        BALANCE & WITHDRAW
      </Typography>
      <Typography mb={1}>
        You have{" "}
        <span style={styles.bold}>
          {funds.toFixed(2)} {CURRENY_OF_FUNDS} available (≈{" "}
          {(funds * EXCHANGE_RATE_MATIC_TO_USD).toFixed(2)}{" "}
          {CURRENY_OF_WITHDRAWAL})
        </span>{" "}
        from {user?.collection?.minted} NFT sales.
      </Typography>
      <Typography mb={1} style={styles.bold}>
        Withdrawal available at {minimumWithdraw} {CURRENY_OF_FUNDS}.
      </Typography>
      {hasMinimumFunds && (
        <>
          <Typography mb={1}>Enter your crypto address below.</Typography>
          <Box sx={styles.secondaryContainer} mb={1}>
            <TextField
              fullWidth
              label="0x..."
              placeholder={user?.address}
              variant="standard"
              margin="normal"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value.trim())}
              disabled={withdrawing || !hasMinimumFunds}
            />
          </Box>
          <Typography mb={1}>
            All transfers are final! Double check your address.
          </Typography>
          <LoadingButton
            loading={withdrawing}
            variant="contained"
            onClick={withdraw}
            disabled={loading || !hasMinimumFunds}
          >
            Withdraw
          </LoadingButton>
          {withdrawError && (
            <Typography sx={styles.error}>{withdrawError}</Typography>
          )}
        </>
      )}
    </section>
  );
}
