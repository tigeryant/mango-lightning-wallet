import express, { Express, Request, Response } from "express";
const app: Express = express();
const port = 3001

// gRPC imports
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require("fs");

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

const packageDefinition = protoLoader.loadSync('lightning.proto', loaderOptions);

// Load lnd macaroon
let m = fs.readFileSync('<PATH TO MACAROON>');
let macaroon = m.toString('hex');

// Build meta data credentials
let metadata = new grpc.Metadata()
metadata.add('macaroon', macaroon)
let macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
  callback(null, metadata);
});

// Combine credentials
let lndCert = fs.readFileSync('<PATH TO TLS CERT>');
let sslCreds = grpc.credentials.createSsl(lndCert);
let credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

// Create client
let lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
let lnrpc = lnrpcDescriptor.lnrpc;
let client = new lnrpc.Lightning('<HOST>:<PORT>', credentials);

app.get("/", (req: Request, res: Response) => {
  console.log(`${req.method} ${req.path} `)
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});