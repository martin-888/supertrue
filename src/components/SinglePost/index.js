import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import humanizeDuration from "humanize-duration";
import { loremIpsum } from "lorem-ipsum";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LockIcon from "@mui/icons-material/Lock";
import __ from "helpers/__";
import placeholderArtistImage from "assets/img/no-user-image.png";
import brandOverlay from "assets/img/myCanvas-inverted_1000x350px.png";

const styles = {
  postBox: {
    position: "relative",
    border: 1,
    borderColor: "grey.400",
    borderRadius: "0.7rem",
    "&:hover": {
      boxShadow: 2,
    },
    marginBottom: 4,
  },
  postTop: {
    padding: { xs: 2, md: 3 },
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 3,
  },
  postBottom: {
    paddingLeft: { xs: 1, md: 2 },
    paddingTop: 0.7,
    paddingBottom: 0.7,
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
    backdropFilter: "blur(2.5px)",
    borderRadius: "0.7rem",
    zIndex: 5,
  },
  lockerIcon: {
    fontSize: "45px",
    marginRight: "10px",
  },
};

const UPDATE_COLLECTION_MUTATION = gql`
  mutation update($input: UpdateCollectionInput!) {
    UpdateCollection(input: $input) {
      collection {
        id
        posts {
          content
        }
      }
    }
  }
`;

export default function SinglePost({
  post,
  artistName,
  artistId,
  instagram,
  hasEditingRights,
}) {
  const [content, setContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const artistImage = __.getArtistImage(artistId);

  const submitChanges = () => {
    setLoading(false);
    setIsEditing(false);
    // setMessage(post.content);
  };

  // NOTE skeleton handler functions for edit and delete a post
  const editPost = () => {
    setIsEditing(true);
  };
  const resetChanges = () => {
    setIsEditing(false);
    // setMessage(post.content);
  };
  const saveChanges = () => {
    setLoading(true);
    setTimeout(submitChanges, 3000);
  };
  const deletePost = () => {
    if (isDeleting) {
      console.log("will delete post for sure");
      setIsDeleting(false);
    } else {
      console.log("post not deleted yet");
      setIsDeleting(true);
    }
  };

  const humanizedCreatedAtTime = humanizeDuration(
    new Date().getTime() - Date.parse(post.createdAt),
    { largest: 1, maxDecimalPoints: 0 }
  );

  const updateCollection = () => {
    setUpdating(true);
    updateCollectionMutation();
  };

  const [updateCollectionMutation] = useMutation(UPDATE_COLLECTION_MUTATION, {
    variables: { input: { content } },
    onCompleted: () => {
      setTimeout(() => setUpdating(false), 1500);
    },
    onError: (e) => {
      console.log(e.message);
      setUpdating(false);
    },
  });

  const CONTENT = content || loremIpsum();

  return (
    <Box
      key={post.createdAt}
      sx={{
        ...styles.postBox,
        boxShadow: isEditing || isDeleting ? 2 : null,
      }}
    >
      {!content && (
        <>
          <Box sx={styles.hiddenLayerFirst}>
            <LockIcon color="primary" opacity={0.8} sx={styles.lockerIcon} />
            <Typography>
              {`Posted only for 1 - ${post.lastNftID}.`}
              <br />
              {" >"}Get your Supertrue NFT
            </Typography>
          </Box>
          <Box sx={styles.hiddenLayerSecond} />
          <Box sx={styles.hiddenLayerThird} />
        </>
      )}
      <Box sx={styles.postTop}>
        <Box sx={styles.postHeader}>
          <Box sx={styles.authorBox}>
            <img
              src={artistImage}
              onError={(e) => {
                e.target.src = placeholderArtistImage;
              }}
              alt="Author Profile"
              style={styles.profileImage}
            />
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
            <Typography sx={styles.infoText} fontWeight={"bold"} pl={2.5}>
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
                  onClick={resetChanges}
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
                    onClick={updateCollection}
                  >
                    Save
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Typography sx={styles.postContent}>{CONTENT}</Typography>
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
                  onClick={editPost}
                  disabled={isEditing}
                >
                  <ModeEditOutlineOutlinedIcon sx={styles.icons} />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={deletePost}
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
                  variant="contained"
                  sx={{ marginRight: 2 }}
                  onClick={() => setIsDeleting(false)}
                >
                  No, don't delete
                </Button>
                <Button size="small" onClick={deletePost}>
                  Yes, I'm sure!
                </Button>
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
