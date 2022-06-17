import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Typography,
  Grid,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import ArtistNFT from "components/ArtistNFT";

const NFTS_QUERY = gql`
  query me($address: ID!) {
    user(id: $address) {
      nfts {
        id
        tokenId
        artistId
      }
    }
  }
`;

export default function MyNFTs({ view }) {
  const address = localStorage["address"];
  const { data, loading, error } = useQuery(NFTS_QUERY, {
    variables: { address },
  });

  if (loading || !data?.user?.nfts?.length) {
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
            <Typography variant="h5">No NFTs found</Typography>
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
        {data.user.nfts.map((nft, index) => (
          <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
            <ArtistNFT artist={{ id: nft.artistId, minted: nft.tokenId }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
