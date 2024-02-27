import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div>
      <h1 className="font-bold">Sign up/Login</h1>
      <Link to="/connect" className="border border-black rounded-lg">
        Connect node
      </Link>
    </div>
  );
};

export default SignIn;
