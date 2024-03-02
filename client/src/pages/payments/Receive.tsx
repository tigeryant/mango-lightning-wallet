import React, { useState } from "react";
import { useGetInvoiceMutation } from "../../redux/features/api/apiSlice";

const Receive = () => {
  // no need for this state - we can simply refer to the data returned by useGetInvoiceMutation()
  // const [invoice, setInvoice] = useState<string | undefined>(undefined);
  const [getInvoice, { data }] = useGetInvoiceMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await getInvoice()
      // const { paymentRequest } = await getInvoice().unwrap();
      // setInvoice(paymentRequest);
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
      {/* {invoice && <p className="w-[700px] break-words">{invoice}</p>} */}
      {data && <p className="w-[700px] break-words">{data.paymentRequest}</p>}
      {data && <img className='h-[400px]' src={`data:image/svg+xml;utf8,${encodeURIComponent(data.svg)}`} />}
    </>
  );
};

export default Receive;
