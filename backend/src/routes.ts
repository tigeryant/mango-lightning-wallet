import { Request, Response } from "express";
import nodeManager from "./node-manager";
import getNodeByToken from "./databaseUtils/getNodeByToken";
import addNode from "./databaseUtils/addNode";
import WebSocket from "ws";

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

/**
 * POST /api/connect
 */
export async function connect(req: Request, res: Response) {
  const { host, cert, macaroon } = req.body;
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
  await addNode({ host, cert, macaroon, token, pubkey });
  res.status(200).send({ token });
}

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
 * POST /api/get-invoice
 */
export async function getInvoice(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;

  const value: number = req.body.value;
  // sanitise input
  if (value === null || isNaN(value)) {
    throw new Error("Invalid value parameter sent in the request body");
  }

  // get the invoice
  const { payment_request: paymentRequest } = await Lightning.addInvoice({
    value,
  });
  res.status(200).send({ paymentRequest });
}

/**
 * POST /api/pay-invoice
 */
export async function payInvoice(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  // get node instance
  const node = await getNodeByToken(token);

  const grpc = nodeManager.getRpc(node.token);
  const { Router } = grpc.services;

  const paymentRequest = req.body.paymentRequest;

  let aggregatedResponse: any[] = [];
  const call = Router.sendPaymentV2({
    payment_request: paymentRequest,
    timeout_seconds: 5,
  });
  call.on("data", function (currentResponse) {
    // A response was received from the server.
    aggregatedResponse.push(currentResponse);
  });
  call.on("error", function (error) {
    // An error has occurred and the stream has been closed.
    res.status(400).send(error);
  });
  call.on("status", function (status) {
    // The current status of the stream.
  });
  call.on("end", function () {
    // The server has closed the stream.

    if (
      aggregatedResponse.length > 0 &&
      aggregatedResponse.slice(-1)[0].status === "SUCCEEDED"
    ) {
      res.status(200).send({ success: true });
    }
  });
}

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

/**
 * POST /api/open-channel
 */
export async function openChannel(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token was sent in the request - node is not connected");
  }

  const pubkey = req.body.pubkey;
  const fundingAmount = req.body.fundingAmount
  const pushSat = req.body.pushSat

  if (typeof pubkey !== 'string' || typeof fundingAmount !== 'number' || typeof pushSat !== 'number') {
    res.sendStatus(400)
    return
  }

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;

  // this try/catch does not work (because of async)
  let wss: any
  try {
    wss = new WebSocket.Server({ port: 8080 }); // ws://localhost:8080
  } catch(error) {
    console.error(error)
    res.status(400).send(error)
  }
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

  const channelPoint = req.body.channelPoint.split(":");
  const fundingTxid = channelPoint[0]
  const outputIndex = channelPoint[1]

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

/**
 * GET /api/test
 * temporary route for testing - no token required in request header
 */
export async function test(req: Request, res: Response) {
  console.log("test function called!");

  const host = "127.0.0.1:10004";
  const cert = "/Users/john/.polar/networks/2/volumes/lnd/bob/tls.cert";
  const macaroon =
    "0201036c6e6402f801030a10d21e5394c4ce2bae069ba1c70387473f1201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a210a086d616361726f6f6e120867656e6572617465120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a180a067369676e6572120867656e6572617465120472656164000006204190a838afad1e96acb39931e6c3ea59fca48b1ac4bd6389670bd46888ab6671";
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
  await addNode({ host, cert, macaroon, token, pubkey });

  // get node instance
  const node = await getNodeByToken(token);

  // get the node's pubkey and alias
  const grpc = nodeManager.getRpc(node.token);
  const { Lightning } = grpc.services;
  const { channels } = await Lightning.listChannels();
  // const info = await Lightning.getInfo()
  // console.log(`info:\n${JSON.stringify(info)}`)
  // console.log(`channels:\n${JSON.stringify(channels)}`)

  // version
  // const { Versioner } = grpc.services;
  // const version = await Versioner.getVersion();
  // console.log("version:\n" + JSON.stringify(version));

  // res.sendStatus(200)
  res.status(200).send({ channels });
}
