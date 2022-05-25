import React from "react";
import { Route } from "react-router";
import { Routes } from "react-router-dom";

import Callback from './Callback';
import LoggedIn from './LoggedIn';

export default function LogIn({ magic }) {
  return (
    <section>
      <h3>Log In</h3>
      <Routes>
        <Route path="/demo/callback" exact element={<Callback magic={magic} />} />
        <Route path="/demo" element={<LoggedIn magic={magic} />} />
      </Routes>
    </section>
  );
}
