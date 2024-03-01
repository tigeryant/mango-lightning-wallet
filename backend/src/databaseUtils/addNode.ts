import { LnNode, ILnNode } from "../models/LnNode";
import { HydratedDocument } from 'mongoose'

export default async function addNode({
  host,
  cert,
  macaroon,
  token,
  pubkey,
}) {
  const lnNode: HydratedDocument<ILnNode> = new LnNode({ host, cert, macaroon, token, pubkey });
  await lnNode.save();
}
