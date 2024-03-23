import { Request, Response } from "express";
import nodeManager from "../node-manager";
import getNodeByToken from "../databaseUtils/getNodeByToken";

/**
 * GET /api/new-address
 */
export async function newAddress(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const { address } = await Lightning.newAddress();

  res.status(200).send({ address });
}
