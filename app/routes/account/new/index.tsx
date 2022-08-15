import React, { useEffect, useState } from "react";
import type { LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
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
import { useProvider } from "wagmi";
import copy from "copy-to-clipboard";
import LoadingButton from "@mui/lab/LoadingButton";

import { sendToSentry } from "~/utils/sentry";
import waitForMintedTransaction from "~/utils/waitForMintedTransaction";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("token")) {
    return redirect("/account/login?redirect=/account/new");
  }

  return null;
};

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
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  const { handle } = useParams();
  const navigate = useNavigate();
  const provider = useProvider();
  const [refetching, setRefetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [instagram, setInstagram] = useState(handle || "");
  const [instagramValid, setInstagramValid] = useState(true);
  const [createCollectionError, setCreateCollectionError] = useState<
    string | null
  >(null);
  const [isTxError, setIsTxError] = useState(false);
  const { data, loading, startPolling, stopPolling } = useQuery(ME_QUERY);

  const me = data?.me;
  const instagramData = data?.me?.collection?.instagram;
  const existingCollectionMatchesUrlHandle =
    handle?.length > 0 && instagramData?.length > 0 && instagramData === handle;

  useEffect(() => {
    if (!data?.me?.collection?.id) {
      return;
    }

    setCreating(false);
    stopPolling();
    const timerId = setTimeout(
      () => navigate("/account/settings", { replace: true }),
      5000
    );

    return () => clearTimeout(timerId);
  }, [data, navigate, stopPolling]);

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
      sendToSentry(e);
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

  if (handle && instagramData && !existingCollectionMatchesUrlHandle) {
    return (
      <Container maxWidth="md" sx={styles.centerContent}>
        <Typography variant="body1" mb={2}>
          You're not eligible to claim this collection because your account is
          already associated with another collection.
        </Typography>
        <Button variant="contained" href="/">
          Go To Homepage
        </Button>
      </Container>
    );
  }

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

  if (me?.collection?.id) {
    return (
      <Container maxWidth="md">
        <Typography variant="h2" mb={2}>
          COLLECTION CREATED
        </Typography>
        <Box sx={styles.infoBox}>
          <Typography paragraph>
            Collection has been successfully created!
          </Typography>
          <Typography paragraph>
            Verification message can be now deleted from your instagram.
          </Typography>
          <Typography paragraph>
            You are being redirected, please wait...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (refetching) {
    return (
      <Container maxWidth="md">
        <Typography paragraph>
          Your profile is being created on blockchain.
        </Typography>
        <Typography paragraph>
          Please wait 1-3 minutes and check this page again.
        </Typography>
      </Container>
    );
  }

  const VERIFY_SENTENCE = `Verifying my Supertrue.com:${me?.address || "?"}`;

  return (
    <Container maxWidth="md">
      <Typography variant="h2" mb={2}>
        CREATE PROFILE
      </Typography>
      <Box sx={styles.secondaryContainer} mb={8}>
        <TextField
          fullWidth
          label="YOUR NAME"
          helperText="Your name will appear on your NFT"
          variant="standard"
          margin="normal"
          value={name}
          onChange={({ target: { value } }) => setName(value.slice(0, 30))}
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
            setUsername(
              value.trim().toLowerCase().slice(0, 30).replace(" ", "")
            )
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
            disabled={(handle || "").length > 0 || me?.collection || creating}
            onChange={({ target: { value } }) =>
              setInstagram(value.trim().slice(0, 30))
            }
          />
        </Box>
        <Box sx={styles.infoBox}>
          <Typography>
            Copy & paste the following text EXACTLY into your instagram bio and
            then hit Verify & Create. (Yes you can change it immediately
            afterwards.)
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
