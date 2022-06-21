import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  TextField,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import ArtistNFT from "components/ArtistNFT";

// TODO add search param to collections
const COLLECTIONS_QUERY = gql`
  {
    collections(first: 100) {
      id
      artistId
      minted
      name
      instagram
    }
  }
`;

/**
 * Component: NFT Search Page
 */
export default function ArtistSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const { data, loading, error } = useQuery(COLLECTIONS_QUERY);

  useEffect(() => {
    if (!data?.collections?.length) {
      setFilteredArtists([]);
      return;
    }

    if (searchQuery === "") {
      setFilteredArtists(data.collections);
      return;
    }

    const search = searchQuery.toLowerCase().trim();

    const artists = data.collections.filter(
      (artist) =>
        artist.name.toLowerCase().indexOf(search) !== -1 ||
        artist.instagram.toLowerCase().indexOf(search) !== -1
    );

    setFilteredArtists(artists);
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
    if (!data?.collections?.length) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">No collections found</Typography>
        </Grid>
      );
    }
    if (!filteredArtists.length) {
      return (
        <>
          <Typography variant="h5" component="h3" align="center">
            {searchQuery} isn't on Supertrue yet
          </Typography>
          {/*<Typography variant="h5" component="h3" align="center">*/}
          {/*  Collection "{searchQuery}" not found.*/}
          {/*  <br />*/}
          {/*  <br />*/}
          {/*  You can be the first!*/}
          {/*</Typography>*/}
          {/*<Box sx={{ m: 2 }} />*/}
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  size="large"*/}
          {/*  href={`/new?name=${searchQuery}`}*/}
          {/*>*/}
          {/*  Add {searchQuery}*/}
          {/*</Button>*/}
        </>
      );
    }

    return (
      <>
        {searchQuery.length === 0 && (
          <>
            <Typography
              variant="subtitle1"
              className="explanation"
              sx={{ mt: 6, mb: 10 }}
            >
              Follow your favorite artists to receive a dated NFT with your supertrue follower number. Display what you support on your gallery. Artists can message fans exclusively based on how early they’re to back them. Sell, trade or buy your NFTs. Every NFT is unique and you can buy more than one for each artist!
            </Typography>

            <Box key="h2" sx={{ mb: 3 }}>
              <Typography variant="h2">FEATURED ARTISTS</Typography>
            </Box>
          </>
        )}

        <Grid container spacing={4}>
          {filteredArtists.map((artist, index) => (
            <Grid item key={artist.id} className="artist" xs={12} sm={6} md={4}>
              <ArtistNFT artist={{ ...artist, id: artist.artistId }} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <>
      <Grid item sm={6} sx={{ mb: 4 }}>
        <TextField
          sx={{ width: "100%" }}
          id="standard-basic"
          label="Search Artist"
          variant="filled"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Grid>
      {getContent()}
    </>
  );
}
