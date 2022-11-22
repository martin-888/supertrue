import type { MetaFunction } from "@remix-run/node";

import ClaimHandle from "~/views/ClaimHandle";

export const meta: MetaFunction = ({ params }) => {
  return {
    title: `Claim @${params.handle} | Supertrue`,
    "og:title": `Claim @${params.handle} on Supertrue`,
  };
};

export default ClaimHandle;
