import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import { Model } from 'mongoose'

interface ILnNode{
  host: string,
  cert: string,
  macaroon: string,
  token: string,
  pubkey: string
}

type LnNodeModel = Model<ILnNode> 
const lnNodeSchema = new Schema<ILnNode, LnNodeModel>({
  host: {
    type: String,
    required: true
  },
  cert: {
    type: String,
    required: true
  },
  macaroon: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  pubkey: String,
  // pubkey: {
  //   type: String,
  //   required: true
  // },
})


const LnNode: LnNodeModel = model<ILnNode, LnNodeModel>('LnNode', lnNodeSchema)
export { LnNode, LnNodeModel, ILnNode }