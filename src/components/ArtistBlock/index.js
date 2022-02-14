import React from "react";
import millify from "millify";
import moment from 'moment';
import { Box, Grid, Typography, Button } from "@mui/material";
import './ArtistBlock.scss';

/**
 * Component: Artist Block
 */
export default function ArtistBlock(props) {
  const { artist } = props;
  return(
    <Grid container className="artist-item">
      <Box className="image">
        <img src={`https://storage.googleapis.com/supertrue-5bc93.appspot.com/${artist.id}.jpg`} alt={artist.name}/>
      </Box>
      <Box className="details">
        <Typography variant="h3" component="h3" className="name">{artist.name}</Typography>
        <Typography variant="subtitle1">Followers: {millify(artist.followers)}</Typography>
        <Typography variant="subtitle1">Date of Discovery: {moment(artist.created).format('MM.DD.YYYY')}</Typography>
        <Typography variant="subtitle1">Supertrue #{artist.minted}</Typography>

        <Box className="actions">
          <Button size="large" variant="contained" href={`/artist/${artist.id}`}>Support</Button>
        </Box>
      </Box>
    </Grid>
  );
}