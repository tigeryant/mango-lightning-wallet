import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[20px]">Landing Page</h1>
      <Link
        to="/signin"
        className="p-[5px] rounded-lg bg-orange-400 text-white"
      >
        Sign up or Login
      </Link>
    </div>
  );
};

export default Landing;
