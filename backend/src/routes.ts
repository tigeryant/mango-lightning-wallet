import { Request, Response } from 'express';
import nodeManager from './node-manager';

/**
 * POST /api/connect
 */
export const connect = async (req: Request, res: Response) => {
  const { host, cert, macaroon } = req.body;
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
  // await db.addNode({ host, cert, macaroon, token, pubkey });
  res.send({ token });
};