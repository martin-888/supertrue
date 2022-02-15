import React, { useState, useEffect } from "react";
import { Link, TextField, Typography, Button, Grid, Box, List, ListItem, Container, CircularProgress } from "@mui/material";
import { getArtists } from "../../api";
// import ArtistBlock from "components/ArtistBlock";
import ArtistNFT from "components/ArtistNFT";
import __ from "helpers/__";


/**
 * Component: NFT Search Page
 */
export default function ArtistSearch({view}) {
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
        {view!=='gallery' && 
        <Typography maxWidth="md" variant="h5" className="explanation" sx={{mt:6, mb:10}}>
          Mint your favorite new artist to receive a dated NFT with your disovery date and your supertrue follower count. Display your music finds in your gallery. Funds are held for the artist minus transaction fees. 
        </Typography>
        }
        
        {view!=='gallery' && <Box key='h2' sx={{mb:3}}>
            <Typography variant="h2" >NEWLY MINTED</Typography>
          </Box>}

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
      
      {view!=='gallery' && 
      <Container maxWidth="md">
        <TextField autoFocus sx={{minWidth:'400px'}} id="standard-basic" label="Search Artist" variant="filled" onChange={e => setSearchQuery(e.target.value)} />
      </Container>
      }
      <Container maxWidth="md" sx={{ my: 8 }}>
        {view==='gallery' && 
        <Box sx={{mb:6}}>
          <Typography variant="h1" >NFT GALLERY</Typography>
          <Typography variant="h6" className="explanation" sx={{my:2}}>
            All your shiny finds are displayed here. <Link variant="text" href={`/artist/new`}>Mint a new artist</Link>
          </Typography>
        </Box>
        }
        {getContent()}
      </Container>
    </>
  );
}
