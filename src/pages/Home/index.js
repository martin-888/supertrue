import React, { useState, useEffect } from "react";
import millify from "millify";
import { TextField, Typography, Button, Grid, Box, Divider, List, ListItem, Container, CircularProgress } from "@mui/material";
import { getArtists } from "../../api";

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
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                {index !== 0 && <Box sx={{ m: 2 }} />}
                <img width="100" height="100" src={`https://storage.googleapis.com/supertrue-5bc93.appspot.com/${artist.id}.jpg`} />
                <Box sx={{ m: 1 }} />
                <Typography variant="h3" component="h3">{artist.name}</Typography>
                <Typography variant="subtitle1">Followers: {millify(artist.followers)}</Typography>
                <Box sx={{ m: 1 }} />
                <Button size="large" variant="contained" href={`/artist/${artist.id}`}>Mint</Button>
                <Box sx={{ m: 2 }} />
              </Grid>
            {filteredArtists.length !== index + 1 && <Divider />}
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
