import React from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Container, Box, Typography } from "@mui/material";

import CreatePost from "./sections/CreatePost";
import Post from "../../components/Post";

const ME_QUERY = gql`
  query me {
    me {
      id
      collection {
        id
        address
        name
        artistId
        instagram
        symbol
        posts {
          id
          lastNftID
          content
          createdAt
        }
      }
    }
  }
`;

const styles = {
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
  },
};

export default function ArtistPost() {
  const { data, loading, error } = useQuery(ME_QUERY);

  const renderPosts = () => {
    if (loading) {
      return (
        <Box sx={styles.loadingSpinner}>
          <CircularProgress />
        </Box>
      );
    }

    if (!data?.me?.collection?.posts?.length) {
      return <Typography>No posts found</Typography>;
    }

    return data.me.collection.posts.map((p) => (
      <Box mb={4}>
        <Post
          key={p.id}
          post={p}
          artistName={data.me.collection.name}
          artistId={data.me.collection.artistId}
          instagram={data.me.collection.instagram}
          hasEditingRights={true}
        />
      </Box>
    ));
  };

  return (
    <Container maxWidth="md">
      {!loading && !data?.me?.collection && (
        <Typography mb={6}>
          You've to create collection first for posting.
        </Typography>
      )}
      <CreatePost collection={data?.me?.collection} />
      {renderPosts()}
    </Container>
  );
}
