import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Contract, utils } from "ethers";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { abis } from "../../contracts";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import __ from "helpers/__";
import useAccountBalance from "../../hooks/useAccountBalance";

import "./Artist.scss";

const ARTIST_QUERY = gql`
  query getArtist($artistId: Int) {
    collections(where: { artistId: $artistId }) {
      id
      artistId
      minted
      name
      description
      symbol
      instagram
      address
      price
    }
  }
`;

async function mint({ provider, contractAddress, price }) {
  const supertrueNFT = new Contract(
    contractAddress,
    abis.supertrueNFT,
    provider.getSigner()
  );

  const address = provider.getSigner().getAddress();

  const tx = await supertrueNFT.mint(address, { value: price });

  const receipt = await tx.wait();

  return { tx, receipt };
}

/**
 * Component: Single Artist Page
 */
export default function Artist() {
  const { provider, loadWeb3Modal } = useWeb3Modal();
  const balance = useAccountBalance();
  const { id } = useParams();
  const { data, loading, error } = useQuery(ARTIST_QUERY, {
    variables: { artistId: Number(id) },
  });

  const [minting, setMinting] = useState(false);
  const [artist, setArtist] = useState(null);
  const [minted, setMinted] = useState(false);
  const waitTime = 2000;

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch Artist:" + id + " data: ", {
        data,
        error,
      });
    }
    setArtist(data?.collections?.[0]);
  }, [data]);

  const mintNFT = async () => {
    if (balance < utils.parseUnits(artist?.price, "wei").toBigInt()) {
      alert("Not enough funds in your wallet.");
      return;
    }

    setMinting(true);
    await mint({
      provider,
      contractAddress: artist.address,
      price: artist.price,
    })
      .then(() => setTimeout(() => setMinted(true), waitTime))
      .catch((err) => console.error(err.message))
      .finally(() => setTimeout(() => setMinting(false), waitTime));
  };

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
  }

  return (
    <Container maxWidth="md">
      <Grid container className="artist-single">
        <Grid item className="image" md={6}>
          <img
            src={__.getNFTImage(artist.artistId, artist.minted + 1)}
            alt={artist.name}
          />
        </Grid>

        <Grid item className="details" md={6}>
          <Typography variant="h2" className="title">
            Mint {artist.name}
          </Typography>

          <Typography variant="subtitle1" className="title">
            <Link
              target="_blank"
              href={`https://www.instagram.com/${artist.instagram}`}
            >
              @{artist.instagram}
            </Link>
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h5" className="price">
              <label>Price:</label>{" "}
            </Typography>{" "}
            <Typography>{artist.price / 10 ** 18} ETH </Typography>
            <br />
            <Typography variant="subtitle2">
              Price goes up per each additional NFT created.
            </Typography>
          </Box>

          {minted && (
            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                color="success"
                target="_blank"
                href={`https://testnets.opensea.io/assets/${artist.address}/${
                  artist.minted + 1
                }`}
              >
                Show On OpenSea
              </Button>
            </Box>
          )}

          <Box className="actions">
            <Box>
              {minting ? (
                <CircularProgress />
              ) : (
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
        <Box className="about">
          <Typography variant="h4">About</Typography>
          <Typography>{artist.description}</Typography>
        </Box>

        <Typography mb={"10px"} variant="h4">
          FAQ
        </Typography>
        <Accordion className="faqs">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4">WHY MINT A SUPERTRUE NFT?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Supertrue mints a discovery NFT showing what date you started
              officially supporting the artist. In lieu of owning an album, we
              give you a personal track record of artists you truly believe in.
              It’s like creating a digital archive of artists you’ve gotten
              behind. This becomes more interesting and useful as you build your
              collection.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="faqs">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4">WHAT’S IN IT FOR THE ARTIST</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We built this with the artists in mind. Funds are held for the
              artist to claim minus our service fee. When an artist sets out to
              build an instagram following they get nothing. When an artist sets
              out to build a supertrue following and reaches 1,000 fans, they
              have 8k USD to master their album. At 10,000 fans they have
              100,000 USD to go on tour. All the while you benefit by getting
              credit you deserve of supporting them when they needed it the
              most.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="faqs">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4">
              WHAT HAPPENS WHEN AN ARTIST I BELIEVE IN GROWS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Congratulations! You’ve helped someone on their way up and now
              they’re on they’re on their way up. Supertrue saves your spot in
              time that you’ve backed that artist, and gives them the ability to
              reward their supertrue fans. How exactly they do it is up to them.
              We suggest to artist to give early access, exclusive shows, and
              special merch only available to their supertrue fans.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="faqs">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4">
              CAN I SELL OR TRADE MY SUPERTRUE NFT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you’re ready auction off one of the special pieces of your
              collection as it grows in value, that’s up to you. The artist will
              get a 20% cut of your sale and everyone will be happy. We
              understand the feeling of collecting your winnings and using them
              to find someone new who is about to make their start. Happy
              collecting! Happy trading!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Container>
  );
}
