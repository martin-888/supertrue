import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Container,
} from "@mui/material";

import ArtistSearch from "~/components/ArtistSearch";
import NewsFeed from "~/components/NewsFeed";
import NFTs from "~/components/NFTs";

export const meta: MetaFunction = () => {
  return {
    title: "Supertrue"
  };
};

type TabPanelProps = {
  value: number;
  index: number;
  children: any;
};

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingX: 0, paddingY: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const tabContent = [
  {
    label: 'Search & Discover',
    content: <ArtistSearch/>,
  },
  {
    label: 'My Artist Feed',
    content: <NewsFeed/>,
  },
  {
    label: 'My NFTs',
    content: <NFTs/>,
  }
];

export default function Index() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Tabs
          scrollButtons="auto"
          variant="scrollable"
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
        >
          {tabContent.map(({label}, i) => (
            <Tab
              label={label}
              id={i}
              key={`tab-content-${i}`}
            />
          ))}
        </Tabs>
      </Box>

      {tabContent.map(({content}, i) => (
        <TabPanel
          value={tabValue}
          index={i}
          key={`tab-panel-${i}`}
        >
          {content}
        </TabPanel>
      ))}
    </Container>
  )
}
