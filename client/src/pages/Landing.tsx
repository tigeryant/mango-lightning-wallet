import { Link } from "react-router-dom";
import Counter from "../components/Counter";

const Landing = () => {
  return (
    <div>
      <h1 className="font-bold">Landing Page</h1>
      <Link to="/signin" className="border border-black rounded-lg">
        Sign up or Login
      </Link>
      <Counter />
    </div>
  );
};

export default Landing;
