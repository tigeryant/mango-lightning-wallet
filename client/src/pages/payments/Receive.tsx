import React from "react";
import { useGetInvoiceMutation } from "../../redux/features/api/apiSlice";

const Receive = () => {
  const [getInvoice, { data }] = useGetInvoiceMutation({ fixedCacheKey: 'invoice'});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await getInvoice()
    } catch (error: any) {
      // copy this error handling logic to the other query, or find out how to use error from useConnectMutation above
      error.data.error ? console.error(error.data.error) : console.error(error);
    }
  }

  return (
    <>
      <h1>Receive page</h1>
      <form onSubmit={handleSubmit}>
        <button
          className="bg-green-600 p-[5px] text-white rounded-lg block"
          type="submit"
        >
          Generate invoice
        </button>
      </form>
      <p>Invoice: </p>
      {data && <p className="w-[700px] break-words">{data.paymentRequest}</p>}
      {data && <img className='h-[400px]' src={`data:image/svg+xml;utf8,${encodeURIComponent(data.svg)}`} />}
    </>
  );
};

export default Receive;
