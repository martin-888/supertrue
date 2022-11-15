import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

// We have to use process.env here to not expose it on frontend!
invariant(process.env.SESSION_SECRET, "SESSION_SECRET should be defined");
invariant(process.env.SESSION_MAX_AGE, "SESSION_MAX_AGE should be defined");

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      // all of these are optional
      // domain: "remix.run",
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
