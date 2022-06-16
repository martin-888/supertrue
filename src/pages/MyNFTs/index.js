import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import ArtistNFT from "components/ArtistNFT";

let walletAddress = localStorage["address"];
// TODO add search param to collections
const COLLECTIONS_QUERY = gql`
  {
    user(id: "${walletAddress}") {
      nfts {
        id
        tokenId
        artistId
        collection {
          minted
        }
      }
    }
  }
`;

/**
 * Component: My NFTs page
 */
export default function MyNFTs({ view }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const { data, loading, error } = useQuery(COLLECTIONS_QUERY);

  useEffect(() => {
    if (!data?.user?.nfts?.length) {
      setFilteredArtists([]);
      return;
    }

    if (searchQuery === "") {
      setFilteredArtists(data.user.nfts);
      return;
    }

    const search = searchQuery.toLowerCase().trim();

    const nfts = data.collections.filter(
      (artist) =>
        artist.name.toLowerCase().indexOf(search) !== -1 ||
        artist.instagram.toLowerCase().indexOf(search) !== -1
    );

    setFilteredArtists(nfts);
  }, [searchQuery, data]);

  const getContent = () => {
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
          <Typography variant="h5">No Artists Available</Typography>
        </Grid>
      );
    }
    if (!filteredArtists.length) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" component="h3" align="center">
            Sorry we couldn’t find "{searchQuery}".
            <br />
            <br />
            You can be the first!
          </Typography>
          <Box sx={{ m: 2 }} />
          <Button
            variant="contained"
            size="large"
            href={`/artist/new?name=${searchQuery}`}
          >
            Add {searchQuery}
          </Button>
        </Grid>
      );
    }

    return (
      <>
        {view !== "gallery" && (
          <Box key="h2" sx={{ mb: 3 }}>
            <Typography variant="h2">MY NFTS</Typography>
          </Box>
        )}

        <Grid container spacing={8}>
          {filteredArtists.map((nft, index) => (
            <Grid item key={nft.id} className="artist" xs={12} sm={6} md={4}>
              {/* <ArtistBlock artist={artist} /> */}
              <ArtistNFT
                artist={{ id: nft.artistId, minted: nft.collection.minted }}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      {view !== "gallery" && (
        <Grid item sm={6} sx={{ mb: 4 }}>
          <TextField
            autoFocus
            sx={{ width: "100%" }}
            id="standard-basic"
            label="Search Artist"
            variant="filled"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
      )}
      {getContent()}
    </Container>
  );
}
