import { Request, Response } from "express";
import nodeManager from "../node-manager";
import getNodeByToken from "../databaseUtils/getNodeByToken";

/**
 * POST /api/get-invoice
 */
export async function getInvoice(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;

  const value: number = req.body.value;
  // sanitise input
  if (value === null || isNaN(value)) {
    throw new Error("Invalid value parameter sent in the request body");
  }

  // get the invoice
  const { payment_request: paymentRequest } = await Lightning.addInvoice({
    value,
  });
  res.status(200).send({ paymentRequest });
}

/**
 * POST /api/pay-invoice
 */
export async function payInvoice(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  const grpc = nodeManager.getRpc(node.token);
  const { Router } = grpc.services;

  const paymentRequest = req.body.paymentRequest;

  let aggregatedResponse: any[] = [];
  const call = Router.sendPaymentV2({
    payment_request: paymentRequest,
    timeout_seconds: 5,
  });
  call.on("data", function (currentResponse) {
    // A response was received from the server.
    aggregatedResponse.push(currentResponse);
  });
  call.on("error", function (error) {
    // An error has occurred and the stream has been closed.
    res.status(400).send(error);
  });
  call.on("status", function (status) {
    // The current status of the stream.
  });
  call.on("end", function () {
    // The server has closed the stream.

    if (
      aggregatedResponse.length > 0 &&
      aggregatedResponse.slice(-1)[0].status === "SUCCEEDED"
    ) {
      res.status(200).send({ success: true });
    }
  });
}
