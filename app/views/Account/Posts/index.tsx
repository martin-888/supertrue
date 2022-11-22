import React from "react";
import { useQuery } from "@apollo/client";
import { CircularProgress, Container, Box, Typography } from "@mui/material";
import { gql } from '~/__generated__/gql';

import CreatePost from "~/components/CreatePost";
import Post from "~/components/Post";

const ME_QUERY = gql(`
  query mePosts {
    me {
      id
      collection {
        id
        address
        name
        artistId
        username
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
`);

const styles = {
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
  },
};

export default function ArtistPost() {
  const { data, loading } = useQuery(ME_QUERY);

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

    const collection = data.me.collection;

    return collection!.posts!.map((p) => (
      <Box key={p!.id} mb={4}>
        <Post
          post={p}
          artistName={collection.name}
          username={collection.username || ""}
          artistId={collection.artistId}
          instagram={collection.instagram}
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
