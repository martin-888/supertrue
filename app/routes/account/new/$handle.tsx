import { LoaderFunction, redirect } from "@remix-run/node";

import CreateArtist from "./index";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("token")) {
    return redirect(`/account/login?redirect=/account/new/${params.handle}`);
  }

  return null;
}

export default CreateArtist;
