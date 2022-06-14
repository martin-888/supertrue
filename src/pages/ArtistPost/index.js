import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Container, Box, Typography } from "@mui/material";

import CreatePost from "./sections/CreatePost";
import SinglePost from "../../components/SinglePost";

const ME_QUERY = gql`
  query me($address: ID!) {
    dbMe {
      address
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
  // const [loadingPosts, setLoadingPosts] = useState(false);
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
  // what's purpose of delaying showing content to user??
  // useEffect(() => {
  //   setLoadingPosts(true);
  //   setTimeout(() => setLoadingPosts(false), 1500);
  // }, [me]);

  const renderPosts = () => {
    if (loading) {
      return (
        <Box sx={styles.loadingSpinner}>
          <CircularProgress />
        </Box>
      );
    }

    if (!me?.collection?.posts?.length) {
      return <Typography>No post found.</Typography>;
    }

    return reverseOrderedPost.map((p) => (
      <SinglePost
        post={p}
        artistName={me?.collection?.name}
        artistId={me?.collection?.artistId}
        instagram={me?.collection?.instagram}
        hasEditingRights={true}
      />
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
