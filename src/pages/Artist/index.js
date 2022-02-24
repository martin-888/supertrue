import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Contract } from "@ethersproject/contracts";
import { Container, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
// import millify from "millify";
// import moment from 'moment';

import { abis } from "../../contracts";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import __ from "helpers/__";
import './Artist.scss';

// import ArtistBlock from "components/ArtistBlock";

const COLLECTION_QUERY = gql`
    {
        collections {
            id
            minted
            artistId
            symbol
            name
            address
            instagram
            price
        }
    }
`;

/**
 * Component: Single Artist Page
 */
export default function Artist() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const { id } = useParams();
  const { data, loading, error } = useQuery(COLLECTION_QUERY);
  const [minting, setMinting] = useState(false);
  const [artist, setArtist] = useState(null);
  const [minted, setMinted] = useState(false);
  const [contract, setContract] = useState();
  const [owner, setOwner] = useState();
  const waitTime = 2000;

  useEffect(() => {
    setArtist(data?.collections?.find(col => col.artistId.toString() === id));
  }, [data]);

  async function loadContractInstance(artist) {
    if(artist){
      // Init smart contract Handle
      const contractInstance = new Contract(artist.address, abis.forwardNFT, provider.getSigner());
      setContract(contractInstance);
      //Fetch On-Chain Data
      contractInstance.owner().then(res => setOwner(res));
    }
  }

  const mintNFT = async () => {
    setMinting(true);
    await mint({ provider, contractAddress: artist.address })
      .then((ret) => {
        // const { tx, receipt } = ret;
        console.error("mint() Success", ret);
        setTimeout(() => setMinted(true), waitTime);
        //Reload Contract Data
        loadContractInstance(artist);
      })
      .catch(err => {
        if(err.code === 4001) console.error("[CAUGHT] Metamask rejected transaction");
        else console.error("[CAUGHT] forwardNFT.mint() Failed", err);
      })
      .finally(() => {
        setTimeout(() => setMinting(false), waitTime);
      });
  };

  async function mint({ provider }) {
    // get current metamask wallet address
    const address = await provider.getSigner().getAddress();
    // console.log({ address })
    // calling the smart contract function
    // first param is amount of NFTs, second is address where it should be mint into
    return contract.mint(1, address, { value: artist.price })
      .then(tx => tx.wait().then(receipt => ({ tx, receipt }))) // Errors Handled by Caller
  }

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

  if (!artist) {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h5">Artist Not Found</Typography>
      </Grid>
    );
  };

  return (
    <Container maxWidth="md">
    <Grid container className="artist-single">

      <Grid item className="image" md={6}>
        <img src={__.getNFTImage(artist.artistId, artist.minted+1)} />
      </Grid>
      <Grid item className="details" md={6}>

        <Typography variant="h3" component="h3" className="name">{artist.name}</Typography>
        {/* <Typography variant="subtitle1">Followers: {millify(artist.followers)}</Typography> */}
        {/* <Typography variant="subtitle1">Date of Discovery: {moment(artist.created).format('MM.DD.YYYY')}</Typography> */}
        {/* <Typography variant="subtitle1">Supertrue #{artist.minted}</Typography> */}

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" className="price">
            <label>Price:</label> {artist.price / 10**18} ETH</Typography>
        </Box>

        <Typography variant="subtitle1">Price goes up per each additional NFT minted. Funds for unclaimed profiles are held for the artist minus service fees.</Typography>

        {minted && (
            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                color="success"
                target="_blank"
                href={`https://testnets.opensea.io/assets/${artist.address}/${artist.minted + 1}`}
              >
                Show On OpenSea
              </Button>
            </Box>
          )}

        <Box className="actions">
          <Box>
            {minting ? (
              <CircularProgress />
            )
            : (
              <Button
                size="large"
                variant="contained"
                onClick={!provider ? loadWeb3Modal : mintNFT}
                disabled={minting}
              >
                Mint Fan #{artist.minted + 1}
              </Button>
          )}
         </Box>

        </Box>
      </Grid>
    </Grid>
    </Container>
  );
}
