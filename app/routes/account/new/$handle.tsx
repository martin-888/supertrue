import { LoaderFunction, redirect } from "@remix-run/node";

import CreateArtist from "./index";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("token")) {
    // Redirect to the home page if they are not logged in
    return redirect(`/account/login/account/new/${params.handle}`);
  }

  return null;
}

export default CreateArtist;
