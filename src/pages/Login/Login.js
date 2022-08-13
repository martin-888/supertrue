import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppContext } from "contexts/app";
import ConnectButton from "./ConnectButton";
import { isValidEmail } from "utils/validate";

export const styles = {
  marginBottom: {
    marginBottom: 2,
  },
  centerContainer: {
    textAlign: "center",
  },
  loginButton: {
    padding: 2,
  },
  paper: {
    padding: 4,
    paddingBottom: 6,
  },
  paperHeading: {
    textAlign: "center",
    marginBottom: 1,
  },
  divider: {
    paddingBottom: 2,
    paddingTop: 2,
  },
};

const EmailLogin = ({ magic, loading, refetch }) => {
  const [email, setEmail] = useState("");

  const login = async () => {
    try {
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/account/login-callback", window.location.origin)
          .href,
      });
      const intervalId = setInterval(() => {
          if (localStorage.getItem('token')) {
            clearInterval(intervalId);
            refetch();
          }
        },
        1000);
    } catch (e) {
      console.log("loginWithMagicLink error", e);
    }
  };

  return (
    <>
      <TextField
        label="Email address"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={styles.marginBottom}
      />
      <Button
        onClick={login}
        variant="contained"
        disabled={loading || !isValidEmail(email)}
        sx={styles.loginButton}
      >
        Log In
      </Button>
    </>
  );
};

export default function Login({ data, loading, error, refetch }) {
  const { magic } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedInMagicUser, setIsLoggedInMagicUser] = useState();
  const [dataLoading, setDataLoading] = useState(loading);

  const logout = useCallback(async () => {
    if (isLoggedInMagicUser) await magic.user.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    setIsLoggedInMagicUser(false);
  }, [isLoggedInMagicUser]);

  useEffect(() => {
    if (data?.me?.address) {
      location.pathname === "/account/login" ? navigate("/") : navigate(0);
    }

    setDataLoading(true);
    magic.user.isLoggedIn().then((isLoggedIn) => {
      setIsLoggedInMagicUser(isLoggedIn);
      setDataLoading(false);
    });
  }, [data]);

  useEffect(() => {
    if (!loading && !data?.me?.address && isLoggedInMagicUser) logout();
  }, [loading, data, isLoggedInMagicUser, logout]);

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
      {error && (
        <Box sx={styles.centerContainer}>
          <Typography variant="h2" sx={styles.loadingContent}>
            An error happened getting your login info, please try again.
          </Typography>
        </Box>
      )}

      <Paper elevation={3} sx={styles.paper}>
        <Stack spacing={2}>
          <Typography variant="h2" sx={styles.paperHeading}>
            Log In
          </Typography>
          <EmailLogin magic={magic} loading={dataLoading} refetch={refetch} />
          <Box sx={styles.divider}>
            <Divider />
          </Box>
          <ConnectButton />
        </Stack>
      </Paper>
    </Container>
  );
}
