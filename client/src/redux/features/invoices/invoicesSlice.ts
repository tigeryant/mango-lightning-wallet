import { apiSlice } from '../api/apiSlice'

const qrCode = require("qrcode");

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getInvoice: builder.mutation<
      { paymentRequest: string; svg: string },
      { value: number }
    >({
      query: (data) => ({
        url: "/invoice/get",
        method: "POST",
        body: data,
      }),
      transformResponse: ({ paymentRequest }: { paymentRequest: string }) => {
        let svg = "";
        qrCode.toString(
          paymentRequest,
          {
            errorCorrectionLevel: "H",
            type: "svg",
          },
          function (err: any, data: string) {
            if (err) throw err;
            svg = data;
          }
        );
        return { paymentRequest, svg };
      },
    }),
    sendPayment: builder.mutation<
      { success: boolean },
      { paymentRequest: string }
    >({
      query: (data) => ({
        url: "/invoice/pay",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["balance"],
    }),

  })
})

export const { 
  useGetInvoiceMutation,
  useSendPaymentMutation,
 } = extendedApiSlice

// export const selectInvoicesResult = extendedApiSlice.endpoints.getInvoice.select()
