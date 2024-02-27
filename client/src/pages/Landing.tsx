import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
      <h1 className="font-bold">Landing Page</h1>
      <Link to="/signin" className="border border-black rounded-lg">
        Sign up or Login
      </Link>
    </div>
  );
};

export default Landing;
