import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material";

import __ from "../../helpers/__";
import useWeb3Modal from "../../hooks/useWeb3Modal";

const MY_NFTS_QUERY = gql`
    query myNfts($userId: ID!) {
        user(id: $userId) {
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

export default function Me() {
  const { account } = useWeb3Modal();
  // eslint-disable-next-line no-unused-vars
  const { data, loading, error } = useQuery(MY_NFTS_QUERY, {
    variables: { userId: (account || "").toLowerCase() }
  });

  const getContent = () => {
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
              {console.warn("nft", nft)}
              <img src={__.getNFTImage(nft.artistId, nft.tokenId)} alt={nft?.collection?.name}/>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box key='h2' sx={{mb:3}}>
        <Typography variant="h2" >MY ASSETS</Typography>
      </Box>
      {getContent()}
    </Container>
  );
}
