import { Request, Response } from "express";
import getNodeByToken from "../databaseUtils/getNodeByToken";
import nodeManager from "../node-manager";

/**
 * GET /api/info
 */
export async function getInfo(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const { alias, identityPubkey: pubkey } = await Lightning.getInfo();
  const { balance } = await Lightning.channelBalance();
  res.status(200).send({ alias, balance, pubkey });
}

/**
 * GET /api/get-node-info
 */
export async function getNodeInfo(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  const pubKey = req.query.pubKey;

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const remoteNode = await Lightning.getNodeInfo({ pub_key: pubKey });
  res.status(200).send(remoteNode);
}
