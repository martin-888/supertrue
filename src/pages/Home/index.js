import React, { useState, useEffect } from "react";
import { TextField, Typography, Button, Grid, Box, List, ListItem, Container, CircularProgress } from "@mui/material";
import { getArtists } from "../../api";
import ArtistBlock from "components/ArtistBlock";

export default function Home() {
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
            Sorry, we could not find "{searchQuery}".
          </Typography>
          <Box sx={{ m: 2 }} />
          <Button variant="contained" size="large" href={`/artist/new?name=${searchQuery}`}>Add {searchQuery}</Button>
        </Grid>
      );
    }

    return (
      <List>
        {filteredArtists.map((artist, index) => (
          <ListItem key={artist.id}>
            <ArtistBlock artist={artist} />
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <>
      <Container maxWidth="sm">
        <TextField autoFocus fullWidth id="standard-basic" label="Search Artist" variant="standard" onChange={e => setSearchQuery(e.target.value)} />
      </Container>
      <Box sx={{ m: 8 }} />
      <Container maxWidth="md">
        {getContent()}
      </Container>
      <Box sx={{ m: 4 }} />
    </>
  );
}
