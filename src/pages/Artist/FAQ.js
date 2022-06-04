import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import "./Artist.scss";

/**
 * Component: FAQ
 */
export default function FAQ() {
  return (
    <Box>
      <Typography mt={"40px"} mb={"20px"} variant="h4">
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
            out to build a supertrue following and reaches 1,000 fans, they have
            8k USD to master their album. At 10,000 fans they have 100,000 USD
            to go on tour. All the while you benefit by getting credit you
            deserve of supporting them when they needed it the most.
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
            get a 20% cut of your sale and everyone will be happy. We understand
            the feeling of collecting your winnings and using them to find
            someone new who is about to make their start. Happy collecting!
            Happy trading!
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
