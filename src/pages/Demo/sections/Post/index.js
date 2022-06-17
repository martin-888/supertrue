import React, {useState} from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const ME_QUERY = gql`
    query me {
        me {
            address
            email
            collection {
                id
                address
                posts {
                    id
                    lastNftID
                    content
                    createdAt
                }
            }
        }
    }
`;

const CREATE_POST_MUTATION = gql`
    mutation createPost(
        $input: CreatePostInput!
    ) {
        CreatePost(input: $input) {
            collection {
                id
                address
                posts {
                    id
                    lastNftID
                    content
                    createdAt
                }
            }
        }
    }
`;

export default function Post() {
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [lastNftID, setLastNftID] = useState(100);
  const [createPostError, setCreatePostError] = useState(null);
  const { data, loading, error } = useQuery(ME_QUERY);

  const me = data?.me;

  const [createPostMutation] = useMutation(CREATE_POST_MUTATION, {
    variables: { input: { content, lastNftID } },
    onCompleted: () => {
      setLastNftID(100);
      setContent("");
      setCreating(false);
    },
    onError: e => {
      setCreatePostError(e.message);
      setCreating(false);
    }
  });


  const save = () => {
    setCreating(true);
    setCreatePostError(null);
    createPostMutation();
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
      {!data?.me && <p>You've to be login for posting</p>}
      {!data?.me?.collection && <p>You've to create collection first for posting</p>}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
        disabled={!data?.me?.collection || creating}
      /><br />
      Fans 1 - <input
        type="number"
        value={lastNftID}
        onChange={e => setLastNftID(e.target.value < 10 ? 10 : e.target.value)}
        disabled={!data?.me?.collection || creating}
        min={10}
      /><br/>
      {createPostError && <p>{createPostError}</p>}
      <button disabled={!data?.me?.collection || creating} onClick={save}>Save</button>
      <hr />
      <h4>Your Posts</h4>
      {!me?.collection?.posts?.length
        ? <p>No posts</p>
        : me.collection.posts.map(p => (
          <div>
            Created: {p.createdAt}<br />
            For Fans: 1-{p.lastNftID}<br />
            <p>{p.content}</p>
            <hr />
          </div>
        ))}
    </div>
  );
}
