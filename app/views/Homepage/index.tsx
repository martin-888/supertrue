import { useState } from "react";
import { Box, Tab, Tabs, Container } from "@mui/material";

import ArtistSearch from "./tabs/ArtistSearch";
import NewsFeed from "./tabs/NewsFeed";
import NFTs from "./tabs/NFTs";

const tabContent = [
  {
    label: "Search & Discover",
    content: <ArtistSearch />,
  },
  {
    label: "My Artist Feed",
    content: <NewsFeed />,
  },
  {
    label: "My NFTs",
    content: <NFTs />,
  },
];

export default function Homepage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          scrollButtons="auto"
          variant="scrollable"
          value={tabValue}
          onChange={(e, value) => setTabValue(value)}
        >
          {tabContent.map(({ label }) => <Tab label={label} key={label} />)}
        </Tabs>
      </Box>

      <Box>
        <Box sx={{ paddingX: 0, paddingY: 4 }}>{tabContent[tabValue].content}</Box>
      </Box>
    </Container>
  );
}
