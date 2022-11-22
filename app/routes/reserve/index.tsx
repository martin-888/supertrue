import type { MetaFunction } from "@remix-run/node";

import Reserve from "~/views/Reserve";

export const meta: MetaFunction = () => {
  return {
    title: "Reserve Artist | Supertrue",
  };
};

export default Reserve;
