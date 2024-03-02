import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[20px]">Sign up/Login</h1>
      <Link to="/connect" className="p-[5px] rounded-lg bg-orange-400 text-white">
        Connect node
      </Link>
    </div>
  );
};

export default SignIn;
