import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

import { useAppContext } from "~/contexts/app";
import { getSession, destroySession } from "~/sessions.server";

const styles = {
  centerContainer: {
    textAlign: "center",
  },
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const headers = new Headers();
  headers.append("Set-Cookie", await destroySession(session));
  headers.append(
    "Set-Cookie",
    `token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax`
  );

  return redirect("/account/login", {
    headers,
  });
};

export default function Logout() {
  const fetcher = useFetcher();
  const { magic } = useAppContext();
  const account = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    let loggedOut = false;

    if (account.isConnected) {
      disconnect();
      loggedOut = true;
    }

    magic.user.isLoggedIn().then(async (isLoggedIn) => {
      if (isLoggedIn) {
        await magic.user.logout();
        loggedOut = true;
      }

      document.cookie =
        "token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax";

      if (loggedOut) {
        window.location.reload();
      } else {
        fetcher.submit({}, { method: "post" });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box sx={styles.centerContainer}>
        <Typography variant="h2" mb={4}>
          Logging out..
        </Typography>
        <CircularProgress />
      </Box>
    </Container>
  );
}
