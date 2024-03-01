import { Request, Response } from "express";
import nodeManager from "./node-manager";
import getNodeByToken from "./databaseUtils/getNodeByToken";
import addNode from "./databaseUtils/addNode";

/**
 * POST /api/connect
 */
export const connect = async (req: Request, res: Response) => {
  const { host, cert, macaroon } = req.body;
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
  await addNode({ host, cert, macaroon, token, pubkey })
  res.status(200).send({ token });
};

/**
 * GET /api/info
 */
export const getInfo = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token){
    throw new Error('No token was sent in the request - node is not connected')
  }
  
  // get node instance
  const node = await getNodeByToken(token)
  
  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const { alias, identityPubkey: pubkey } = await Lightning.getInfo();
  const { balance } = await Lightning.channelBalance();
  res.status(200).send({ alias, balance, pubkey });
};

/**
 * GET /api/get-invoice
 */
export const getInvoice = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token){
    throw new Error('No token was sent in the request - node is not connected')
  }

  // get node instance
  const node = await getNodeByToken(token)

  // get the invoice
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const { payment_request: paymentRequest } = await Lightning.addInvoice({ value: 100 });
  console.log(`paymentRequest: ${paymentRequest}`)

  res.sendStatus(200)
}
