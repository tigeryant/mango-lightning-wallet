import React from "react";
import { Link, Form } from "react-router-dom";
import { useSendPaymentMutation } from "../../redux/features/invoices/invoicesSlice";

const Send = () => {
  const [sendPayment, { data, isSuccess, error, isError }] =
    useSendPaymentMutation();
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const paymentRequest = event.currentTarget.invoice.value;
    try {
      await sendPayment({ paymentRequest }).unwrap();
    } catch (error: any) {
      if (typeof error.data.details !== 'undefined') {
        console.error(error.data.details)
      } else {
        console.error(error);
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="font-bold mb-[30px]">Send Payment Page</div>
      {error && (
        <div className="bg-red-400 px-[30px] py-[10px] text-white rounded-lg">
          Payment failed! - {"data" in error ? JSON.stringify(error.data) : ""}
        </div>
      )}
      {data && data.success && (
        <>
          <div className="bg-green-400 px-[30px] py-[10px] text-white rounded-lg">
            Payment succeeded!
          </div>
          <p>data.success: true</p>
        </>
      )}
      {isSuccess && <p>isSuccess: {isSuccess ? "true" : "false"}</p>}
      {isError && <p>isError: {isError ? "true" : "false"}</p>}
      <Form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <textarea
          className="h-[150px] w-[600px] border border-neutral-300 rounded-md mb-[20px] px-[2px]"
          id="invoice"
        ></textarea>
        <button
          className="w-fit p-[5px] rounded-lg bg-green-500 text-white mb-[20px]"
          type="submit"
        >
          Send payment
        </button>
      </Form>
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
