import React from "react";
import { Typography, Box } from "@mui/material";

const getFaqs = (instagram: string, lineLength: number) => [
  {
    question: `Hey @${instagram}! 👋`,
    answers: [
      `We've collected a list of ${lineLength} fans who have already reserved their spot as your Supertrue follower and want to pay you to mint your NFT.`,
    ],
  },
  {
    question: `What? I've got ${lineLength} fans already? What's next?`,
    answers: [
      "To start collecting earnings and engaging with your fans, log in to create your Supertrue profile and then verify that you own the associated Instagram account.",
    ],
  },
  {
    question: "How do I make a wallet?",
    answers: [
      "If you don't have a web3 wallet, that's no problem. Just create an account on supertrue.com with your email address as usual and we'll create a wallet for you. If you already have a web3 wallet, go ahead and login.",
      "After you’ve signed in, you may verify your Instagram account.",
    ],
  },
  {
    question: "How do you verify my Instagram account?",
    answers: [
      "We ask that you change your Instagram bio temporarily with a provided code to prove that the Instagram account listed is yours.",
    ],
  },
  {
    question: "What is Supertrue?",
    answers: [
      "At Supertrue, we are building a new way to compensate you for every new follower you get and give you direct access to communicate with them.",
      "When you build a following on Instagram and you get to 1,000 followers... you get $0. If you want to post to your followers on Instagram, your posts are buried with ads and vacation photos.",
      "With Supertrue, if you get to 1,000 followers, you get $8,000. And you can directly message your fans.",
      "We do this by automatically creating numbered NFTs for your fans to mint of you. The numbered NFTs give fans a chance to show what day they first discovered your art. And if your fans later sell their NFT, you'll get 20% of the sale price.",
    ],
  },
];

export default function FAQ({ instagram, lineLength }: { instagram: string; lineLength: number }) {
  return (
    <Box>
      {getFaqs(instagram || "", lineLength || 0).map(
        ({ question, answers }, index) => (
          <Box key={index}>
            <Typography variant="h2" mb={2}>
              {question}
            </Typography>
            {answers.map((answer, i) => (
              <Typography key={i} variant="body1" mb={2}>
                {answer}
              </Typography>
            ))}
          </Box>
        )
      )}
    </Box>
  );
}
