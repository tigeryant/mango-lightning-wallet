import { Request, Response } from "express";
import nodeManager from "../node-manager";
import addNode from "../databaseUtils/addNode";

/**
 * POST /api/connect
 */
export async function connect(req: Request, res: Response) {
  const { host, cert, macaroon } = req.body;
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
  await addNode({ host, cert, macaroon, token, pubkey });
  res.status(200).send({ token });
}
