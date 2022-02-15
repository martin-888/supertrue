import React, { useState, useEffect } from "react";
import { TextField, Typography, Button, Grid, Box, List, ListItem, Container, CircularProgress } from "@mui/material";
import { getArtists } from "../../api";
// import ArtistBlock from "components/ArtistBlock";
import ArtistNFT from "components/ArtistNFT";
import __ from "helpers/__";


/**
 * Component: NFT Search Page
 */
export default function ArtistSeatch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);

  useEffect(() => getArtists().then(response => {
    setArtists(response.artists);
    setLoading(false);
  }), [])

  useEffect(() => {
    console.warn("Artists: ", artists);

    if (searchQuery === '' || !searchQuery) {
      setFilteredArtists(artists);
      return;
    }

    const search = searchQuery.toLowerCase();

    setFilteredArtists(artists.filter(artist => artist.name.toLowerCase().indexOf(search) !== -1));
  }, [searchQuery, artists])

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
    if (!artists.length) {
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
            You can be the first!
          </Typography>
          <Box sx={{ m: 2 }} />
          <Button variant="contained" size="large" href={`/artist/new?name=${searchQuery}`}>Mint #1 {searchQuery}</Button>
        </Grid>
      );
    }

    return (
      <>
        <Typography maxWidth="md" variant="h5" className="explanation" sx={{my:6}}>
          Mint your favorite new artist to receive a dated NFT with your disovery date and your supertrue follower count. Display your music finds in your gallery. Funds are held for the artist minus transaction fees. 
        </Typography>
        <Grid container spacing={8}>
          {filteredArtists.map((artist, index) => (
            <Grid item key={artist.id} className="artist" xs={8} md={4}>
              {/* <ArtistBlock artist={artist} /> */}
              <ArtistNFT artist={artist} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="sm">
        <TextField autoFocus fullWidth id="standard-basic" label="Search Artist" variant="filled" onChange={e => setSearchQuery(e.target.value)} />
      </Container>
      
      <Container maxWidth="md" sx={{ my: 8 }}>
        {getContent()}
      </Container>
    </>
  );
}
