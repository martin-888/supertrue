import {
  useEffect,
  useState,
  useCallback
} from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Stack,
  Divider,
  Paper,
  useMediaQuery,
  useTheme
} from "@mui/material";
import useLogInWallet from "hooks/useLogInWallet";

const ME_QUERY = gql`
    query me {
        me {
            id
            address
        }
    }
`;

export const styles = {
  marginBottom: {
    marginBottom: 2,
  },
  centerContainer: {
    textAlign: "center",
  },
  buttonPadding: {
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
    paddingTop: 2
  }
};

const EmailLogin = ({ magic, loading }) => {
  // from https://stackoverflow.com/a/48800/1754819
  const isValidEmail = (email) => {
    const regex = /^\S+@\S+\.\S{2,}$/;
    return regex.test(email);
  }

  const [email, setEmail] = useState("");

  const login = async () => {
    try {
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/login-callback", window.location.origin).href,
      });
    } catch(e) {
      console.log("loginWithMagicLink error", e)
    }
  };

  return (
    <>
      <TextField
        label="Email address"
        type="email"
        variant="outlined"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        sx={styles.marginBottom}
      />
      <Button
        onClick={login}
        variant="contained"
        disabled={loading || !isValidEmail(email)}
        sx={styles.buttonPadding}
      >
        Log In
      </Button>
    </>
  );
}

const WalletLogin = ({ loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));
  const { login, logging, isLoggedIn } = useLogInWallet();

  useEffect(() => {
    if (isLoggedIn) window.location.href = "/";
  });

  return (
    <Button
      size={isMobile ? "medium" : "large"}
      variant="contained"
      onClick={login}
      disabled={loading || logging}
      sx={styles.buttonPadding}
    >
      Log in with Web3 wallet
    </Button>
  )
}

export default function Login({ magic }) {
  const [isLoggedInMagicUser, setIsLoggedInMagicUser] = useState();
  const { data, loading, error } = useQuery(ME_QUERY);
  const [dataLoading, setDataLoading] = useState(loading);

  const logout = useCallback(async () => {
    if (isLoggedInMagicUser) await magic.user.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    setIsLoggedInMagicUser(false);
  }, [isLoggedInMagicUser]);

  useEffect(() => {
    if (data?.me?.address) window.location.href = "/";

    setDataLoading(true);
    magic.user.isLoggedIn().then(isLoggedIn => {
      setIsLoggedInMagicUser(isLoggedIn);
      setDataLoading(false);
    });
  }, [data]);

  useEffect(() => {
    if (
      !loading &&
      !data?.me?.address &&
      isLoggedInMagicUser
    ) logout();
  }, [
    loading,
    data,
    isLoggedInMagicUser,
    logout
  ]);

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
      {error && (
        <Box sx={styles.centerContainer}>
          <Typography
          variant="h2"
          sx={styles.loadingContent}
        >
          An error happened getting your login info, please try again.
        </Typography>
        </Box>
      )}

      <Paper elevation={3} sx={styles.paper}>
        <Stack spacing={2}>
          <Typography variant="h2" sx={styles.paperHeading}>
            Log In
          </Typography>
          <EmailLogin magic={magic} loading={dataLoading} />
          <Box sx={styles.divider}>
            <Divider />
          </Box>
          <WalletLogin loading={dataLoading} />
        </Stack>
      </Paper>
    </Container>
  );
}
