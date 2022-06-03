import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

// TODO Add option for "All"
const predefinedPostReaches = [10, 100, 1000];

const CREATE_POST_MUTATION = gql`
  mutation createPost($input: CreatePostInput!) {
    CreatePost(input: $input) {
      collection {
        id
        address
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
  postBox: {
    border: 1,
    borderColor: "grey.400",
    borderRadius: "0.7rem",
    "&:hover": {
      boxShadow: 2,
    },
    marginBottom: 10,
  },
  postTextbox: {
    padding: { xs: 2, md: 3 },
  },
  postTexfield: {
    fontSize: { xs: "0.8rem", sm: "1rem" },
    lineHeight: { xs: "1.3rem", sm: "1.5rem" },
  },
  postContainer: {
    paddingBottom: { xs: 2, md: 3 },
  },
  postButtonBar: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: { sm: "space-between" },
  },
  postPrimaryButtons: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "normal", sm: "center" },
    paddingLeft: { xs: 2, md: 3 },
    paddingRight: { xs: 2, md: 3 },
  },
  postReachTitle: {
    paddingBottom: { xs: 2, sm: 0 },
    paddingRight: { xs: 0, sm: 2 },
    textAlign: { xs: "center" },
    fontWeight: "bold",
  },
  postReachForm: {
    minWidth: 140,
    marginRight: { xs: 0, sm: 3 },
    marginBottom: { xs: 1, sm: 0 },
  },
  postSubmitButton: { marginTop: { xs: 2, sm: 0 } },
  icons: {
    fontSize: "1.1rem",
  },
  customReachSelector: {
    display: "flex",
    alignItems: "center",
    paddingRight: 1,
  },
  customReachItem: { paddingRight: 1 },
  customReachItemHidden: { display: "none" },
  customReachInput: { width: "80px", padding: "2px 5px" },
};

export default function CreatePost({ collection }) {
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [lastNftID, setLastNftID] = useState(predefinedPostReaches[1]);
  const [createPostError, setCreatePostError] = useState(null);

  const [createPostMutation] = useMutation(CREATE_POST_MUTATION, {
    variables: { input: { content, lastNftID } },
    onCompleted: () => {
      setLastNftID(100);
      setContent("");
      setCreating(false);
    },
    onError: (e) => {
      setCreatePostError(e.message);
      setCreating(false);
    },
  });

  const handleChangeMessage = (event) => {
    setContent(event.target.value);
  };

  const handleChangeReach = (event: SelectChangeEvent) => {
    setLastNftID(event.target.value);
  };

  const submitPost = () => {
    setCreating(true);
    setCreatePostError(null);
    createPostMutation();
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ ...styles.postBox, boxShadow: content ? 2 : null }}
    >
      <Grid container direction="column" sx={styles.postContainer}>
        <Grid item md={12}>
          <Box container sx={styles.postTextbox}>
            <TextField
              placeholder="What do you want to share..."
              variant="outlined"
              multiline
              fullWidth
              value={content}
              onChange={handleChangeMessage}
              disabled={!collection || creating}
            />
          </Box>
        </Grid>
        <Grid item md={12} sx={styles.postButtonBar}>
          <Box display="flex" sx={styles.postPrimaryButtons}>
            <Typography sx={styles.postReachTitle}>
              POST TO NFT HOLDERS
            </Typography>
            <FormControl sx={styles.postReachForm}>
              <InputLabel>Selection</InputLabel>
              <Select
                value={lastNftID}
                label="Selection"
                onChange={handleChangeReach}
                size="small"
                disabled={!collection || creating}
              >
                {predefinedPostReaches.map((reach) => (
                  <MenuItem key={reach} value={reach}>
                    {`1 - ${reach}`}
                  </MenuItem>
                ))}
                <MenuItem
                  value={lastNftID}
                  sx={styles.customReachItemHidden}
                >{`1 - ${lastNftID}`}</MenuItem>
                <Box sx={styles.customReachSelector}>
                  <MenuItem value={lastNftID} sx={styles.customReachItem}>
                    1 -
                  </MenuItem>
                  <TextField
                    type="number"
                    onClick={(event) => event.stopPropagation()}
                    value={lastNftID}
                    size="small"
                    sx={styles.customReachInput}
                    onChange={(e) =>
                      setLastNftID(
                        e.target.value < 1
                          ? 1
                          : Math.floor(Number(e.target.value))
                      )
                    }
                  />
                </Box>
              </Select>
            </FormControl>
            {creating ? (
              <Box textAlign="center">
                <CircularProgress />
              </Box>
            ) : (
              <Button
                color="primary"
                variant="contained"
                size="large"
                startIcon={<MessageIcon />}
                disabled={!content || !collection || creating}
                sx={styles.postSubmitButton}
                onClick={submitPost}
              >
                Post
              </Button>
            )}
            {createPostError && (
              <Typography color="red">{createPostError}</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
