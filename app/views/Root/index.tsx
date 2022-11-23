import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import type { MagicUserMetadata } from "magic-sdk";

import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useAppContext } from "~/contexts/app";
import { gql } from "~/__generated__";

const ROOT_QUERY = gql(`
  query rootQuery {
    me {
      ...HeaderFragment
    }
  }
`);

export default function Root({ children, address }) {
  const { magic } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const account = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState(!!address);

  const { data } = useQuery(ROOT_QUERY);

  const isLoginLogoutPage =
    location.pathname.indexOf("/account/login") !== -1 ||
    location.pathname.indexOf("/account/logout") !== -1;


  useEffect(() => {
    // logout when addresses don't match
    magic.user.isLoggedIn().then(async (loggedIn) => {
      if (loggedIn) {
        // @ts-ignore
        const metadata: MagicUserMetadata = await magic.user.getMetadata();
        setIsLoggedIn(address === metadata?.publicAddress?.toLowerCase());
      } else {
        setIsLoggedIn(
          !!(address && address === account?.address?.toLowerCase())
        );
      }

      if (isLoginLogoutPage) {
        return;
      }

      if (loggedIn) {
        // @ts-ignore
        const metadata: MagicUserMetadata = await magic.user.getMetadata();

        if (address !== metadata?.publicAddress?.toLowerCase()) {
          navigate("/account/logout");
        }
      } else if (account.address?.toLowerCase() !== address) {
        navigate("/account/logout");
      }
    });
  }, [account?.address, address, isLoginLogoutPage, magic.user, navigate]);

  return (
    <>
      <Header address={address} user={data?.me} isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </>
  );
}
