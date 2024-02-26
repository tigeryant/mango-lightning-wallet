import { Request, Response } from "express";
import nodeManager from "./node-manager";
const path = require("path");
import * as fs from "fs";
import { channelBalance } from './test/channelBalance'

/**
 * POST /api/connect
 */
export const connect = async (req: Request, res: Response) => {
  const { host, cert, macaroon } = req.body;
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
  // we need to write some patch to bridge this functionality
  // await db.addNode({ host, cert, macaroon, token, pubkey });

  // the .json file path
  const JSON_FILE = path.resolve(__dirname, "../data/nodes.json")

  try {
    // reading the JSON file
    const jsonData = fs.readFileSync(JSON_FILE);

    // parsing the JSON content
    const nodes = JSON.parse(jsonData.toString())
    nodes.push({ "host": host, "cert": cert, "macaroon": macaroon, "token": token, "pubkey": pubkey })

    // updating the JSON file
    fs.writeFileSync(JSON_FILE, JSON.stringify(nodes));
  } catch (error) {
    // change to throw new
    console.error(error);
    throw error;
  }
  res.send({ token });
};

export async function testChannelBalance(req: Request, res: Response) {
  // const { host, cert, macaroon } = req.body;
  // channelBalance(host, cert, macaroon)
  await channelBalance()
  res.sendStatus(200)
}

/**
 * GET /api/info
 */
export const getInfo = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) throw new Error("Your node is not connected!");
  // find the node that's making the request
  // use .find to retrieve a 'node' element from a .json file

  let data = ''
  try {
    // reading a JSON file synchronously
    data = fs.readFileSync(path.resolve(__dirname, "../data/nodes.json")).toString();
  } catch (error) {
    // logging the error
    console.error(error);
  
    throw error;
  }
  
  // parsing the JSON content
  // should turn this into an array somehow
  const nodes = JSON.parse(data);
  const node = nodes.find((node) => node.token === token)

  // const node = db.getNodeByToken(token);
  if (!node) throw new Error("Node not found with this token");

  // get the node's pubkey and alias
  const rpc = nodeManager.getRpc(node.token);
  const { alias, identityPubkey: pubkey } = await rpc.getInfo();
  const { balance } = await rpc.channelBalance();
  res.send({ alias, balance, pubkey });
};
