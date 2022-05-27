import React, { useState } from "react";
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

const styles = {
  postBox: {
    border: 1,
    borderColor: "grey.400",
    borderRadius: "0.7rem",
    "&:hover": {
      boxShadow: 2,
    },
    marginTop: 5,
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
  postMessageBox: {
    paddingBottom: 1,
  },
  postMessage: {
    fontSize: { xs: "0.8rem", sm: "1rem" },
    lineHeight: { xs: "1.3rem", sm: "1.5rem" },
  },
  icons: {
    fontSize: "1.1rem",
  },
};

export default function SinglePost({ post }) {
  const [message, setMessage] = useState(post.message);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  // NOTE skeleton handler functions for edit and delete a post
  const editPost = () => {
    setIsEditing(true);
    console.log("changed");
  };

  const saveChanges = () => {
    console.log({ message });
    setLoading(true);
    setTimeout(submitChanges, 3000);
  };

  const submitChanges = () => {
    setLoading(false);
    setIsEditing(false);
    setMessage(post.message);
  };

  const resetChanges = () => {
    setIsEditing(false);
    setMessage(post.message);
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

  return (
    <Box
      key={post.id}
      sx={{ ...styles.postBox, boxShadow: isEditing || isDeleting ? 2 : null }}
    >
      <Box sx={styles.postTop}>
        <Box sx={styles.postHeader}>
          <Box sx={styles.authorBox}>
            <img
              src={post.authorImageURl}
              alt="Author Profile"
              style={styles.profileImage}
            />
            <Box sx={styles.authorText}>
              <Typography sx={styles.authorName}>{post.authorName}</Typography>
              <Typography sx={styles.socialMediaHandle}>
                {post.socialMediaHandle}
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.infoTextbox}>
            <Typography
              sx={styles.infoText}
            >{`Posted for ${post.fanReachLabel}`}</Typography>
            <Typography
              sx={styles.infoText}
              fontWeight={"bold"}
              pl={2.5}
            >{`${post.pastTimeLabel}`}</Typography>
          </Box>
        </Box>
        <Box sx={styles.postMessageBox}>
          {isEditing ? (
            <Box>
              <TextField
                multiline
                fullWidth
                value={message}
                onChange={(m) => setMessage(m.target.value)}
                sx={{ paddingBottom: 2 }}
                disabled={loading}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginRight: 2 }}
                  onClick={resetChanges}
                  disabled={loading}
                >
                  Reset
                </Button>
                {loading ? (
                  <Box textAlign="center">
                    <CircularProgress size={"1.7rem"} />
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={saveChanges}
                  >
                    Save
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Typography sx={styles.postMessage}>{message}</Typography>
          )}
        </Box>
      </Box>
      <Divider />
      <Box sx={styles.postBottom}>
        {!isDeleting && (
          <>
            <IconButton color="primary" onClick={editPost} disabled={isEditing}>
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
              sx={{ marginRight: 2 }}
              onClick={() => setIsDeleting(false)}
            >
              No, don't delete
            </Button>
            <Button variant="contained" size="small" onClick={deletePost}>
              Yes, I'm sure!
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
