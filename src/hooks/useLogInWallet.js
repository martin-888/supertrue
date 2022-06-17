import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import useWeb3Modal from "./useWeb3Modal";

const SIGNING_MESSAGE_QUERY = gql`
    query {
        signingMessage
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
                description
                username
                email
            }
        }
    }
`;

export default function useLogInWallet() {
  const [logging, setLogging] = useState(false);
  const [loginOnceAccountIsAvailable, setLoginOnceAccountIsAvailable] =
    useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginError, setLoginError] = useState(null);
  const {
    account,
    provider,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    loadWeb3ModalError,
    loading: web3ModalLoading
  } = useWeb3Modal();

  const { data, loading } = useQuery(SIGNING_MESSAGE_QUERY);

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
    setLogging(false);
  };

  const [loginMutation] = useMutation(LOGIN_SIGNATURE_MUTATION, {
    onCompleted: ({ LogInSignature }) => {
      setToken(LogInSignature.token);
      localStorage.setItem("address", account);
      localStorage.setItem("token", LogInSignature.token);
      window.location.reload();
    },
    onError: (e) => {
      setLoginError("Login mutation failed");
      console.log("loginMutation error", e);
      logout();
    },
  });

  const signMessage = async (nonce) => {
    const message = data.signingMessage
      .replace("***ADDRESS***", account)
      .replace("***NONCE***", nonce);

    const signature = await provider
      .send("personal_sign", [message, account])
      .catch((e) => {
        setLoginError(e.message);
        logout(); // Better to show message than immediately logout
      });

    if (!signature) {
      return;
    }

    await loginMutation({ variables: { input: { nonce, signature } } });
  };

  const [createLoginNonceMutation] = useMutation(CREATE_LOGIN_NONCE_MUTATION, {
    onCompleted: ({ CreateLogInNonce }) => signMessage(CreateLogInNonce.nonce),
    onError: (e) => {
      setLoginError("Getting login nonce failed");
      console.log("createLoginNonceMutation error", e);
      logout();
    },
  });

  const login = async () => {
    setLoginError(null);
    setLogging(true);

    if (!data?.signingMessage) {
      setLoginError("Missing signing message");
      setLogging(false);
      return;
    }
    if (!account || !provider) {
      const result = await loadWeb3Modal();

      if (result?.closed) {
        setLogging(false);
        return;
      }

      setLoginOnceAccountIsAvailable(true);
    }
    if (account && provider) {
      await createLoginNonceMutation({
        variables: { input: { address: account } },
      });
    }
  };

  useEffect(() => {
    if (loadWeb3ModalError) setLoginError(loadWeb3ModalError);
  }, [loadWeb3ModalError]);

  const isLoggedIn = !!token?.length && !!account;

  return {
    login,
    logout,
    isLoggedIn,
    logging: logging || loading || web3ModalLoading,
    loginError
  };
}
