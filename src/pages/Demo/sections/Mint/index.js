import React, { useState } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

const ME_QUERY = gql`
    query me($address: ID!) {
        currentAddress
        dbMe {
            address
            email
        }
        me: user(id: $address) {
            collection {
                artistId
                address
                minted
                name
            }
        }
    }
`;

const CREATE_CHECKOUT_LINK_MUTATION = gql`
    mutation createCheckoutLink(
        $input: CreateCheckoutLinkInput!
    ) {
        CreateCheckoutLink(input: $input) {
            link
        }
    }
`;

export default function Mint({ provider }) {
  const [isPurchaseTabOpened, setIsPurchaseTabOpened] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [createLinkError, setCreateLinkError] = useState();
  const address = localStorage.getItem("address");
  const { data, loading, error } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address
  });

  const [createCheckoutLinkMutation] = useMutation(CREATE_CHECKOUT_LINK_MUTATION, {
    onCompleted: ({ CreateCheckoutLink: { link } }) => {
      window.open(link, '_blank');
      setIsPurchaseTabOpened(true);
    },
    onError: e => {
      setCreateLinkError(e.message);
      console.log("error", e)
      setWaiting(false);
    }
  });

  const mint = () => {
    setWaiting(true);
    const collectionAddress = data.me.collection.address;
    createCheckoutLinkMutation({ variables: { input: { collectionAddress } } });
  }

  if (loading) {
    return (
      <div>
        <h3>Mint</h3>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h3>Mint</h3>
      {!data?.dbMe && <p>You've to be login for minting</p>}
      {isPurchaseTabOpened && <p>Finish your purchase in opened tab.</p>}
      <button disabled={!data?.me?.collection || waiting} onClick={mint}>Mint my NFT</button>
    </div>
  );
}
