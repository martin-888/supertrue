import React, { useState } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

const ME_QUERY = gql`
    query me($address: ID!) {
        currentAddress
        dbMe {
            address
            email
        }
        me: user(id: $address) {
            collection {
                address
            }
        }
    }
`;

export default function Post() {
  const address = localStorage.getItem("address");
  const { data, loading, error } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address
  });

  const post = () => {

  }

  if (loading) {
    return (
      <div>
        <h3>Post</h3>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h3>Post</h3>
      {!data?.dbMe && <p>You've to be login for posting</p>}
      {!data?.me?.collection && <p>You've to create collection for posting</p>}
      <button disabled={!data?.me?.collection} onClick={post}>Post</button>
    </div>
  );
}
