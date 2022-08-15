import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { NavigateFunction } from "@remix-run/react";
import { json, MetaFunction, redirect } from "@remix-run/node";
import { useFetcher, useNavigate, useParams } from "@remix-run/react";
import { gql, useQuery } from "@apollo/client";
import { parse as cookieParse } from "cookie";
import { useEffect, useState, useCallback } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import invariant from "tiny-invariant";
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

import { isValidEmail } from "~/utils/validate";
import { getSession, commitSession } from "~/sessions.server";
import { apolloClient } from "~/contexts/apollo";
import { useAppContext } from "~/contexts/app";

export const meta: MetaFunction = () => {
  return {
    title: `Login | Supertrue`,
  };
};

export const styles = {
  marginBottom: {
    marginBottom: 2,
  },
  centerContainer: {
    textAlign: "center",
  },
  loginButton: {
    padding: 2,
    width: "100%",
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
  buttonContainer: {
    opacity: 0,
    pointerEvents: "none",
    userSelect: "none",
  },
};

const ME_QUERY = gql`
  query me {
    me {
      id
      address
    }
  }
`;

const CREATE_LOGIN_NONCE_MUTATION = gql`
  mutation logInSignature($input: CreateLogInNonceInput!) {
    CreateLogInNonce(input: $input) {
      nonce
    }
  }
`;

const LOGIN_SIGNATURE_MUTATION = gql`
  mutation logInSignature($input: LogInSignatureInput!) {
    LogInSignature(input: $input) {
      token
      me {
        id
        address
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie") || "");

  if (session.has("token") && session.has("address")) {
    const url = new URL(request.url);
    const red = url.searchParams.get("redirect") || "";
    // to avoid redirection outside of our website
    const useRedirectParam = red.length > 1 && red[0] === "/" && red[1] !== "/";

    return redirect(useRedirectParam ? red : "/");
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");

  switch (action) {
    case "createLogInNonce": {
      const address = form.get("address");
      const res = await apolloClient(request).mutate({
        mutation: CREATE_LOGIN_NONCE_MUTATION,
        variables: { input: { address } },
      });
      return json(res.data.CreateLogInNonce);
    }
    case "logInSignature": {
      const signature = form.get("signature");
      const nonce = form.get("nonce");

      let error;

      const res = await apolloClient(request)
        .mutate({
          mutation: LOGIN_SIGNATURE_MUTATION,
          variables: { input: { signature, nonce } },
        })
        .catch((e) => {
          error = e.message;
        });

      if (error) {
        return json({ error });
      }

      const data = res.data.LogInSignature;

      const session = await getSession(request.headers.get("Cookie"));

      session.set("token", data.token);
      session.set("address", data.me.address);

      const headers = new Headers();
      headers.append("Set-Cookie", await commitSession(session));
      headers.append(
        "Set-Cookie",
        `token=${data.token}; Max-Age=2592000; Path=/; Secure; SameSite=Lax`
      );

      // Login succeeded, send them to the home page.
      return json(
        { loginSuccess: true },
        {
          headers,
        }
      );
    }
  }
};

const createSignMessage = (
  address: string,
  nonce: string
) => `Welcome to SUPERTRUE!

Signing is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give permission to perform any transactions with your wallet.

Wallet address: ${address}

Nonce: ${nonce}`;

const ConnectButton = () => {
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const fetcher = useFetcher();
  const nonce = fetcher.data?.nonce;

  useEffect(() => {
    if (fetcher.data?.loginSuccess) {
      window.location.reload();
    } else if (fetcher.data?.error) {
      setError(fetcher.data?.error);
      console.error("Connect error", fetcher.data?.error);
      disconnect();
      setIsSigning(false);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!address) {
      return;
    }

    fetcher.submit(
      { _action: "createLogInNonce", address: address.toLowerCase() },
      { method: "post" }
    );
  }, [address]);

  const { signMessage } = useSignMessage({
    onSuccess: (signature) => {
      fetcher.submit(
        { _action: "logInSignature", signature, nonce },
        { method: "post" }
      );
    },
    onError: (e) => {
      setError(e.message);
      disconnect();
      console.log("signMessage error", e);
      setIsSigning(false);
    },
  });

  useEffect(() => {
    if (isConnected && address && nonce && !isSigning) {
      setIsSigning(true);
      signMessage({ message: createSignMessage(address.toLowerCase(), nonce) });
    }
  }, [isConnected, address, createSignMessage, signMessage, nonce, isSigning]);

  const buttonContent = "Log in with Web3 wallet";

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <Box sx={mounted ? {} : styles.buttonContainer}>
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    variant="contained"
                    onClick={openConnectModal}
                    sx={styles.loginButton}
                    disabled={isSigning}
                  >
                    {buttonContent}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    variant="contained"
                    onClick={openChainModal}
                    sx={styles.loginButton}
                    disabled={isSigning}
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button
                  variant="contained"
                  onClick={openAccountModal}
                  sx={styles.loginButton}
                  disabled={isSigning}
                >
                  {buttonContent}
                </Button>
              );
            })()}
          </Box>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

type EmailLoginProps = {
  magic: any;
  loading: boolean;
  navigate: NavigateFunction;
};

const EmailLogin = ({ magic, loading, navigate }: EmailLoginProps) => {
  const [email, setEmail] = useState("");

  const login = async () => {
    try {
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/account/login/callback", window.location.origin)
          .href,
      });
      const intervalId = setInterval(() => {
        const cookie = cookieParse(document.cookie || "");
        if (cookie?.token && cookie.token.length) {
          clearInterval(intervalId);
          navigate(0);
        }
      }, 1000);
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

export default function Login() {
  const { magic, isLoggedIn: isLoggedInContext } = useAppContext();
  const params = useParams();
  const navigate = useNavigate();
  const [isLoggedInMagicUser, setIsLoggedInMagicUser] = useState(false);
  const { data, loading, error } = useQuery(ME_QUERY);
  const [dataLoading, setDataLoading] = useState(loading);

  const logout = useCallback(async () => {
    if (isLoggedInMagicUser) await magic.user.logout();
    setIsLoggedInMagicUser(false);
  }, [isLoggedInMagicUser]);

  useEffect(() => {
    if (data?.me?.address && isLoggedInContext) {
      invariant(typeof params?.["*"] === "string", "URL param * should be set");
      navigate(params["*"] === "" ? "/" : `/${params["*"]}`);
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
          <Typography variant="h2">
            An error happened getting your login info, please try again.
          </Typography>
        </Box>
      )}

      <Paper elevation={3} sx={styles.paper}>
        <Stack spacing={2}>
          <Typography variant="h2" sx={styles.paperHeading}>
            Log In
          </Typography>
          <EmailLogin magic={magic} loading={dataLoading} navigate={navigate} />
          <Box sx={styles.divider}>
            <Divider />
          </Box>
          <ConnectButton />
        </Stack>
      </Paper>
    </Container>
  );
}
