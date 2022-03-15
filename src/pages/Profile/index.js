import React, { useEffect, useState } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { Contract } from "@ethersproject/contracts";

import * as api from "../../api";
import __ from "../../helpers/__";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { abis } from "../../contracts";

const MY_NFTS_QUERY = gql`
    query myNfts($userId: ID!) {
        user(id: $userId) {
            collection {
                id
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

async function claimTransaction({ provider, signature1, signature2, contractAddress }) {
  const nftContract = new Contract(contractAddress, abis.superTrueNFT, provider.getSigner());
  const tx = await nftContract.claim(signature1, signature2);
  const receipt = await tx.wait();

  return { tx, receipt };
}

export default function Profile() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [claimedIgHandle, setClaimedIgHandle] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);

  const client = useApolloClient();
  const { account, provider } = useWeb3Modal();
  const { data, loading, error } = useQuery(MY_NFTS_QUERY, {
    variables: { userId: (account || "").toLowerCase() }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code || !account) {
      return;
    }

    window.history.replaceState(null, null, window.location.pathname);

    setIsAuth(true);

    (async () => {
      const { errCode, success, artistId, contractAddress } = await api.auth({ code, redirectUrl });

      if (!success || !artistId || !contractAddress) {
        setIsAuthError(true);
        setIsAuth(false);
        console.log("Auth error", errCode);
        return;
      }

      const { signature: sign1, artist: artist1 } = await api.getAuthSignature1({ artistId });
      const { signature: sign2, artist: artist2  } = await api.getAuthSignature2({ artistId });

      if (!sign1 || !sign2) {
        setIsAuthError(true);
        setIsAuth(false);
        return;
      }

      // should never happen but better to check
      if (artist1.account !== account || artist2.account !== account) {
        setIsAuthError(true);
        setIsAuth(false);
        return;
      }

      setSignature1(sign1);
      setSignature2(sign2);
      setClaimedIgHandle(artist1.instagram);
      setContractAddress(contractAddress);
    })();
  }, [account]);

  const claim = async () =>
    claimTransaction({ signature1, signature2, contractAddress, provider })
      .then(() => {
        console.log("success auth");
        setIsAuth(false);
        setTimeout(() => client.refetchQueries({ include: "active" }), 5000);
      })
      .catch((error) => {
        console.log("Transaction error: ", error);
        setIsAuth(false);
        setIsAuthError(true);
      })

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
    if (signature1 && signature2) {
      return (
        <>
          <Button variant="contained" disabled target="_blank">Connect Instagram</Button>
          <Box sx={{mb:3}} />
          <Button variant="contained" onClick={claim} target="_blank">Claim @{claimedIgHandle}</Button>
          <Box sx={{mb:3}} />
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
        {isAuthError && (
          <>
            <Typography variant="h2">Authorisation failed.</Typography>
            <Box sx={{mb:3}} />
          </>
        )}
        {getAccountContent()}
      </Box>
      <Box sx={{mb:3}}>
        <Typography variant="h2">MY ASSETS</Typography>
      </Box>
      {getAssetContent()}
    </Container>
  );
}
