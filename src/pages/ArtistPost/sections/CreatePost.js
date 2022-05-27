import React, { useState } from "react";
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

// NOTE placeholder to dynamically render MenuItems
const predefinedPostReaches = [
  {
    label: "All",
    start: 0,
    end: 1000,
  },
  {
    label: "0 - 10",
    start: 0,
    end: 10,
  },
  {
    label: "0 - 100",
    start: 0,
    end: 100,
  },
  {
    label: "0 - 1000",
    start: 0,
    end: 1000,
  },
];

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
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: { sm: "space-between" },
  },
  postAdditionSettings: {
    paddingLeft: { xs: 1, md: 2 },
    marginBottom: { xs: 1, sm: 0 },
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
};

export default function CreatePost() {
  const [message, setMessage] = useState("");
  const [postReach, setPostReach] = useState(predefinedPostReaches[0]);
  const [loading, setLoading] = useState(false);

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleChangeReach = (event: SelectChangeEvent) => {
    setPostReach(event.target.value);
  };

  const resetFields = () => {
    setLoading(false);
    setMessage("");
    setPostReach(predefinedPostReaches[0]);
  };

  // NOTE skeleton function to submit a post
  const submitPost = () => {
    console.log(message, postReach);
    setLoading(true);
    setTimeout(resetFields, 3000);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ ...styles.postBox, boxShadow: message ? 2 : null }}
    >
      <Grid container direction="column" sx={styles.postContainer}>
        <Grid item md={12}>
          <Box container sx={styles.postTextbox}>
            <TextField
              placeholder="What do you want to share..."
              variant="outlined"
              multiline
              fullWidth
              value={message}
              onChange={handleChangeMessage}
              disabled={loading}
            />
          </Box>
        </Grid>
        <Grid item md={12} sx={styles.postButtonBar}>
          <Box sx={styles.postAdditionSettings}>
            <Tooltip title="Feature is comming soon...">
              <IconButton color="primary">
                <AddPhotoAlternateOutlinedIcon sx={styles.icons} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box display="flex" sx={styles.postPrimaryButtons}>
            <Typography sx={styles.postReachTitle}>
              POST TO NFT HOLDERS
            </Typography>
            <FormControl sx={styles.postReachForm}>
              <InputLabel>Selection</InputLabel>
              <Select
                value={postReach}
                label="Selection"
                onChange={handleChangeReach}
                size="small"
                disabled={loading}
              >
                {predefinedPostReaches.map((reach) => (
                  <MenuItem key={reach.label} value={reach}>
                    {reach.label}
                  </MenuItem>
                ))}
                <MenuItem disabled={true} value={""}>
                  Custom
                </MenuItem>
              </Select>
            </FormControl>
            {loading ? (
              <Box textAlign="center">
                <CircularProgress />
              </Box>
            ) : (
              <Button
                color="primary"
                variant="contained"
                size="large"
                startIcon={<MessageIcon />}
                disabled={!message || !postReach}
                sx={styles.postSubmitButton}
                onClick={submitPost}
              >
                Post
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
