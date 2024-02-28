import { Link } from "react-router-dom";
import ConnectForm from "../components/forms/ConnectForm";

const Connect = () => {
  return (
    <div className="w-full h-full flex flex-col justify-around items-center">
      <h1 className="font-bold">Connect Page</h1>
      <ConnectForm />
      <Link to="/dashboard" className="border border-black rounded-lg">Dashboard</Link>
    </div>
  );
};

export default Connect;
