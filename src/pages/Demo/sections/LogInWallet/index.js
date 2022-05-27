import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import useWeb3Modal from "../../../../hooks/useWeb3Modal";

const chainId = Number.parseInt(process.env.REACT_APP_CHAIN_ID || 0, 10);

const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
  ],
  Message: [
    { name: 'message', type: 'string' }
  ]
};

const SIGNING_MESSAGE_QUERY = gql`
    query {
        signingMessage
    }
`;

const CREATE_LOGIN_NONCE_MUTATION = gql`
    mutation logInSignature(
        $input: CreateLogInNonceInput!
    ) {
        CreateLogInNonce(input: $input) {
            nonce
        }
    }
`;

const LOGIN_SIGNATURE_MUTATION = gql`
    mutation logInSignature(
        $input: LogInSignatureInput!
    ) {
        LogInSignature(input: $input) {
            token
        }
    }
`;

export default function LogInWallet() {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginOnceAccountIsAvailable, setLoginOnceAccountIsAvailable] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginError, setLoginError] = useState(null);
  const { account, provider, loadWeb3Modal, logoutOfWeb3Modal } = useWeb3Modal();

  const { data } = useQuery(SIGNING_MESSAGE_QUERY);

  useEffect(() => {
    if (!loginOnceAccountIsAvailable || !account || !provider) {
      return;
    }
    setLoginOnceAccountIsAvailable(false);
    createLoginNonceMutation({ variables: { input: { address: account } } });
  }, [loginOnceAccountIsAvailable, account, provider]);

  const logout = async () => {
    await logoutOfWeb3Modal();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    setToken(null);
    setLoggingIn(false);
  };

  const [loginMutation] = useMutation(LOGIN_SIGNATURE_MUTATION, {
    onCompleted: ({ LogInSignature }) => {
      setToken(LogInSignature.token);
      localStorage.setItem("address", account);
      localStorage.setItem("token", LogInSignature.token);
      window.location.reload();
    },
    onError: e => {
      setLoginError("Login mutation failed");
      console.log("loginMutation error", e);
      logout();
    }
  });

  const signMessage = async (nonce) => {
    const message = data.signingMessage
      .replace("***ADDRESS***", account)
      .replace("***NONCE***", nonce);

    const typedData = {
      types,
      primaryType: "Message",
      domain: {
        name: "Supertrue",
        version: "1",
        chainId,
      },
      message: {
        message,
      }
    };

    const signature = await provider.send("eth_signTypedData_v4", [account, JSON.stringify(typedData)])
      .catch(e => {
        setLoginError(e.message);
        logout();
      });

    if (!signature) {
      return;
    }

    await loginMutation({ variables: { input: { nonce, signature } } });
  }

  const [createLoginNonceMutation] = useMutation(CREATE_LOGIN_NONCE_MUTATION, {
    onCompleted: ({ CreateLogInNonce }) => signMessage(CreateLogInNonce.nonce),
    onError: e => {
      setLoginError("Getting login nonce failed");
      console.log("createLoginNonceMutation error", e);
      logout();
    }
  });

  const login = async () => {
    setLoginError(null);
    setLoggingIn(true);

    if (!data?.signingMessage) {
      setLoginError("Missing signing message");
      setLoggingIn(false);
      return;
    }
    if (!account || !provider) {
      await loadWeb3Modal();
      setLoginOnceAccountIsAvailable(true);
    }
    if (account && provider) {
      await createLoginNonceMutation({ variables: { input: { address: account } } });
    }
  }

  const isLoggedIn = token?.length && account;

  return (
    <section>
      <h3>Log In</h3>
      {loginError && <p>{loginError}</p>}
      {!isLoggedIn
        ? <button onClick={login} disabled={loggingIn}>Login</button>
        : <button onClick={logout}>Logout</button>
      }
    </section>
  );
}
