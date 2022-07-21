import { useEffect, useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styles }from "./Login";
import { useAppContext } from "contexts/app";

const LOGIN_MUTATION = gql`
    mutation login(
        $input: LogInMagicLinkInput!
    ) {
        LogInMagicLink(input: $input) {
            token
        }
    }
`;

const redirectUrl = "/";

export default function Callback() {
  const { magic} = useAppContext();
  const { user, auth } = magic;

  const logout = useCallback(async () => {
    await user.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    window.location.href = redirectUrl;
  }, [redirectUrl]);

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: async ({ LogInMagicLink }) => {
      const metadata = await user.getMetadata();
      localStorage.setItem("address", metadata.publicAddress);
      localStorage.setItem("token", LogInMagicLink.token);
      window.location.href = redirectUrl;
    },
    onError: e => {
      console.log("loginMutation error", e);
      logout();
    }
  });

  useEffect(() => {
    // On mount, we try to login with a Magic credential token in the URL query.
    auth.loginWithCredential()
      .then(() => user.getIdToken())
      .then((token) => loginMutation({ variables: { input: { token } } }))
      .catch(e => {
        console.log("loginWithCredential fail", e);
        logout();
      });
  //TODO: fix bug using magic consts as dependencies
  }, [loginMutation, logout]);

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box
      sx={styles.centerContainer}
      >
        <Typography
          variant="h2"
          sx={styles.marginBottom}
        >
          Logging you in...
        </Typography>
        <CircularProgress />
      </Box>
    </Container>
  )
}
