import type { MetaFunction } from "@remix-run/node";

import ReserveHandle from '~/views/ReserveHandle';

export const meta: MetaFunction = ({ params }) => {
  return {
    title: `Reserve @${params.handle} | Supertrue`,
    "og:title": `Reserve @${params.handle} on Supertrue`,
  };
};

export default ReserveHandle;
