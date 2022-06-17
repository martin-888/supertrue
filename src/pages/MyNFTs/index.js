import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Typography,
  Grid,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import ArtistNFT from "components/ArtistNFT";

const walletAddress = localStorage["address"];
// TODO add search param to collections
const NFTS_QUERY = gql`
  {
    user(id: "${walletAddress}") {
      nfts {
        id
        tokenId
        artistId
      }
    }
  }
`;

export default function MyNFTs({ view }) {
  const [NFTs, setNFTs] = useState([]);
  const { data, loading, error } = useQuery(NFTS_QUERY);

  useEffect(() => {
    if (!data?.user?.nfts?.length) {
      setNFTs([]);
      return;
    }

    setNFTs(data.user.nfts);
  }, [data]);

  if (loading || !NFTs.length) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h5">No NFTs Available</Typography>
          )}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      {view !== "gallery" && (
        <Box key="h2" sx={{ mb: 3 }}>
          <Typography variant="h2">MY NFTS</Typography>
        </Box>
      )}

      <Grid container spacing={8}>
        {NFTs.map((nft, index) => (
          <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
            <ArtistNFT artist={{ id: nft.artistId, minted: nft.tokenId }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
