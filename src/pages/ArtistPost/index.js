import React from "react";
import { Container } from "@mui/material";
import CreatePost from "./sections/CreatePost";
import SinglePost from "./sections/SinglePost";

const existingPosts = [
  {
    id: "5493331e445329daf301c6cb65961ce9",
    authorName: "Alfred Megally",
    authorImageURl:
      "https://www.gravatar.com/avatar/bb36447f262de04333f86f181fd225f6?s=300",
    socialMediaHandle: "@alfred",
    message: "Hey fam! Still me here and we're now 200...",
    fanReachLabel: "0 - 200",
    pastTimeLabel: "6 days ago",
  },
  {
    postId: "0e3af276eeffd605c4dc92df28b9b02f",
    authorName: "Alfred Megally",
    authorImageURl:
      "https://www.gravatar.com/avatar/bb36447f262de04333f86f181fd225f6?s=300",
    socialMediaHandle: "@alfred",
    message: "Hey fam! I’m loving supertrue. Thanks for joining me here!",
    fanReachLabel: "0 - 100",
    pastTimeLabel: "20 days ago",
  },
];

export default function ArtistPost() {
  return (
    <Container maxWidth="md">
      <CreatePost />
      {existingPosts.map((post) => (
        <SinglePost post={post} />
      ))}
    </Container>
  );
}
