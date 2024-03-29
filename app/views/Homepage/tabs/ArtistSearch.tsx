import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  TextField,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { gql } from '~/__generated__/gql';
import ArtistNFT from "~/components/ArtistNFT";

// TODO add search param to collections
const COLLECTIONS_QUERY = gql(`
  query collections {
    collections(first: 20) {
      id
      artistId
      minted
      name
      instagram
      owner {
        username
      }
    }
    reservations(first: 20) {
      id
      instagram
    }
  }
`);

const reserveCTAStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "260px",
    textAlign: "center",
    paddingTop: { xs: 4, sm: 0 },
  },
};

type ReserveCTAProps = {
  headingText: string;
  searchQuery: string;
};

const ReserveCTA = ({ headingText, searchQuery }: ReserveCTAProps) => {
  return (
    <Box sx={reserveCTAStyles.container}>
      <Typography variant="h3" component="h3" mb={4}>
        {headingText}
      </Typography>
      <Box>
        <Button variant="contained" size="large" href="/reserve">
          Add {searchQuery}
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Component: NFT Search Page
 */
export default function ArtistSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const { data, loading } = useQuery(COLLECTIONS_QUERY);

  // TODO useMemo
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

    const artistsCollection = data.collections.filter(
      (artist) =>
        artist?.name.toLowerCase().indexOf(search) !== -1 ||
        artist?.instagram.toLowerCase().indexOf(search) !== -1
    );

    const artistsReservation = data.reservations.filter(
      (artist) => artist.instagram.toLowerCase().indexOf(search) !== -1
    );

    setFilteredArtists([...artistsCollection, ...artistsReservation]);
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
    if (searchQuery.length > 0 && !filteredArtists.length) {
      return (
        <ReserveCTA
          headingText={`Sorry, we couldn't find "${searchQuery.trim()}"`}
          searchQuery={searchQuery}
        />
      );
    }

    return (
      <>
        {searchQuery.length === 0 && (
          <>
            <Typography
              variant="subtitle1"
              sx={{ mt: 6, mb: 10 }}
            >
              Follow your favorite artists and receive a dated NFT with your
              Supertrue follower number!
            </Typography>

            <Box key="h2" sx={{ mb: 3 }}>
              <Typography variant="h2">FEATURED ARTISTS</Typography>
            </Box>
          </>
        )}

        <Grid container spacing={4}>
          {filteredArtists.map((artist) => (
            <Grid item key={artist.id} xs={12} sm={6} md={4}>
              <ArtistNFT artist={{ ...artist, id: artist.artistId }} />
            </Grid>
          ))}
          {searchQuery !== "" && (
            <Grid item key="claim-CTA" xs={12} sm={6} md={4}>
              <ReserveCTA
                headingText={`Did you mean another "${searchQuery.trim()}"?`}
                searchQuery={searchQuery}
              />
            </Grid>
          )}
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
