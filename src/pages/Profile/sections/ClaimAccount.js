import React, { useEffect, useState } from "react";
import { Contract } from "ethers";
import { Box, Button, Typography } from "@mui/material";

import useWeb3Modal from "../../../hooks/useWeb3Modal";
import { abis } from "../../../contracts";
import * as api from "../../../api";

const appId = "4929016593851112";
const redirectUrl = window.location.origin + "/profile";
const connectLink = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUrl}&scope=user_profile&response_type=code`;

const errorMessagesAuth = {
  "default": "Authorisation failed.",
  "account-address-not-valid": "Account address in your instagram bio not found.",
  "instagram-not-found": "Collection with your instagram handle not found.",
  "instagram-handle-not-found": "Collection with your instagram handle not found.",
  "auth-failed": "Authorisation failed.",
  "artist-id-not-found": "Artist not found.",
  "missing-params": "Authorisation failed - missing parameters.",
  "artist-not-found": "Artist not found.",
  "instagram-token-not-found": "Instagram token not found.",
  "accounts-no-match": "Account in your instagram bio doesn't match with connected account.",
};

async function claimTransaction({ provider, signature1, signature2, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.superTrueNFT, provider.getSigner());
  const tx = await nftContract.claim(signature1, signature2);
  const receipt = await tx.wait();

  return { tx, receipt };
}

// https://dev.to/zemse/ethersjs-signing-eip712-typed-structs-2ph8
const ClaimAccount = ({ collection, contractAddress, setContractAddress }) => {
  const { account, provider } = useWeb3Modal();

  const [isAuth, setIsAuth] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimTxSuccess, setIsClaimTxSuccess] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [claimedIgHandle, setClaimedIgHandle] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code || !account) {
      return;
    }

    // remove code param from url
    window.history.replaceState(null, null, window.location.pathname);

    setIsAuth(true);

    (async () => {
      const { errCode, success, artistId, contractAddress } = await api.auth({ code, redirectUrl });

      if (!success || !artistId || !contractAddress) {
        setAuthError(errorMessagesAuth[errCode]);
        setIsAuth(false);
        console.log("Auth error", errCode);
        return;
      }

      const { signature: sign1, artist: artist1, errCode: errCode1 } = await api.getAuthSignature1({ artistId });
      const { signature: sign2, artist: artist2, errCode: errCode2 } = await api.getAuthSignature2({ artistId });

      if (!sign1 || !sign2 || errCode1 || errCode2) {
        setAuthError(errorMessagesAuth[errCode1 || errCode1 || "default"]);
        setIsAuth(false);
        return;
      }

      // should never happen but better to check
      if (artist1.account !== account || artist2.account !== account) {
        setAuthError(errorMessagesAuth["accounts-no-match"]);
        setIsAuth(false);
        return;
      }

      setSignature1(sign1);
      setSignature2(sign2);
      setClaimedIgHandle(artist1.instagram);
      setContractAddress(contractAddress);
    })();
  }, [account]);

  const claim = async () => {
    setAuthError(null);
    setIsClaiming(true);

    return claimTransaction({signature1, signature2, contractAddress, provider})
      .then(() => {
        setIsClaimTxSuccess(true);
        setTimeout(() => window.location.reload(), 60000);
      })
      .catch((error) => {
        console.log("Transaction error: ", error);
        setIsClaiming(false);
        setAuthError(error);
      });
  }

  const getAccountContent = () => {
    if (isClaimTxSuccess) {
      return (
        <>
          <Typography variant="subtitle1">
            Claiming @{claimedIgHandle} has been successful.
          </Typography>
          <Typography variant="subtitle1">
            Please wait 1min and refresh this page for seeing your claimed account.
          </Typography>
        </>
      );
    }

    if (signature1 && signature2) {
      return (
        <>
          <Button
            variant="contained"
            disabled
            target="_blank"
          >
            Connect Instagram
          </Button>
          <Box sx={{mb:4}} />
          <Typography variant="subtitle1">
            Add into your instagram bio (@{claimedIgHandle}) your account address {account} and click on Claim button below.
          </Typography>
          <Box sx={{mb:4}} />
          <Button
            variant="contained"
            onClick={claim}
            target="_blank"
            disabled={isClaiming}
          >
            {isClaiming ? "Claiming" : "Claim"} @{claimedIgHandle}
          </Button>
        </>
      );
    }

    if (isAuth) {
      return (
        <Button variant="contained" disabled={isAuth}>Connecting Instagram</Button>
      );
    }

    if (!collection) {
      return (
        <Button variant="contained" href={connectLink}>Connect Instagram</Button>
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
      {authError && (
        <>
          <Typography variant="h2">{authError}</Typography>
          <Box sx={{mb:4}} />
        </>
      )}
      {getAccountContent()}
      <Box sx={{mb:4}} />
    </Box>
  );
}

export default ClaimAccount;
