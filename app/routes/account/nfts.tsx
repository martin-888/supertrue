import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/sessions.server";

import NFTs from "~/views/Account/NFTs";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("token_api")) {
    return redirect("/account/login?redirect=/account/nfts");
  }

  return null;
};

export default NFTs;
