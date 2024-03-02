import React from "react";
import { useGetInvoiceMutation } from "../../redux/features/api/apiSlice";
import { Link } from "react-router-dom";

const Receive = () => {
  const [getInvoice, { data }] = useGetInvoiceMutation({
    fixedCacheKey: "invoice",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await getInvoice();
    } catch (error: any) {
      // copy this error handling logic to the other query, or find out how to use error from useConnectMutation above
      error.data.error ? console.error(error.data.error) : console.error(error);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[30px]">Receive page</h1>
      <form onSubmit={handleSubmit}>
        <button
          className="bg-green-600 p-[5px] text-white rounded-lg mb-[20px]"
          type="submit"
        >
          Generate invoice
        </button>
      </form>
      <p className="font-semibold">Invoice: </p>
      {data && <p className="w-[700px] break-words">{data.paymentRequest}</p>}
      {data && (
        <img
          className="h-[350px]"
          src={`data:image/svg+xml;utf8,${encodeURIComponent(data.svg)}`}
        />
      )}
            <Link
        to="/dashboard"
        className="p-[5px] rounded-lg bg-blue-500 text-white"
      >
        Dashboard
      </Link>
    </div>
  );
};

export default Receive;
