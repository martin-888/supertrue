import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Typography,
  Grid,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import ArtistNFT from "components/ArtistNFT";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import useLogInWallet from "hooks/useLogInWallet";

const NFTS_QUERY = gql`
  query myNfts {
    me {
      id
      nfts {
        id
        tokenId
        artistId
      }
    }
  }
`;

export default function MyNFTs({ view }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));
  const { login, logging } = useLogInWallet();
  const { data, loading, error } = useQuery(NFTS_QUERY);

  if (loading || !data?.me?.nfts?.length) {
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
            <>
              <Typography variant="h5" mb={2}>Connect your wallet to see your Supertrue NFTs.</Typography>
              <Button
                size="large"
                variant="contained"
                onClick={login}
                disabled={logging}
              >
                Connect Wallet
              </Button>
            </>
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
        {data.me.nfts.map((nft) => (
          <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
            <ArtistNFT artist={{ id: nft.artistId, minted: nft.tokenId }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
