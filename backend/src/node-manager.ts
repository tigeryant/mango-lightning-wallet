import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";
import LndGrpc from "lnd-grpc";

export const NodeEvents = {
  invoicePaid: "invoice-paid",
};

class NodeManager extends EventEmitter {
  /**
   * a mapping of token to gRPC connection. This is an optimization to
   * avoid calling `createLnRpc` on every request. Instead, the object is kept
   * in memory for the lifetime of the server.
   */
  private _lndNodes: Record<string, LndGrpc> = {};

  /**
   * Retrieves the in-memory connection to an LND node
   */
  getRpc(token: string): LndGrpc {
    if (!this._lndNodes[token]) {
      throw new Error("Not Authorized. You must login first!");
    }

    return this._lndNodes[token];
  }

  /**
   * Tests the LND node connection by validating that we can get the node's info
   */
  async connect(
    host: string,
    cert: string,
    macaroon: string,
    prevToken?: string
  ) {
    // generate a random token, without
    const token = prevToken || uuidv4().replace(/-/g, "");

    try {
      // create connection
      const grpc = new LndGrpc({
        host: host,
        cert: cert,
        macaroon: macaroon,
      });

      // connect
      await grpc.connect();

      // Set up grpc services
      const { Lightning, Autopilot, Invoices } = grpc.services;

      // zap verify we have permission get node info
      const { identityPubkey: pubkey } = await Lightning.getInfo();

      // verify we have permission to get channel balances
      await Lightning.channelBalance();

      // verify we can sign a message
      const msg = Buffer.from("authorization test").toString("base64");
      const { signature } = await Lightning.signMessage({ msg });

      // verify we have permission to verify a message
      await Lightning.verifyMessage({ msg, signature });

      // verify we have permissions to create a 1sat invoice
      const { r_hash } = await Lightning.addInvoice({ value: "1" });
      const rHashJson = JSON.parse(JSON.stringify(r_hash));
      const rHash = Buffer.from(rHashJson.data);

      // verify we have permission to lookup invoices
      await Lightning.lookupInvoice({ r_hash: rHash }); // change back to rHash

      // listen for payments from LND
      this.listenForPayments(Lightning, pubkey);

      // store this rpc connection in the in-memory list
      this._lndNodes[token] = grpc;

      // return this node's token for future requests
      return { token, pubkey };
    } catch (err) {
      // remove the connection from the cache since it is not valid
      if (this._lndNodes[token]) {
        delete this._lndNodes[token];
      }
      throw err;
    }
  }

  /**
   * listen for payments made to the node. When a payment is settled, emit
   * the `invoicePaid` event to notify listeners of the NodeManager
   */
  // listenForPayments(rpc: LnRpc, pubkey: string) {
  listenForPayments(Lightning: any, pubkey: string) {
    const stream = Lightning.subscribeInvoices();
    stream.on("data", (invoice) => {
      if (invoice.settled) {
        const hash = (invoice.rHash as Buffer).toString("base64");
        const amount = invoice.amtPaidSat;
        this.emit(NodeEvents.invoicePaid, { hash, amount, pubkey });
      }
    });
  }
}

export default new NodeManager();
