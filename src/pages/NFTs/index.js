import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import ArtistNFT from "components/ArtistNFT";

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

export default function NFTs({ view }) {
  const { login, logging } = useLogInWallet();
  const { data, loading, error } = useQuery(NFTS_QUERY);

  useEffect(() => {
      document.title = `NFTs | Supertrue`;
    },[],
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  if (!data?.me?.nfts?.length) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {data?.me?.id ? (
            <Typography variant="h5">No Supertrue NFTs found</Typography>
          ) : (
            <>
              <Typography variant="h5" mb={5}>Connect your wallet to see your Supertrue NFTs.</Typography>
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
