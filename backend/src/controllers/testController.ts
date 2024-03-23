import { Request, Response } from "express";
import nodeManager from "../node-manager";
import getNodeByToken from "../databaseUtils/getNodeByToken";
import addNode from "../databaseUtils/addNode";

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
