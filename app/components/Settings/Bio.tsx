import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { gql, useMutation } from "@apollo/client";

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

const styles = {
  description: { backgroundColor: "grey.100", marginBottom: 1 },
  bold: { fontWeight: "bold" },
  container: {
    maxWidth: "sm",
  },
};

export default function Bio({ defaultDescription, loading, hasCollection }) {
  const [updating, setUpdating] = useState(false);
  const [description, setDescription] = useState(defaultDescription);

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

  const updateCollection = () => {
    setUpdating(true);
    updateCollectionMutation();
  };

  return (
    <section>
      <Box sx={styles.container}>
        <Typography variant="h3" mb={2}>
          BIO
        </Typography>
        <Typography mb={2}>
          Write your fans a message and tell them how you may want to reward
          them for buying your Supertrue NFT.
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
          disabled={!hasCollection}
        />
        <LoadingButton
          loading={updating}
          variant="contained"
          onClick={updateCollection}
          disabled={
            loading || !hasCollection || description === defaultDescription
          }
        >
          Save
        </LoadingButton>
      </Box>
    </section>
  );
}
