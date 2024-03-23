import { Request, Response } from "express";
import nodeManager from "../node-manager";
import getNodeByToken from "../databaseUtils/getNodeByToken";
import WebSocket from "ws";

/**
 * GET /api/list-channels
 */
export async function listChannels(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const { channels } = await Lightning.listChannels();

  res.status(200).send({ channels });
}

/**
 * POST /api/open-channel
 */
export async function openChannel(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  const { pubkey, fundingAmount, pushSat } = req.body

  if (typeof pubkey !== 'string' || typeof fundingAmount !== 'number' || typeof pushSat !== 'number') {
    res.sendStatus(400)
    return
  }

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;

  const wss: any = new WebSocket.Server({ port: 8080 }); // ws://localhost:8080
  const server = wss._server;
  
  res.status(200).send({ success: true });

  const call = Lightning.openChannel({
    node_pubkey: Buffer.from(
      pubkey,
      "hex"
      ),
      local_funding_amount: fundingAmount,
      push_sat: pushSat,
    });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    call.on("data", function (response: any) {
      console.log(`response.update: ${response.update}`);
      ws.send(response.update);
    });
    call.on("error", function (error) {
      console.error(`error:\n${error}`);
      ws.send(
        JSON.stringify({ "error": "An error ocurred opening the channel" })
      );
      ws.close()
      server.close();
    });
    call.on("end", function () {
      console.log("websocket closed - end of LND stream");
      ws.close();
      server.close();
    });
  });
}

/**
 * POST /api/close-channel
 */
export async function closeChannel(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  console.log(`req.body: ${JSON.stringify(req.body)}`)

  const [fundingTxid, outputIndex] = req.body.channelPoint.split(":");

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;

  const wss: any = new WebSocket.Server({ port: 8080 }); // ws://localhost:8080
  const server = wss._server;
  res.status(200).send({ success: true });

  const call = Lightning.closeChannel({
    channel_point: {
      funding_txid_str: fundingTxid,
      output_index: outputIndex
    }
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    call.on("data", function (response: any) {
      console.log(`response.update: ${response.update}`);
      ws.send(response.update);
    });
    call.on("error", function (error) {
      console.error(`error:\n${error}`);
      ws.send(
        JSON.stringify({ "error": "An error ocurred closing the channel" })
      );
      ws.close()
      server.close();
    });
    call.on("end", function () {
      console.log("websocket closed - end of LND stream");
      ws.close();
      server.close();
    });
  });
}
