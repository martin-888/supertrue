import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { Contract } from "@ethersproject/contracts";

import * as api from "../../api";
import __ from "../../helpers/__";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { abis } from "../../contracts";

const MY_PROFILE_QUERY = gql`
    query myNfts($userId: ID!) {
        user(id: $userId) {
            collection {
                id
                artistId
                address
                minted
                name
                instagram
            }
            nfts {
                id
                tokenId
                artistId
                collection {
                    address
                    minted
                    name
                    instagram
                }
            }
        }
    }
`;

const appId = "4929016593851112";
const redirectUrl = window.location.origin + "/profile";
const connectLink = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUrl}&scope=user_profile&response_type=code`;

const errorMessages = {
  "auth-default": "Authorisation failed.",
  "account-address-not-valid": "Account address in your instagram bio not found.",
  "instagram-not-found": "Collection with your instagram handle not found.",
  "instagram-handle-not-found": "Collection with your instagram handle not found.",
  "auth-failed": "Authorisation failed.",
  "artist-id-not-found": "Artist not found.",
  "missing-params": "Authorisation failed - missing parameters.",
  "artist-not-found": "Artist not found.",
  "instagram-token-not-found": "Instagram token not found.",
};

async function claimTransaction({ provider, signature1, signature2, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.superTrueNFT, provider.getSigner());
  const tx = await nftContract.claim(signature1, signature2);
  const receipt = await tx.wait();

  return { tx, receipt };
}

export default function Profile() {
  const [isAuth, setIsAuth] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimTxSuccess, setIsClaimTxSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [claimedIgHandle, setClaimedIgHandle] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [artist, setArtist] = useState(null);

  const { account, provider } = useWeb3Modal();
  const { data, loading, error } = useQuery(MY_PROFILE_QUERY, {
    variables: { userId: (account || "").toLowerCase() }
  });

  useEffect(() => {
    if (!data?.user?.collection?.artistId) {
      return;
    }

    (async () => {
      await api.getArtist(data.user.collection.artistId).then(resp => setArtist(resp.artist))
        .catch(() => {
          console.log(`Artist ${data.user.collection.artistId} not found`);
        })
    })();
  }, [data]);

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
        setAuthError(errorMessages[errCode]);
        setIsAuth(false);
        console.log("Auth error", errCode);
        return;
      }

      const { signature: sign1, artist: artist1, errCode: errCode1 } = await api.getAuthSignature1({ artistId });
      const { signature: sign2, artist: artist2, errCode: errCode2 } = await api.getAuthSignature2({ artistId });

      if (!sign1 || !sign2 || errCode1 || errCode2) {
        setAuthError(errorMessages[errCode1 || errCode1 || "auth-default"]);
        setIsAuth(false);
        return;
      }

      // should never happen but better to check
      if (artist1.account !== account || artist2.account !== account) {
        setAuthError(errorMessages["auth-default"]);
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

  const getAssetContent = () => {
    if (!account) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">Connect your wallet to see your NFTs</Typography>
        </Grid>
      );
    }
    if (loading) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      );
    }
    if (!data?.user?.nfts?.length) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">No NFTs Collected</Typography>
        </Grid>
      );
    }

    return (
      <Grid container spacing={8}>
        {data.user.nfts.map((nft) => (
          <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
            <Box className="image">
              <img src={__.getNFTImage(nft.artistId, nft.tokenId)} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
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
          <Box sx={{mb:3}} />
          <Typography variant="subtitle1">
            Add into your instagram bio (@{claimedIgHandle}) your account address {account} and click on Claim button below.
          </Typography>
          <Box sx={{mb:3}} />
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

    if (!data?.user?.collection) {
      return (
        <Button variant="contained" href={connectLink}>Connect Instagram</Button>
      );
    }

    return (
      <Typography variant="h3">@{data.user.collection.instagram} account claimed</Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box sx={{mb:3}}>
        <Typography variant="h2">CLAIM YOUR ACCOUNT</Typography>
        <Box sx={{mb:3}} />
        {authError && (
          <>
            <Typography variant="h2">{authError}</Typography>
            <Box sx={{mb:3}} />
          </>
        )}
        {getAccountContent()}
        <Box sx={{mb:3}} />
      </Box>
      {data?.user?.collection?.id && (
        <Box sx={{mb:3}}>
          <Box sx={{mb:3}}>
            <Typography variant="h2">MY COLLECTION</Typography>
          </Box>
          {artist && (
            <>
              <Box sx={{mb:3}}>
                <Typography variant="h3">Collection Name</Typography>
                <Typography>{artist.collectionName}</Typography>
              </Box>
              <Box sx={{mb:3}}>
                <Typography variant="h3">Collection Description</Typography>
                <Typography>{artist.collectionDescription}</Typography>
              </Box>
            </>
          )}
          <Grid container spacing={8}>
            <Grid item className="artist" xs={12} sm={6} md={6}>
              <Box className="image">
                <img src={__.getNFTImage(data.user.collection.artistId, data.user.collection.minted)} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <Box sx={{mb:3}}>
        <Typography variant="h2">MY ASSETS</Typography>
      </Box>
      {getAssetContent()}
    </Container>
  );
}
