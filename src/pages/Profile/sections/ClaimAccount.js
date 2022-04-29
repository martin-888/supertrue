import React, { useState } from "react";
import { Contract } from "ethers";
import { Autocomplete, Box, Button, Divider, TextField, Typography } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

import useWeb3Modal from "../../../hooks/useWeb3Modal";
import { abis } from "../../../contracts";
import * as api from "../../../api";

const COLLECTIONS_QUERY = gql`
    {
        collections {
            artistId
            instagram
            address
            owner {
                id
            }
        }
    }
`;

const errorMessages = {
  "default": "Claiming failed.",
  "invalid-signer": "Invalid signer",
  "not-found": "Artist not found",
  "instagram-not-found": "Collection with this instagram handle not found.",
  "instagram-handle-not-match": "Instagram handle doesn't match.",
  "instagram-id-not-match": "Instagram ID doesn't match.",
  "account-address-not-valid": "Copy & paste text from above not found in your instagram bio.",
  "accounts-not-match": "Account addresses doesn't match.",
};

async function claimTransaction({ provider, signature1, signature2, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.superTrueNFT, provider.getSigner());
  const tx = await nftContract.claim(signature1, signature2);
  const receipt = await tx.wait();

  return { tx, receipt };
}

// https://dev.to/zemse/ethersjs-signing-eip712-typed-structs-2ph8
const ClaimAccount = ({ collection }) => {
  const { account, provider } = useWeb3Modal();
  const [selectedCollection, setCollection] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimTxSuccess, setIsClaimTxSuccess] = useState(false);
  const [claimingError, setClaimingError] = useState(null);

  const { data, loading, error } = useQuery(COLLECTIONS_QUERY);

  const claim = async () => {
    setClaimingError(null);
    setIsClaiming(true);

    const {
      signature: signature1,
      artist: artist1,
      errCode: errCode1
    } = await api.getClaimSignature1({ artistId: selectedCollection.artistId });
    const {
      signature: signature2,
      artist: artist2,
      errCode: errCode2
    } = await api.getClaimSignature2({ artistId: selectedCollection.artistId });

    if (!signature1 || !signature2 || errCode1 || errCode2) {
      setClaimingError(errorMessages[errCode1 || errCode2 || "default"]);
      setIsClaiming(false);
      return;
    }

    // should never happen but better to check
    if (artist1.account !== account || artist2.account !== account) {
      setClaimingError(errorMessages["accounts-not-match"]);
      setIsClaiming(false);
      return;
    }

    return claimTransaction({signature1, signature2, contractAddress: selectedCollection.address, provider})
      .then(() => {
        setIsClaimTxSuccess(true);
        setTimeout(() => window.location.reload(), 60000);
      })
      .catch((error) => {
        console.log("Transaction error: ", error);
        setIsClaiming(false);
        setClaimingError(error);
      });
  }

  const getAccountContent = () => {
    if (isClaimTxSuccess) {
      return (
        <>
          <Typography variant="subtitle1">
            Claiming @{selectedCollection.instagram} has been successful.
          </Typography>
          <Typography variant="subtitle1">
            Please wait 1 minute and refresh this page for seeing your claimed account.
          </Typography>
        </>
      );
    }

    if (!collection) {
      return (
        <>
          <Typography variant="subtitle1">
            Find your collection with your instagram handle.
          </Typography>
          <Box sx={{mb:4}} />
          <Autocomplete
            disablePortal
            loading={loading}
            options={data?.collections || []}
            noOptionsText="Collection not found"
            getOptionLabel={coll => coll.instagram}
            sx={{ width: 300 }}
            getOptionDisabled={coll => !!coll?.owner?.id}
            renderInput={(params) => <TextField {...params} label="Instagram" />}
            value={selectedCollection}
            onChange={(e, newValue) => setCollection(newValue)}
          />
          <Box sx={{mb:4}} />
          <Typography variant="subtitle1">
            Copy & paste into your instagram bio text below and click on Claim button.
          </Typography>
          <Box sx={{mb:4}} />
          <TextField disabled fullWidth value={`Supertrue:${account}`} />
          <Box sx={{mb:4}} />
          {claimingError && (
            <>
              <Typography variant="h2">{claimingError}</Typography>
              <Box sx={{mb:4}} />
            </>
          )}
          <Button
            variant="contained"
            disabled={!selectedCollection || isClaiming}
            onClick={claim}
          >
            Claim
          </Button>
          <Box sx={{mb:4}} />
          <Divider />
          <Box sx={{mb:4}} />
          <Typography variant="subtitle1">
            Don't have your own collection yet? Create it right now!
          </Typography>
          <Box sx={{mb:4}} />
          <Button variant="contained" href="/artist/new">Create Collection</Button>
        </>
      );
    }

    return (
      <Typography variant="h3">@{collection.instagram} account claimed</Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h2">CLAIM YOUR ACCOUNT</Typography>
      <Box sx={{mb:4}} />
      {getAccountContent()}
      <Box sx={{mb:4}} />
    </Box>
  );
}

export default ClaimAccount;
