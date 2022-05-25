import React, {useMemo, useState, useEffect} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import * as ethers from "ethers";

import waitForMintedTransaction from "../../../../utils/waitForMintedTransaction";

const ME_QUERY = gql`
    query me($address: ID!) {
        currentAddress
        dbMe {
            id
            address
            email
            description
        }
        me: user(id: $address) {
            email
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
    mutation update(
        $input: UpdateCollectionInput!
    ) {
        UpdateCollection(input: $input) {
            collection {
                id
                description
            }
        }
    }
`;

const WITHDRAW_MUTATION = gql`
    mutation withdraw(
        $input: WithdrawInput!
    ) {
        Withdraw(input: $input) {
            tx
        }
    }
`;

const minimumWithdraw = 100*1e18;

export default function MyProfile({ provider }) {
  const [refetching, setRefetching] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);
  const [description, setDescription] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const address = localStorage.getItem("address");
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address
  });

  const me = useMemo(() => ({
    ...data?.me,
    ...data?.dbMe
  }), [data]);

  useEffect(() => setDescription(me?.collection?.description || description), [data]);

  useEffect(() => {
    if (!refetching) {
      return;
    }
    if (data?.me?.collection?.pendingFunds === "0") {
      setRefetching(false);
      setWithdrawing(false);
      return;
    }

    setTimeout(refetch,5000);
  }, [data, refetching]);

  const [updateCollectionMutation] = useMutation(UPDATE_COLLECTION_MUTATION, {
    variables: { input: { description } },
    onCompleted: () => {
      setUpdating(false);
    },
    onError: e => {
      console.log(e.message);
      setUpdating(false);
    }
  });

  const [withdrawMutation] = useMutation(WITHDRAW_MUTATION, {
    variables: { input: { account: withdrawAddress } },
    onCompleted: ({ Withdraw: { tx } }) =>
      waitForMintedTransaction({ provider, tx })
      .then(({ error }) => {
        if (error) {
          setWithdrawError(error);
          setWithdrawing(false);
          return;
        }

        setRefetching(false);
        return refetch();
      }),
    onError: e => {
      console.log(e.message);
      setWithdrawError(e.message);
      setWithdrawing(false);
    }
  });

  const withdraw = () => {
    setWithdrawError(null);
    withdrawMutation();
  }

  if (loading) {
    return (
      <div>
        <h3>My Profile</h3>
        Loading...
      </div>
    );
  }

  const hasMinimumFunds = me?.collection?.pendingFunds < minimumWithdraw;

  return (
    <div>
      <h3>My Profile</h3>
      email: {me?.email}<br />
      address: {me?.address}<br />
      collection address: {me?.collection?.address}<br />
      collection minted: {me?.collection?.minted}<br />
      collection name: {me?.collection?.name}<br />
      collection instagram: {me?.collection?.instagram}<br />
      description: <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        disabled={!me?.collection}
      /><br />
      {updating && <p>Updating...</p>}
      <button
        onClick={updateCollectionMutation}
        disabled={!me?.collection}
      >Save Description</button>
      <br /><br />
      Your funds: {!me.pendingFunds ? 0 : ethers.utils.formatEther(me.pendingFunds)}<br />
      Minimum allowed withdraw: {ethers.utils.formatEther(minimumWithdraw.toString())}<br />
      Is withdraw available: {!hasMinimumFunds ? "No" : "Yes"}<br />
      Withdraw to (address): <input
        value={withdrawAddress}
        onChange={e => setWithdrawAddress(e.target.value.trim())}
        type="text"
        disabled={withdrawing || !hasMinimumFunds}
        /><br />
      {withdrawError && <p>{withdrawError}</p>}
      <button
        onClick={withdraw}
        disabled={withdrawing || !hasMinimumFunds}
      >Withdraw</button>
    </div>
  );
}
