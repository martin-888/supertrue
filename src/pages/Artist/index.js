import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Contract } from "ethers";
import { Container, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
// import millify from "millify";
// import moment from 'moment';

import { abis } from "../../contracts";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import __ from "helpers/__";
import './Artist.scss';
// import ArtistBlock from "components/ArtistBlock";

//Single Artist Query
const ARTIST_QUERY = gql`
    query getArtist($artistId: Int) {
      collections(where: {artistId: $artistId}) {
        id
        artistId
        minted
        name
        symbol
        instagram
        address
        price
      }
    }
`;

/**
 * Component: Single Artist Page
 */
export default function Artist() {
  const { provider, loadWeb3Modal, account, chainId } = useWeb3Modal();
  const { id } = useParams();
  // const { data, loading, error } = useQuery(COLLECTION_QUERY);
  const { data, loading, error } = useQuery(ARTIST_QUERY, {
    variables: { artistId: Number(id) }
  });

  const [minting, setMinting] = useState(false);
  const [artist, setArtist] = useState(null);
  const [minted, setMinted] = useState(false);
  const [contract, setContract] = useState();
  // const [owner, setOwner] = useState();
  const waitTime = 2000;

  useEffect(() => {
    if(error) console.error("Failed to fetch Artist:"+id+" data: ", {data, loading, error});
    // console.warn("Artist:"+id+" data: ", {data, loading, error});
    // setArtist(data?.collections?.find(col => col.artistId.toString() === id));
    setArtist(data?.collections?.[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  
  useEffect(() => {
    console.warn("Loading Artist:"+id+" data: ", {data, loading, error, chainId,  provider, signer:provider?.getSigner()});
    //On Artist change, reload the contract
    if(artist) loadContractInstance(artist);
    else setContract();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist, chainId]);

  /**
   * Init Contract Instance
   * @param {*} artist 
   */
  async function loadContractInstance(artist) {
    if(artist){
      if(provider?.getSigner()){
        // Init smart contract Handle
        const contractInstance = new Contract(artist.address, abis.superTrueNFT, provider.getSigner());
        setContract(contractInstance);
        //Fetch On-Chain Data
        // contractInstance.owner().then(res => setOwner(res));
      }
      else console.error("No Provider / Signer", {provider});
    }
  }

  const mintNFT = async () => {
    // TODO check if account has enough funds

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
        else if(err.code === -32603) console.error("[CAUGHT] Insufficient funds");
        else console.error("[CAUGHT] superTrueNFT.mint() Failed", {err, chainId, account, provider, signer:provider?.getSigner()});
      })
      .finally(() => {
        setTimeout(() => setMinting(false), waitTime);
      });
  };

  async function mint({ provider }) {
    // get current metamask wallet address
    const address = await provider.getSigner().getAddress();
    // console.log("Current Address:", { address })

    //Validate
    if(contract){
      // calling the smart contract function
      // first param is amount of NFTs, second is address where it should be mint into
      return contract.mint(address, { value: artist.price })
        .then(tx => tx.wait().then(receipt => ({ tx, receipt }))) // Errors Handled by Caller
    }
    else console.error("Contract not available", { contract, address, chainId });
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
      <Container maxWidth="md">
      <Grid>
        <Typography variant="h5">Requested Artist Not Found</Typography>
      </Grid>
      </Container>
    );
  };

  return (
    <Container maxWidth="md">
    <Grid container className="artist-single">

      <Grid item className="image" md={6}>
        <img src={__.getNFTImage(artist.artistId, artist.minted+1)} alt={artist.name} />
      </Grid>
      <Grid item className="details" md={6}>

        <Typography variant="h2" className="title">Mint {artist.name}</Typography>
        {/* <Typography variant="subtitle1">Followers: {millify(artist.followers)}</Typography> */}
        {/* <Typography variant="subtitle1">Date of Discovery: {moment(artist.created).format('MM.DD.YYYY')}</Typography> */}
        {/* <Typography variant="subtitle1">Supertrue #{artist.minted}</Typography> */}

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" className="price">
            <label>Price:</label> {artist.price / 10**18} ETH</Typography>
        </Box>

        <Typography variant="subtitle1">Price goes up per each additional NFT created.</Typography>

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

      <Box sx={{ my: 3 }} className="additional-details">
        <Typography variant="h4">WHY MINT A SUPERTRUE NFT?</Typography>
        <Typography>
          Supertrue mints a discovery NFT showing what date you started officially supporting the artist. In lieu of owning an album, we give you a personal track record of artists you truly believe in. It’s like creating a digital archive of artists you’ve gotten behind. This becomes more interesting and useful as you build your collection.
        </Typography>

        <Typography variant="h4">WHAT’S IN IT FOR THE ARTIST</Typography>
        <Typography>
          We built this with the artists in mind. Funds are held for the artist to claim minus our service fee. When an artist sets out to build an instagram following they get nothing. When an artist sets out to build a supertrue following and reaches 1,000 fans, they have 8k USD to master their album. At 10,000 fans they have 100,000 USD to go on tour. All the while you benefit by getting credit you deserve of supporting them when they needed it the most. 
        </Typography>

        <Typography variant="h4">WHAT HAPPENS WHEN AN ARTIST I BELIEVE IN GROWS</Typography>
        <Typography>
          Congratulations! You’ve helped someone on their way up and now they’re on they’re on their way up. Supertrue saves your spot in time that you’ve backed that artist, and gives them the ability to reward their supertrue fans. How exactly they do it is up to them. We suggest to artist to give early access, exclusive shows, and special merch only available to their supertrue fans. 
        </Typography>

        <Typography variant="h4">CAN I SELL OR TRADE MY SUPERTRUE NFT</Typography>
        <Typography>
          If you’re ready auction off one of the special pieces of your collection as it grows in value, that’s up to you. The artist will get a 20% cut of your sale and everyone will be happy. We understand the feeling of collecting your winnings and using them to find someone new who is about to make their start. Happy collecting! Happy trading!
        </Typography>

      </Box>

    </Grid>
    </Container>
  );
}
