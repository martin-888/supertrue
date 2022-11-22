import type { ActionFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useNavigate, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import { gql } from '~/__generated__/gql';

import { useAppContext } from "~/contexts/app";
import { apolloClient } from "~/contexts/apollo";
import { commitSession, getSession } from "~/sessions.server";

const styles = {
  centerContainer: {
    textAlign: "center",
  },
};

const LOGIN_MUTATION = gql(`
  mutation login($input: LogInMagicLinkInput!) {
    LogInMagicLink(input: $input) {
      token
    }
  }
`);

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const token = form.get("token");

  let error;

  const res = await apolloClient(request)
    .mutate({
      mutation: LOGIN_MUTATION,
      variables: { input: { token } },
    })
    .catch((e) => {
      error = e.message;
    });

  if (error) {
    return json({ error });
  }

  const data = res?.data?.LogInMagicLink;

  const session = await getSession(request.headers.get("Cookie"));

  session.set("token_api", data.token);
  session.set("address", data.me.address);

  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));
  headers.append(
    "Set-Cookie",
    `token_api=${data.token}; Max-Age=2592000; Path=/; Secure; SameSite=Lax`
  );

  // Login succeeded, send them to the home page.
  return json(
    { loginSuccess: true },
    {
      headers,
    }
  );
};

export default function Callback() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const { magic } = useAppContext();

  useEffect(() => {
    if (!fetcher.data?.error && !isError) {
      return;
    }

    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      navigate("/account/logout");
    }, 3000);
  }, [fetcher.data, navigate, isError]);

  useEffect(() => {
    // On mount, we try to login with a Magic credential token in the URL query.
    magic.auth
      .loginWithCredential()
      .then((token) => {
        if (!token) {
          setIsError(true);
          throw Error("Token not obtained from magic.link");
        }
        fetcher.submit({ token }, { method: "post" });
      })
      .catch((e) => {
        console.log("loginWithCredential error", e);
      });
  }, [setIsError, magic, fetcher]);

  if (isError || fetcher.data?.error) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Box sx={styles.centerContainer}>
          <Typography variant="h2" mb={4}>
            Something went wrong during your log in, please try it again.
          </Typography>
          <Typography variant="h2" mb={4}>
            You're being redirected to login page now..
          </Typography>
        </Box>
      </Container>
    );
  }

  if (fetcher.data?.loginSuccess) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Box sx={styles.centerContainer}>
          <Typography variant="h2">
            You've been logged in. You can close this page now.
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
  );
}
