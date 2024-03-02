import { Link } from "react-router-dom";
import ConnectForm from "../components/forms/ConnectForm";

const Connect = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-around items-center">
      <h1 className="font-bold">Connect Page</h1>
      <ConnectForm />
      <Link
        to="/dashboard"
        className="p-[5px] rounded-lg bg-blue-500 text-white"
      >
        Dashboard
      </Link>
    </div>
  );
};

export default Connect;
