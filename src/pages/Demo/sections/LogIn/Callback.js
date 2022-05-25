import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
    mutation login(
        $input: LogInMagicLinkInput!
    ) {
        LogInMagicLink(input: $input) {
            token
        }
    }
`;

export default function Callback({ magic }) {
  const redirectUrl = "/demo";

  const logout = async () => {
    await magic.user.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    console.log("logout redirect");
    window.location.href=redirectUrl;
  };

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: async ({ LogInMagicLink }) => {
      const metadata = await magic.user.getMetadata();
      console.log("metadata.publicAddress", metadata.publicAddress, metadata)
      localStorage.setItem("address", metadata.publicAddress);
      localStorage.setItem("token", LogInMagicLink.token);
      console.log("onCompleted redirect");
      window.location.href=redirectUrl;
    },
    onError: e => {
      console.log("loginMutation error", e);
      logout();
    }
  });

  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    magic.auth.loginWithCredential()
      .then(() => magic.user.getIdToken())
      .then((token) => loginMutation({ variables: { input: { token } } }))
      .catch(e => {
        console.log("loginWithCredential fail", e);
        logout();
      })
  }, []);

  return <h2 style={{ margin: "5em 0" }}>Loggin in...</h2>;
}

