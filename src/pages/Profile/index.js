import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Container, Grid, Typography, TextField } from "@mui/material";
import { Contract, utils } from "ethers";

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
                pendingFunds
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

const maxDescriptionLength = 1000;
const maxNameLength = 50;
const chainId = 4; // TODO change on production

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

const errorMessagesUpdate = {
  "default": "Update failed.",
  "missing-params": "Update failed - missing parameters.",
  "empty-name": "Update failed - empty name.",
  "not-found": "Artist not found.",
  "artist-not-found": "Artist not found.",
  "collection-not-claimed": "Collection is not claimed.",
  "invalid-signature": "Invalid signature.",
};

async function claimTransaction({ provider, signature1, signature2, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.superTrueNFT, provider.getSigner());
  const tx = await nftContract.claim(signature1, signature2);
  const receipt = await tx.wait();

  return { tx, receipt };
}

async function withdrawTransaction({ provider, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.superTrueNFT, provider.getSigner());
  const tx = await nftContract.withdrawArtist();
  const receipt = await tx.wait();

  return { tx, receipt };
}

// https://dev.to/zemse/ethersjs-signing-eip712-typed-structs-2ph8
export default function Profile() {
  const [isAuth, setIsAuth] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimTxSuccess, setIsClaimTxSuccess] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [claimedIgHandle, setClaimedIgHandle] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [artist, setArtist] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingFunds, setPendingFunds] = useState(BigInt(0));
  const [withdrawing, setWithdrawing] = useState(false);
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);

  const { account, provider } = useWeb3Modal();
  const { data, loading, error } = useQuery(MY_PROFILE_QUERY, {
    variables: { userId: (account || "").toLowerCase() }
  });

  useEffect(() => {
    if (!data?.user?.collection?.artistId) {
      return;
    }

    setName(data.user.collection.name);
    setContractAddress(data.user.collection.address);
    setPendingFunds(BigInt(data.user.collection.pendingFunds));

    (async () => {
      await api.getArtist(data.user.collection.artistId)
        .then(resp => {
          setArtist(resp.artist);
          setDescription(resp.artist.collectionDescription);
        })
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

    const artistId = data.user.collection.artistId;

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
      <Box sx={{mb:4}}>
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
      {data?.user?.collection?.id && (
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
                <img src={__.getNFTImage(data.user.collection.artistId, data.user.collection.minted)} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <Box sx={{mb:4}}>
        <Typography variant="h2">MY ASSETS</Typography>
      </Box>
      {getAssetContent()}
    </Container>
  );
}
