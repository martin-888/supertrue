import React from "react";
import { BrowserRouter } from "react-router-dom";
// import { Magic } from 'magic-sdk';
import * as ethers from "ethers";

import LogInWallet from "./sections/LogInWallet";
// import LogInMagicLink from "./sections/LogInMagicLink";
import MyProfile from "./sections/MyProfile";
import CreateArtist from "./sections/CreateArtist";
import Mint from "./sections/Mint";
import Post from "./sections/Post";

// const magic = new Magic(process.env.REACT_APP_MAGIC_KEY, { network: "rinkeby" });
const provider = new ethers.providers.InfuraWebSocketProvider("rinkeby", process.env.REACT_APP_INFURA_KEY);

export default function Demo() {
  return (
    <BrowserRouter>
      <div style={{ padding: "1em 2em", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Supertrue demo</h1>

        <LogInWallet />
        {/*<LogInMagicLink magic={magic} />*/}
        <MyProfile provider={provider} />
        <CreateArtist provider={provider} />
        <Mint provider={provider} />
        <Post />
      </div>
    </BrowserRouter>
  );
}
