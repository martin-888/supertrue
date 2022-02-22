import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contract } from "@ethersproject/contracts";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";

import { abis } from "../../contracts";
import { getArtist } from "../../api";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import __ from "helpers/__";

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
      // creating connection to the smart contract
      const contractInstance = new Contract(artist.contractAddress, abis.forwardNFT, provider.getSigner());
      setContract(contractInstance);
      // the price is slowly increasing with each NFT so we need to get current price
      // const contractPrice = await 
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
    // The smart contract
    const forwardNFT = contract;
    // get connected metamask wallet address
    const address = await provider.getSigner().getAddress();
    // console.log({ address })
    // calling the smart contract function
    // first param is amount of NFTs, second is address where it should be mint into
    return forwardNFT.mint(1, address, { value: price })
      .then(tx => tx.wait().then(receipt => ({ tx, receipt })))
      // Error Handled on Caller
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
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <img width="400" height="400" src={__.getArtistNFTImage(artist)} />
      <Box sx={{ mt: 6, mb:2 }}>
        <Typography variant="h5">Price: {price / 10**18} ETH</Typography>
      </Box>

      {minting && (
        <Box sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {minted && (
        <Box sx={{ my: 4 }}>
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
      
      <Box sx={{ my: 4 }}>
        <Button
          size="large"
          variant="contained"
          onClick={!provider ? loadWeb3Modal : mintNFT}
          disabled={minting}
        >
          Mint Fan #{totalSupply + 1}
        </Button>
      </Box>
    </Grid>
  );
}
