import { useEffect, useCallback, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styles }from "./Login";
import { useAppContext } from "contexts/app";
import { useNavigate } from "react-router-dom";

const LOGIN_MUTATION = gql`
    mutation login(
        $input: LogInMagicLinkInput!
    ) {
        LogInMagicLink(input: $input) {
            token
        }
    }
`;

export default function Callback({ refetch }) {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const { magic } = useAppContext();
  const { user, auth } = magic;

  const logout = useCallback(async () => {
    await user.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      navigate("/");
    }, 3000);
  }, [navigate]);

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: async ({ LogInMagicLink }) => {
      const metadata = await user.getMetadata();
      localStorage.setItem("address", metadata.publicAddress);
      localStorage.setItem("token", LogInMagicLink.token);
      refetch();
      navigate("/");
    },
    onError: async e => {
      console.log("loginMutation error", e);
      setIsError(true);
      await logout();
    }
  });

  useEffect(() => {
    // On mount, we try to login with a Magic credential token in the URL query.
    auth.loginWithCredential()
      .then(() => user.getIdToken())
      .then((token) => loginMutation({ variables: { input: { token } } }))
      .catch(e => {
        console.log("loginWithCredential fail", e);
        setIsError(true);
        return logout();
      });
  }, [loginMutation, logout]);

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Box sx={styles.centerContainer}>
          <Typography variant="h2" mb={4}>
            Something went wrong during your log in, please try it again.
          </Typography>
          <Typography variant="h2" mb={4}>
            You're being redirected to homepage now..
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box sx={styles.centerContainer}>
        <Typography variant="h2" mb={4}>
          Logging you in..
        </Typography>
        <CircularProgress />
      </Box>
    </Container>
  )
}
