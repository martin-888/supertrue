import React, {useEffect, useMemo, useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
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

const CREATE_COLLECTION_MUTATION = gql`
    mutation createCollection(
        $input: CreateCollectionInput!
    ) {
        CreateCollection(input: $input) {
            tx
        }
    }
`;

export default function CreateArtist({ provider }) {
  const [refetching, setRefetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [instagram, setInstagram] = useState("");
  const [createCollectionError, setCreateCollectionError] = useState(null);
  const [isTxError, setIsTxError] = useState(false);
  const address = localStorage.getItem("address");
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address
  });

  const me = useMemo(() => ({
    ...data?.me,
    ...data?.dbMe
  }), [data]);

  useEffect(() => {
    if (!refetching) {
      return;
    }
    if (data?.me?.collection?.id) {
      setRefetching(false);
      setCreating(false);
      return;
    }

    setTimeout(refetch,5000);
  }, [data, refetching]);

  const [createCollectionMutation] = useMutation(CREATE_COLLECTION_MUTATION, {
    onCompleted: async ({ CreateCollection: { tx } }) => {
      const { success } = await waitForMintedTransaction({ tx, provider })

      if (!success) {
        setIsTxError(true);
        setCreating(false);
        return;
      }

      setRefetching(true);
      await refetch();
    },
    onError: e => {
      setCreateCollectionError(e.message);
      setCreating(false);
    }
  });

  const verifyCreate = () => {
    setCreateCollectionError(null);
    setCreating(true);
    setIsTxError(false);
    createCollectionMutation({ variables: { input: { instagram, account: me.address, name, username } } })
  };

  if (loading) {
    return (
      <div>
        <h3>Create Artist</h3>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h3>Create Artist Collection</h3>
      {me?.collection ? <p>Artist collection already created</p> : <p>Artist collection not yet created</p> }
      <p>Copy and paste the following text EXACTLY into your instagram bio and then hit claim. (Yes you can change it immediately afterwards.)</p>
      <p>Verifying my Supertrue.com:{me?.address || "?"}</p>
      Your name: <input value={name} onChange={e => setName(e.target.value)} disabled={me?.collection} /><br/>
      Your username: <input value={username} onChange={e => setUsername(e.target.value)} disabled={me?.collection} /><br/>
      Your instagram: <input value={instagram} onChange={e => setInstagram(e.target.value)} disabled={me?.collection} /><br/>
      {creating && <p>Creating collection on blockchain</p>}
      {createCollectionError && <p>Error: {createCollectionError}</p>}
      {isTxError && <p>Error: Create collection transaction failed</p>}
      <button onClick={verifyCreate} disabled={!name.length || !username.length || !instagram.length || creating}>Verify & Create</button><br/>
    </div>
  );
}
