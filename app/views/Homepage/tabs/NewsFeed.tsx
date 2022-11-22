import { Typography, Box, CircularProgress, Link } from "@mui/material";
import { useQuery } from "@apollo/client";
import { gql } from '~/__generated__/gql';

import Post from "~/components/Post";
import { ConditionalWrapper } from "~/utils/helperComponents";

const styles = {
  infoText: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    paddingX: 2.5,
    paddingBottom: 1,
    color: "grey.400",
    textAlign: "start",
  },
  postContainer: {
    padding: 2,
    paddingTop: 0,
  },
  postWrapper: {
    backgroundColor: "white",
    borderRadius: "0.7rem",
    marginBottom: 4,
  },
  loaderContainer: {
    textAlign: "center",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
};

const NEWSFEED_QUERY = gql(`
  query newsfeed {
    me {
      nfts {
        id
        artistId
        tokenId
      }
    }
    posts(first: 15) {
      id
      lastNftID
      content
      createdAt
      author {
        id
        artistId
        collection {
          instagram
          name
          username
        }
      }
    }
  }
`);

const getPostHeader = (tokenId: any, name: string) =>
  tokenId ? `You own Supertrue #${tokenId} for ${name}` : null;

export default function NewsFeed() {
  const { data, loading, error } = useQuery(NEWSFEED_QUERY);

  return (
    <>
      {loading && (
        <Box sx={styles.loaderContainer}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={styles.loaderContainer}>
          <Typography variant="h2">
            An error occurred loading posts, please refresh page.
          </Typography>
        </Box>
      )}

      {data?.posts?.map((post, i: number) => {
        const { author, content, lastNftID } = post;
        const ownedArtistNftToken = data?.me?.nfts!.find(
          (nft) => nft!.artistId === Number(author.artistId)
        );
        return (
          <div key={i}>
            <Typography sx={styles.infoText}>
              {content
                ? getPostHeader(
                    ownedArtistNftToken?.tokenId,
                    author.collection.name
                  )
                : ownedArtistNftToken
                ? `You own Supertrue #${ownedArtistNftToken.tokenId} for ${author.collection.name}. You need #1-${lastNftID} to see this post.`
                : `You need Supertrue #1-${lastNftID} to access ${author.collection.name}'s post.`}
            </Typography>

            <Box sx={styles.postContainer}>
              <Box sx={styles.postWrapper}>
                <ConditionalWrapper
                  condition={!content}
                  wrapper={(children) => (
                    <Link
                      href={`/${author.collection.username}`}
                      sx={styles.link}
                    >
                      {children}
                    </Link>
                  )}
                >
                  <Post
                    post={post}
                    artistName={author.collection.name}
                    artistId={author.artistId}
                    username={author.collection.username}
                    instagram={author.collection.name}
                    hasEditingRights={false}
                  />
                </ConditionalWrapper>
              </Box>
            </Box>
          </div>
        );
      })}
    </>
  );
}
