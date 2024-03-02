import React from "react";
import { Link } from "react-router-dom";

const Send = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="font-bold mb-[30px]">Send Payment Page</div>
      <form className="flex flex-col items-center">
        <textarea className="h-[150px] w-[600px] border border-neutral-300 rounded-md mb-[20px] px-[2px]"></textarea>
        <button
          className="w-fit p-[5px] rounded-lg bg-green-500 text-white mb-[20px]"
          type="submit"
        >
          Send payment
        </button>
      </form>
      <Link
        to="/dashboard"
        className="p-[5px] rounded-lg bg-blue-500 text-white"
      >
        Dashboard
      </Link>
    </div>
  );
};

export default Send;
