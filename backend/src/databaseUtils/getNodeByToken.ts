import { LnNode, ILnNode } from '../models/LnNode'
import { HydratedDocument } from 'mongoose'

export default async function getNodeByToken(token: string) {
  try {
    const lnNode: HydratedDocument<ILnNode> | null = await LnNode.findOne({ token: token });
    if (!lnNode) throw new Error("Node not found with this token");
    return lnNode
  } catch (error) {
    throw(error)
  }
}