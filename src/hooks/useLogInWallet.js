import { useCallback, useState } from "react";
import {
  gql,
  useMutation
} from "@apollo/client";
import {
  useAccount,
  useSignMessage,
  useDisconnect
 } from "wagmi";

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

const createSignMessage = (address, nonce) => `Welcome to SUPERTRUE!

Signing is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give permission to perform any transactions with your wallet.

Wallet address: ${address}

Nonce: ${nonce}`;

export default function useLogInWallet() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginError, setLoginError] = useState(null);

  let { address } = useAccount();
  address = address?.toLowerCase();
  const { disconnect } = useDisconnect();

  //1. create an area in the db using the address to store a nonce value
  const startSupertrueLoginFlow = useCallback(
    async (address) => {
      await createLoginNonceMutation({
        variables: { input: { address } },
      });
  }, [address]);

  //2. get the user to sign a message to verify us/them.
  const [createLoginNonceMutation] = useMutation(CREATE_LOGIN_NONCE_MUTATION, {
    onCompleted: ({ CreateLogInNonce }) => {
      const message = createSignMessage(address, CreateLogInNonce.nonce);
      signMessage({ message, nonce: CreateLogInNonce.nonce });
    },
    onError: (e) => {
      setLoginError("Getting login nonce failed");
      console.log("createLoginNonceMutation error", e);
      logout();
    },
  });

  //3. upon signing, send signature to the server using the nonce as a lookup.
  const {signMessage} = useSignMessage({
    onSuccess(signature, {nonce}) {
      loginMutation({ variables: { input: { nonce, signature } } });
    },
    onError(e) {
      setLoginError("signMessage failed");
      console.log("signMessage error", e);
      logout();
    },
  });

  //4. upon successful login, store token in local storage for API calls and redirect to home page.
  const [loginMutation] = useMutation(LOGIN_SIGNATURE_MUTATION, {
    onCompleted: ({ LogInSignature }) => {
      setToken(LogInSignature.token);
      localStorage.setItem("address", address);
      localStorage.setItem("token", LogInSignature.token);
      window.location.reload();
    },
    onError: (e) => {
      setLoginError("Login mutation failed");
      console.log("loginMutation error", e);
      logout();
    },
  });

  const logout = () => {
    disconnect();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    setToken(null);
    window.location.reload();
  };

  const isLoggedIn = !!token?.length && !!address;

  return {
    startSupertrueLoginFlow,
    logout,
    isLoggedIn,
    loginError
  };
}
