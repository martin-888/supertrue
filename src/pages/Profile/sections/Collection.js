import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { Contract, utils } from "ethers";

import __ from "../../../helpers/__";
import * as api from "../../../api";
import { abis } from "../../../contracts";
import useWeb3Modal from "../../../hooks/useWeb3Modal";

const maxDescriptionLength = 1000;
const maxNameLength = 50;

const chainId = Number.parseInt(process.env.REACT_APP_CHAIN_ID || 0, 10);

const errorMessagesUpdate = {
  "default": "Update failed.",
  "missing-params": "Update failed - missing parameters.",
  "empty-name": "Update failed - empty name.",
  "not-found": "Artist not found.",
  "artist-not-found": "Artist not found.",
  "collection-not-claimed": "Collection is not claimed.",
  "invalid-signature": "Invalid signature.",
};

async function withdrawTransaction({ provider, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.supertrueNFT, provider.getSigner());
  const tx = await nftContract.withdrawArtist();
  const receipt = await tx.wait();

  return { tx, receipt };
}

const Collection = ({ collection, contractAddress }) => {
  const { provider } = useWeb3Modal();
  const [updateError, setUpdateError] = useState(null);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [artist, setArtist] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingFunds, setPendingFunds] = useState(BigInt(0));
  const [withdrawing, setWithdrawing] = useState(false);
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);

  useEffect(() => {
    if (!collection?.artistId) {
      return;
    }

    setName(collection.name);
    setPendingFunds(BigInt(collection.pendingFunds));

    (async () => {
      await api.getArtist(collection.artistId)
        .then(resp => {
          setArtist(resp.artist);
          setDescription(resp.artist.collectionDescription);
        })
        .catch(() => {
          console.log(`Artist ${collection.artistId} not found`);
        })
    })();
  }, [collection]);

  const withdraw = async () => {
    setWithdrawing(true);
    setIsWithdrawSuccess(false);

    return withdrawTransaction({contractAddress, provider})
      .then(() => {
        setPendingFunds(BigInt(0));
        setWithdrawing(false);
        setIsWithdrawSuccess(true);
      })
      .catch((error) => {
        console.log("Withdraw Transaction error: ", error);
        setWithdrawing(false);
        setIsWithdrawSuccess(false);
      });
  }

  const save = async () => {
    setSaving(true);
    setUpdateError(null);

    const domain = {
      name: "SuperTrue",
      version: "1",
      chainId,
    };

    const types = {
      Message: [
        { name: 'artistId', type: 'uint256' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
      ]
    };

    const artistId = collection.artistId;

    const value = {
      artistId,
      name,
      description,
    };

    const signature = await provider.getSigner()
      ._signTypedData(domain, types, value)
      .catch(() => null)

    if (!signature) {
      setUpdateError("Signing message failed.");
      setSaving(false);
      return;
    }

    const response = await api.updateArtist({ signature, description, name, artistId })
      .catch((e) => {
        console.log("Update failed", e);
        return { errCode: "default" };
      })

    if (response.errCode) {
      setUpdateError(errorMessagesUpdate[response.errCode]);
    } else {
      setIsUpdateSuccess(true);
      setTimeout(() => setIsUpdateSuccess(false), 3000);
    }

    setSaving(false);
  };

  if (!collection?.id) {
    return null;
  }

  return (
    <Box sx={{mb:4}}>
      <Box sx={{mb:4}}>
        <Typography variant="h2">MY COLLECTION</Typography>
      </Box>
      {!artist
        ? <CircularProgress /> : (
          <>
            <Box sx={{mb:4}}>
              <Typography variant="h3">Collection Name</Typography>
              <Typography>{artist.collectionName}</Typography>
            </Box>
            <Box sx={{mb:4}}>
              <Typography variant="h3">Pending Funds</Typography>
              <Typography>{pendingFunds === BigInt(0) ? 0 : utils.formatEther(pendingFunds)} ETH</Typography>
              <Box sx={{mb:2}} />
              {isWithdrawSuccess && (
                <Box sx={{mb:2}}>
                  <Typography variant="h2">All funds have been withdrawn.</Typography>
                </Box>
              )}
              <Button
                size="large"
                variant="contained"
                disabled={withdrawing || isWithdrawSuccess || pendingFunds === BigInt(0)}
                onClick={withdraw}
                color={isWithdrawSuccess ? "success" : undefined}
              >
                {withdrawing ? "Withdrawing" : (isWithdrawSuccess ? "Withdrawn" : "Withdraw")}
              </Button>
            </Box>
            {/*<Box sx={{mb:4}}>*/}
            {/*  <Typography variant="h3">Artist Name</Typography>*/}
            {/*  <TextField*/}
            {/*    disabled={saving}*/}
            {/*    value={name}*/}
            {/*    onChange={e => setName(e.target.value.slice(0,maxNameLength))}*/}
            {/*  />*/}
            {/*</Box>*/}
            <Box sx={{mb:4}}>
              <Typography variant="h3">Collection Description</Typography>
              <TextField
                disabled={saving}
                multiline
                fullWidth
                minRows={2}
                value={description}
                onChange={e => setDescription(e.target.value.slice(0,maxDescriptionLength))}
              />
              <Box sx={{mb:2}} />
              {updateError && (
                <Box sx={{mb:2}}>
                  <Typography variant="h2">{updateError}</Typography>
                </Box>
              )}
              <Button
                size="large"
                variant="contained"
                disabled={saving}
                onClick={save}
                color={isUpdateSuccess ? "success" : undefined}
              >
                {saving ? "Saving" : (isUpdateSuccess ? "Saved" : "Save")}
              </Button>
            </Box>
          </>
        )}
      <Grid container spacing={8}>
        <Grid item className="artist" xs={12} sm={6} md={6}>
          <Box className="image">
            <img src={__.getNFTImage(collection.artistId, collection.minted)} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Collection;
