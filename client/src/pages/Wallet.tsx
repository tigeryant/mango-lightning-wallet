import React, { useState } from "react";
import { useNewAddressQuery } from "../redux/features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router-dom";

const Wallet = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { data, error, refetch, isUninitialized } = useNewAddressQuery(isSubmitted ? undefined : skipToken);
  if (error) {
    console.error(JSON.stringify(error));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isUninitialized) {
      setIsSubmitted(true);
    } else {
      refetch();
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[10px]">Wallet Page</h1>
      <form onSubmit={handleSubmit} className="mb-[10px]">
        {/* add inputs for API call args here */}
        <button
          type="submit"
          className="bg-orange-500 text-white rounded-lg p-[5px]"
        >
          Generate Address
        </button>
      </form>
      {data && (
        <p className="mb-[10px]">
          <strong>Address: </strong>
          {data.address}
        </p>
      )}
      <Link
        to="/dashboard"
        className="bg-blue-500 text-white rounded-lg p-[5px]"
      >
        Dashboard page
      </Link>
    </div>
  );
};

export default Wallet;
