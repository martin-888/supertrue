import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import humanizeDuration from "humanize-duration";
import { loremIpsum } from "lorem-ipsum";
import {
  Box,
  Link,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LockIcon from "@mui/icons-material/Lock";
import { gql } from '~/__generated__/gql';

import { getArtistImage } from "~/utils/imageUrl";
import { ConditionalWrapper } from "~/utils/helperComponents";

import placeholderArtistImage from "~/assets/img/no-user-image.png";
import brandOverlay from "~/assets/img/dots.png";

const styles = {
  postBox: {
    position: "relative",
    "&:hover": {
      boxShadow: 4,
    },
  },
  postTop: {
    padding: { xs: 2, md: 3 },
  },
  postTopBlur: {
    padding: { xs: 2, md: 3 },
    filter: "blur(10px)",
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 3,
  },
  postBottom: {
    paddingLeft: { xs: 2, md: 3 },
    paddingTop: 1,
    paddingBottom: 1,
    minHeight: "35px",
  },
  authorBox: {
    display: "flex",
  },
  profileImage: {
    maxHeight: "50px",
    borderRadius: "0.2rem",
  },
  authorName: {
    fontWeight: "bold",
    fontSize: { xs: "0.8rem", sm: "1rem" },
    lineHeight: { xs: 1.2, sm: 1.5 },
  },
  authorText: {
    paddingLeft: 1,
  },
  infoTextbox: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
  },
  infoText: {
    fontSize: { xs: "0.6rem", sm: "0.8rem" },
    color: "grey.400",
    textAlign: "end",
  },
  socialMediaHandle: {
    color: "grey.800",
    fontWeight: "bold",
    paddingTop: 1,
    fontSize: { xs: "0.7rem", sm: "0.8rem" },
  },
  postTextbox: {
    padding: { xs: 2, md: 3 },
  },
  postContentBox: {
    paddingBottom: 1,
  },
  postContent: {
    fontSize: { xs: "0.8rem", sm: "1rem" },
    lineHeight: { xs: "1.3rem", sm: "1.5rem" },
  },
  icons: {
    fontSize: "1.1rem",
  },
  hiddenLayerFirst: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
  },
  postedFor: {
    maxWidth: "60%",
  },
  hiddenLayerSecond: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${brandOverlay})`,
    opacity: "0.1",
    zIndex: 10,
  },
  hiddenLayerThird: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(10px)",
    borderRadius: 1,
    zIndex: 5,
  },
  lockerIcon: {
    fontSize: "45px",
    marginRight: 2,
  },
};

const UPDATE_POST_MUTATION = gql(`
  mutation updatePost($input: UpdatePostInput!) {
    UpdatePost(input: $input) {
      collection {
        id
        posts {
          content
        }
      }
    }
  }
`);

const DELETE_POST_MUTATION = gql(`
  mutation deletePost($input: DeletePostInput!) {
    DeletePost(input: $input) {
      collection {
        id
        posts {
          id
        }
      }
    }
  }
`);

type PostType = {
  post: any;
  artistName: string;
  artistId: number;
  username: string;
  instagram: string;
  hasEditingRights?: boolean;
};

type PostType = {
  post: any;
  artistName: string;
  artistId: number;
  username: string;
  instagram: string;
  hasEditingRights?: boolean;
};

export default function Post({
  post,
  artistName,
  artistId,
  username,
  instagram,
  hasEditingRights = false,
}: PostType) {
  const [content, setContent] = useState(post.content || loremIpsum());
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const artistImage = getArtistImage(artistId);

  const humanizedCreatedAtTime = humanizeDuration(
    new Date().getTime() - Date.parse(post.createdAt),
    { largest: 1, maxDecimalPoints: 0 }
  );

  const [updatePostMutation] = useMutation(UPDATE_POST_MUTATION, {
    variables: {
      input: { content, id: post.id.toString(), lastNftID: post.lastNftID },
    },
    onCompleted: () => {
      setUpdating(false);
      setIsEditing(false);
    },
    onError: (e) => {
      console.log(e.message);
      setUpdating(false);
    },
  });

  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION, {
    variables: { input: { id: post.id.toString() } },
    onCompleted: () => {
      setUpdating(false);
      setIsEditing(false);
      setIsDeleting(false);
    },
    onError: (e) => {
      console.log(e.message);
      setUpdating(false);
      setIsDeleting(false);
    },
  });

  return (
    <Paper
      elevation={2}
      sx={{
        ...styles.postBox,
        boxShadow: isEditing || isDeleting ? 4 : null,
      }}
    >
      {!post.content && (
        <>
          <Box sx={styles.hiddenLayerFirst}>
            <LockIcon color="primary" opacity={0.8} sx={styles.lockerIcon} />
            <Typography sx={styles.postedFor}>
              Posted only for 1-{post.lastNftID}.
              <br />
              Get your Supertrue NFT
            </Typography>
          </Box>
          <Box sx={styles.hiddenLayerSecond} />
          <Box sx={styles.hiddenLayerThird} />
        </>
      )}
      <Box sx={post.content ? styles.postTop : styles.postTopBlur}>
        <Box sx={styles.postHeader}>
          <Box sx={styles.authorBox}>
            <ConditionalWrapper
              condition={post.content}
              wrapper={(children) => (
                <Link href={`/${username}`}>{children}</Link>
              )}
            >
              <img
                src={artistImage}
                onError={(e) => {
                  e.target.src = placeholderArtistImage;
                }}
                alt="Author Profile"
                style={styles.profileImage}
              />
            </ConditionalWrapper>
            <Box sx={styles.authorText}>
              <Typography sx={styles.authorName}>{artistName}</Typography>
              <Typography
                sx={styles.socialMediaHandle}
              >{`@${instagram}`}</Typography>
            </Box>
          </Box>
          <Box sx={styles.infoTextbox}>
            <Typography
              sx={styles.infoText}
            >{`Posted for 1-${post.lastNftID}`}</Typography>
            <Typography sx={styles.infoText} fontWeight={"bold"} pl={3}>
              {`${humanizedCreatedAtTime} ago`}
            </Typography>
          </Box>
        </Box>
        <Box sx={styles.postContentBox}>
          {isEditing ? (
            <Box>
              <TextField
                multiline
                fullWidth
                value={content}
                onChange={(m) => setContent(m.target.value)}
                sx={{ paddingBottom: 2 }}
                disabled={updating}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginRight: 2 }}
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                {updating ? (
                  <Box textAlign="center">
                    <CircularProgress size={"1.7rem"} />
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setUpdating(true);
                      updatePostMutation();
                    }}
                  >
                    Save
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Typography sx={styles.postContent}>{content}</Typography>
          )}
        </Box>
      </Box>
      {hasEditingRights && (
        <>
          <Divider />
          <Box sx={styles.postBottom}>
            {!isDeleting && (
              <>
                <IconButton
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                >
                  <ModeEditOutlineOutlinedIcon sx={styles.icons} />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => setIsDeleting(!isDeleting)}
                  disabled={isEditing}
                >
                  <DeleteOutlineOutlinedIcon sx={styles.icons} />
                </IconButton>
              </>
            )}
            {isDeleting && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ marginRight: 2 }}
                  onClick={() => setIsDeleting(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  disabled={updating}
                  onClick={() => {
                    setUpdating(true);
                    deletePostMutation();
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
}
