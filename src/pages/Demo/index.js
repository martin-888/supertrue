import React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ethers from "ethers";
// import { Magic } from 'magic-sdk';

// import LogInMagicLink from "./sections/LogInMagicLink";
// import MintPaperWallet from "./sections/MintPaperWallet";

import LogInWallet from "./sections/LogInWallet";
import MyProfile from "./sections/MyProfile";
import CreateArtist from "./sections/CreateArtist";
import Mint from "./sections/Mint";
import Post from "./sections/Post";

const NETWORK = process.env.REACT_APP_NETWORK;
const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

// const magic = new Magic(process.env.REACT_APP_MAGIC_KEY, { network: NETWORK });
const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_KEY);

export default function Demo() {
  return (
    <BrowserRouter>
      <div style={{ padding: "1em 2em", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Supertrue demo</h1>

        <LogInWallet />
        <MyProfile provider={provider} />
        <CreateArtist provider={provider} />
        <Mint />

        {/*<LogInMagicLink magic={magic} />*/}
        {/*<MintPaperWallet />*/}
        <Post />
      </div>
    </BrowserRouter>
  );
}
