import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contract } from "@ethersproject/contracts";
import { Container, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { abis } from "../../contracts";
import { getArtist } from "../../api";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import __ from "helpers/__";
// import millify from "millify";
// import moment from 'moment';
import './Artist.scss';

// import ArtistBlock from "components/ArtistBlock";


/**
 * Component: Single Artist Page
 */
export default function Artist() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [artist, setArtist] = useState(null);
  const [minted, setMinted] = useState(false);
  const [contract, setContract] = useState();
  const [price, setPrice] = useState(0);
  const [owner, setOwner] = useState();
  const [totalSupply, setTotalSupply] = useState(1);
  const { id } = useParams();
  const waitTime = 2000;

  useEffect(() => getArtist({ id }).then(response => {
    setArtist(response.artist);
    setLoading(false);
    // console.warn("Artist() Data:", response.artist);
  }), []);

  useEffect(() => {
    if(provider) {
      console.warn("Has Provider");
      if(artist) loadContractInstance(artist);
      else{
        console.log("No Artist Data - Unload Contract");
        setContract(null);  
      }
    }
    else if(artist){
      console.log("Has Artist, but No Web3 Provider - Load From DB");
        setPrice(artist.price);
        setTotalSupply(artist.minted);
        // setOwner(artist.owner);
    }
  }, [provider, artist]);

  async function loadContractInstance(artist) {
    if(artist){
      // Init smart contract Handle
      const contractInstance = new Contract(artist.contractAddress, abis.forwardNFT, provider.getSigner());
      setContract(contractInstance);
      //Fetch On-Chain Data
      contractInstance.getCurrentPrice().then(res => Number(res._hex)).then(res => setPrice(res));
      contractInstance.owner().then(res => setOwner(res));
      contractInstance.totalSupply().then(res => setTotalSupply(Number(res)));
    }
  }

  const mintNFT = async () => {
    setMinting(true);
    await mint({ provider, contractAddress: artist.contractAddress })
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
    return contract.mint(1, address, { value: price })
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
        <img src={__.getArtistNFTImage(artist, `${(artist.minted >= totalSupply) ? (artist.minted+1) : (totalSupply+1)}`)} />
      </Grid>
      <Grid item className="details" md={6}>

        <Typography variant="h3" component="h3" className="name">{artist.name}</Typography>
        {/* <Typography variant="subtitle1">Followers: {millify(artist.followers)}</Typography> */}
        {/* <Typography variant="subtitle1">Date of Discovery: {moment(artist.created).format('MM.DD.YYYY')}</Typography> */}
        {/* <Typography variant="subtitle1">Supertrue #{artist.minted}</Typography> */}
        
        <Box sx={{ my: 3 }}>
          <Typography variant="h5" className="price">
            <label>Price:</label> {price / 10**18} ETH</Typography>
        </Box>

        <Typography variant="subtitle1">Price goes up per each additional NFT minted. Funds for unclaimed profiles are held for the artist minus service fees.</Typography>

        {minted && (
            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                color="success"
                target="_blank"
                href={`https://testnets.opensea.io/assets/${artist.contractAddress}/${totalSupply + 1}`}
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
                Mint Fan #{totalSupply + 1}
              </Button>
          )}
         </Box>
          
        </Box>
      </Grid>
    </Grid>
    </Container> 
  );
}
