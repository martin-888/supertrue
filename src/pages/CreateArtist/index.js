import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import copy from 'copy-to-clipboard';
import LoadingButton from '@mui/lab/LoadingButton';

import useWeb3Modal from "../../hooks/useWeb3Modal";
import waitForMintedTransaction from "../../utils/waitForMintedTransaction";
import Pricing from "./sections/Pricing";

const styles = {
  infoBox: {
    marginBottom: 4,
    maxWidth: "750px",
  },
  secondaryContainer: {
    maxWidth: "380px",
  },
  verifySentence: {
    overflow: "hidden",
    whiteSpace: "wrap",
    textOverflow: "ellipsis",
    fontWeight: 600,
  },
};

const ME_QUERY = gql`
  query me {
    me {
      id
      address
      email
      description
      collection {
          id
          artistId
          address
          name
          instagram
          startPriceCents
      }
    }
  }
`;

const CREATE_COLLECTION_MUTATION = gql`
  mutation createCollection($input: CreateCollectionInput!) {
    CreateCollection(input: $input) {
      tx
    }
  }
`;

export default function CreateArtist() {
  const navigate = useNavigate();
  const { account, provider } = useWeb3Modal();
  const [refetching, setRefetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [instagram, setInstagram] = useState("");
  const [instagramValid, setInstagramValid] = useState(true);
  const [createCollectionError, setCreateCollectionError] = useState(null);
  const [isTxError, setIsTxError] = useState(false);
  const { data, loading, startPolling, stopPolling } = useQuery(ME_QUERY);

  const me = data?.me;

  useEffect(() => {
      document.title = `Create Artist | Supertrue`;
    },[],
  );

  useEffect(() => {
    if (!refetching) {
      return;
    }

    if (data?.me?.collection?.id) {
      setRefetching(false);
      setCreating(false);
      stopPolling();
    }
  }, [data, refetching]);

  const [createCollectionMutation] = useMutation(CREATE_COLLECTION_MUTATION, {
    onCompleted: async ({ CreateCollection: { tx } }) => {
      const { success } = await waitForMintedTransaction({ tx, provider });

      if (!success) {
        setIsTxError(true);
        setCreating(false);
        return;
      }

      setRefetching(true);
      startPolling(5000);
    },
    onError: (e) => {
      setCreateCollectionError(e.message);
      setInstagramValid(!e?.message.toLowerCase().includes("instagram"));
      setCreating(false);
    },
  });

  const verifyCreate = () => {
    setCreateCollectionError(null);
    setInstagramValid(true);
    setCreating(true);
    setIsTxError(false);
    createCollectionMutation({
      variables: { input: { instagram, account: me.address, name, username } },
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography variant="h2" mb={2}>
          CREATE PROFILE
        </Typography>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!account && (!loading && !me?.address)) {
    return (
      <Container maxWidth="md">
        <Typography mb={2}>
          Please log in to create your profile.
        </Typography>
      </Container>
    );
  }

  if (me?.collection) {
    return (
      <Container maxWidth="md">
        <Typography variant="h2" mb={2}>COLLECTION CREATED</Typography>
        <Box sx={styles.infoBox}>
          <Typography>
            Your collection was successfully created! You can now delete verification message from your instagram.
          </Typography>
        </Box>

        <Pricing
          loading={loading}
          startPolling={startPolling}
          stopPolling={stopPolling}
          defaultPrice={Math.trunc((me.collection?.startPriceCents || 1000)/100)}
          artistId={me.collection?.artistId}
        />
      </Container>
    );
  }

  const VERIFY_SENTENCE = `Verifying my Supertrue.com:${me?.address || "?"}`;

  return (
    <Container maxWidth="md">
      <Typography variant="h2" mb={2}>CREATE PROFILE</Typography>
      <Box sx={styles.secondaryContainer} mb={8}>
        <TextField
          fullWidth
          label="YOUR NAME"
          helperText="Your name will appear on your NFT"
          variant="standard"
          margin="normal"
          value={name}
          onChange={({ target: { value } }) => setName(value.slice(0,30))}
          disabled={me?.collection || creating}
        />
        <TextField
          fullWidth
          label="YOUR SUPERTRUE USERNAME"
          helperText="Your username will define the link to your profile"
          variant="standard"
          margin="normal"
          value={username}
          disabled={me?.collection || creating}
          onChange={({ target: { value } }) =>
            setUsername(value.trim().toLowerCase().slice(0,30).replace(" ", ""))
          }
        />
      </Box>

      <Box mb={8}>
        <Typography variant="h3" mb={2}>
          VERIFY INSTAGRAM
        </Typography>
        <Typography mb={2}>
          We verify instagram to help your fans trust your identity.
        </Typography>
        <Box sx={styles.secondaryContainer} mb={4}>
          <TextField
            fullWidth
            error={!instagramValid}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
            label="Your Instagram Handle"
            placeholder="yourinstagram"
            variant="standard"
            margin="normal"
            value={instagram}
            disabled={me?.collection || creating}
            onChange={({ target: { value } }) =>
              setInstagram(value.trim().slice(0,30))
            }
          />
        </Box>
        <Box sx={styles.infoBox}>
          <Typography>
            Copy & paste the following text EXACTLY into your instagram
            bio and then hit Verify & Create. (Yes you can change it
            immediately afterwards.)
          </Typography>
        </Box>
        <Typography sx={styles.verifySentence} mb={2}>
          {VERIFY_SENTENCE}
        </Typography>
        <Button
          size="large"
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={() => copy(VERIFY_SENTENCE)}
          value={`Verifying my Supertrue.com:${me?.address || "?"}`}
        >
          Copy to clipboard
        </Button>
      </Box>

      <Box sx={styles.secondaryContainer}>
        <LoadingButton
          loading={creating}
          onClick={verifyCreate}
          disabled={!name.length || !instagram.length}
          size="large"
          variant="contained"
          fullWidth
          mb={2}
        >
          Verify & Create Profile
        </LoadingButton>
        {creating && (
          <Typography>
            Creating collection on blockchain. Please wait...
          </Typography>
        )}
        {createCollectionError && (
          <Typography color="red">Error: {createCollectionError}</Typography>
        )}
        {isTxError && (
          <Typography color="red">
            Error: Create collection transaction failed
          </Typography>
        )}
      </Box>
    </Container>
  );
}
