import {
  Typography,
  Box,
  CircularProgress,
  Link
} from "@mui/material";
import SinglePost from "components/SinglePost";
import {
  gql,
  useQuery
} from "@apollo/client";
import { ConditionalWrapper } from "utils/helperComponents";

const styles = {
  infoText: {
    fontSize: {
        xs: "0.6rem",
        sm: "0.8rem"
    },
    fontWeight: "bold",
    paddingLeft: 2.5,
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
  },
  loaderContainer: {
    textAlign: "center",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  }
};

const NEWSFEED_QUERY = gql`
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
            }
        }
    }
  }
`;

const getPostHeader = (tokenId, name) => tokenId ? `You own Supertrue #${tokenId} for ${name}` : null;

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
          <Typography variant="h2">An error occurred loading posts, please refresh page.</Typography>
        </Box>
      )}

      {data?.posts.map(
        (post, i) => {
          const {author, content, lastNftID} = post;
          const ownedArtistNftToken = data?.me?.nfts.find(nft => nft.artistId === Number(author.artistId));
          return (
            <div key={i}>
              <Typography sx={styles.infoText}>
                {
                  content ?
                  getPostHeader(ownedArtistNftToken?.tokenId, author.collection.name) :
                  ownedArtistNftToken ?
                      `You own Supertrue #${ownedArtistNftToken.tokenId} for ${author.artistId}. You need 1-${lastNftID} to access` :
                      `You need 1-${lastNftID} to access ${author.collection.name}'s posts`
                }
              </Typography>

              <Box sx={styles.postContainer}>
                <Box sx={styles.postWrapper}>
                  <ConditionalWrapper
                    condition={!content}
                    wrapper={children => <Link href={`/s/${author.artistId}`} sx={styles.link}>{children}</Link>}>
                    <SinglePost
                      post={post}
                      artistName={author.collection.name}
                      artistId={author.artistId}
                      instagram={author.collection.name}
                      hasEditingRights={false}
                    />
                  </ConditionalWrapper>
                </Box>
              </Box>
            </div>
          )
        }
      )}
    </>
  )
}
