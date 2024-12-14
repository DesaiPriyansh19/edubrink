import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import GoogleButton from "./GoogleButton";

export default function GoogleWrapper({onClose}) {
  return (
    <GoogleOAuthProvider clientId="304713895683-aest407jm3ntc6d3c1tr9c3aohacurng.apps.googleusercontent.com">
      <GoogleButton onClose={onClose} />
    </GoogleOAuthProvider>
  );
}
