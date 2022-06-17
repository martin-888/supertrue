import React, { useEffect, useState, useCallback } from "react";
import {gql, useQuery} from "@apollo/client";

const ME_QUERY = gql`
    query me {
        me {
            id
            address
        }
    }
`;

export default function LoggedIn({ magic }) {
  const [userMetadata, setUserMetadata] = useState();
  const [token, setToken] = useState();
  const [magicIsLoggedIn, setMagicIsLoggedIn] = useState(null);
  const [email, setEmail] = useState();
  const { data, loading, error, refetch } = useQuery(ME_QUERY);

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then(isLoggedIn => {
      if (!isLoggedIn) {
        setMagicIsLoggedIn(false);
      } else {
        magic.user.getMetadata().then(data => {
          setUserMetadata(data);
          setMagicIsLoggedIn(true);
        });
        magic.user.getIdToken().then(setToken);
      }
    });
  }, []);

  const logout = async () => {
    if (magicIsLoggedIn === true) {
      await magic.user.logout();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    refetch();
  };

  useEffect(() => {
    if (loading || magicIsLoggedIn == null) {
      return;
    }
    console.log({loading, magicIsLoggedIn, userMetadata, data})
    if (magicIsLoggedIn && !data?.me?.address) {
      logout();
      return;
    }
    if (userMetadata?.publicAddress && !data?.me?.address) {
      logout();
      return;
    }
    if (userMetadata?.publicAddress !== data?.me?.address) {
      logout();
    }
  }, [userMetadata, data, loading, magicIsLoggedIn]);

  const login = useCallback(async () => {
    try {
      await magic.auth.loginWithMagicLink({
        email,
        // redirectURI can be changed based on current page
        redirectURI: new URL("/demo/callback", window.location.origin).href,
      });
    } catch(e) {
      console.log("loginWithMagicLink error", e)
    }
  }, [email]);

  return (
    <div>
      logged-in: {magicIsLoggedIn ? "true" : "false"}<br/>

      <div>
        email: <input value={email} onChange={e => setEmail(e.target.value)} disabled={magicIsLoggedIn} />
        <button onClick={login}>Connect Wallet</button>
      </div>

      <button onClick={logout} disabled={!magicIsLoggedIn}>Log Out</button><br/>

      userMetadata publicAddress: {userMetadata?.publicAddress}<br/>
      userMetadata email: {userMetadata?.email}<br/>
      userMetadata issuer: {userMetadata?.issuer}<br/>
    </div>
  );
}
