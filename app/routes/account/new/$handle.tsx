import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { getSession } from "~/sessions.server";

import NewAccount from "~/views/Account/New";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("token_api")) {
    return redirect(`/account/login?redirect=/account/new/${params.handle}`);
  }

  return null;
};

export default NewAccount;
