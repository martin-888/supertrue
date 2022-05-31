import React, { useEffect, useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import waitForMintedTransaction from "../../utils/waitForMintedTransaction";
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";

const styles = {
  title: { marginBottom: "10px" },
  subtitle: { marginTop: "40px", marginBottom: "10px" },
  infoBox: {
    padding: "10px 0px",
    marginTop: "10px",
    marginBottom: "10px",
  },
  secondaryContainer: {
    maxWidth: "380px",
  },
  button: { marginTop: "40px", marginBottom: "20px" },
  verifyButtonPrefix: {
    fontWeight: "bold",
    fontSize: "0.7rem",
    marginRight: "15px",
  },
};

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
  mutation createCollection($input: CreateCollectionInput!) {
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
  const [instagramValid, setInstagramValid] = useState(true);
  const [createCollectionError, setCreateCollectionError] = useState(null);
  const [isTxError, setIsTxError] = useState(false);
  const address = localStorage.getItem("address");
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address,
  });

  const me = useMemo(
    () => ({
      ...data?.me,
      ...data?.dbMe,
    }),
    [data]
  );

  useEffect(() => {
    if (!refetching) {
      return;
    }
    if (data?.me?.collection?.id) {
      setRefetching(false);
      setCreating(false);
      return;
    }

    setTimeout(refetch, 5000);
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
      await refetch();
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
        <h3>Create Artist</h3>
        Loading...
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h2" sx={styles.title}>
          CREATE ARTIST PROFILE
        </Typography>
        <Box sx={styles.secondaryContainer}>
          <TextField
            fullWidth
            label="YOUR ARTIST NAME"
            placeholder="HOLY HIVE"
            helperText="Your artist name will appear on your NFT."
            variant="standard"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={me?.collection}
          />
          <TextField
            fullWidth
            label="YOUR SUPERTRUE USERNAME"
            placeholder="HOLYHIVE"
            helperText="Your username will define the link to your profile."
            variant="standard"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={me?.collection}
          />
        </Box>
        <Typography variant="h4" sx={styles.subtitle}>
          VERIFY INSTAGRAM{" "}
          <Tooltip title="We verify instagram to help your fans trust your identity">
            <HelpCenterIcon fontSize="small" />
          </Tooltip>
        </Typography>
        <Box sx={styles.secondaryContainer}>
          <TextField
            fullWidth
            error={!instagramValid}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
            label="Instagram Handle"
            placeholder="holyhivemusic"
            variant="standard"
            margin="normal"
            disabled={me?.collection}
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </Box>
        {me?.collection ? (
          <Box sx={styles.infoBox}>
            <Typography>
              Your Artist collection was sucessfully created! You can now delete
              "Verifying my Supertrue.com:0x..." from your instagram bio.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={styles.infoBox}>
              <Typography>
                Copy and paste the following text EXACTLY into your instagram
                bio and then hit Verify & Create. (Yes you can change it
                immideately afterwards.)
              </Typography>
            </Box>
            <Button
              fullWidth
              multi
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={(e) => {
                navigator.clipboard.writeText(e.target.value);
              }}
              value={`Verifying my Supertrue.com:${me?.address || "?"}`}
            >
              <span style={styles.verifyButtonPrefix}>CLICK TO Copy</span>
              Verifying my Supertrue.com:{me?.address.slice(0, 6) || "?"}...
            </Button>
          </>
        )}
        <Box sx={styles.secondaryContainer}>
          <Button
            onClick={verifyCreate}
            disabled={!name.length || !instagram.length || creating}
            size="large"
            variant="contained"
            fullWidth
            sx={styles.button}
          >
            Verify & Create Profile
          </Button>
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
    </>
  );
}
