import React, { useState, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Container, Box, Typography } from "@mui/material";
import CreatePost from "./sections/CreatePost";
import SinglePost from "./sections/SinglePost";

const ME_QUERY = gql`
  query me($address: ID!) {
    currentAddress
    dbMe {
      address
      email
    }
    me: user(id: $address) {
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
  const [loadingPosts, setLoadingPosts] = useState(false);

  const address = localStorage.getItem("address");
  const { data, loading, error } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address,
  });

  const me = useMemo(
    () => ({
      ...data?.me,
      ...data?.dbMe,
    }),
    [data]
  );

  // NOTE quick and dirty approach, could breaks if db ordering of post' change
  const reverseOrderedPost = me?.collection?.posts.slice(0).reverse();

  // Delay the rendering of posts to make it smoother
  useEffect(() => {
    setLoadingPosts(true);
    setTimeout(() => setLoadingPosts(false), 1500);
  }, [me]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={styles.loadingSpinner}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {!data?.dbMe && (
        <Typography mb={2}>You've to be login for posting.</Typography>
      )}
      {!data?.me?.collection && (
        <Typography mb={6}>
          You've to create collection first for posting.
        </Typography>
      )}
      <CreatePost collection={data?.me?.collection} />
      {!me?.collection?.posts?.length ? (
        <Typography>No posts exist.</Typography>
      ) : loadingPosts ? (
        <Box sx={styles.loadingSpinner}>
          <CircularProgress />
        </Box>
      ) : (
        reverseOrderedPost.map((p) => (
          <SinglePost
            post={p}
            artistName={me?.collection?.name}
            artistId={me?.collection?.artistId}
            instagram={me?.collection?.instagram}
          />
        ))
      )}
    </Container>
  );
}
