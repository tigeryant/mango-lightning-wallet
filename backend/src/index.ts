import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectionRouter from './routes/connection'
import infoRouter from './routes/info'
import invoicesRouter from './routes/invoices'
import channelsRouter from './routes/channels'
import addressesRouter from './routes/addresses'
import testRouter from './routes/test'

require("dotenv").config();
const port = process.env.PORT || 3001;
var app = express();

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

// Create express server
const clientOrigin = `${process.env.CLIENT_ORIGIN}` 
app.use(cors({ origin: clientOrigin }));
app.use(express.json());

// connect to db
const dbURI = `${process.env.DB_URI}`

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("[server] Connected to DB");
    app.listen(port, () => {
      console.log(`[server] Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

// simple middleware to grab the token from the header and add
// it to the request's body
app.use((req: Request, _: Response, next: NextFunction) => {
  req.body.token = req.header("X-Token");
  next();
});

/**
 * ExpressJS will hang if an async route handler doesn't catch errors and return a response.
 * To avoid wrapping every handler in try/catch, just call this func on the handler. It will
 * catch any async errors and return
 */
export const catchAsyncErrors = (
  routeHandler: (req: Request, res: Response) => Promise<void> | void
) => {
  // return a function that wraps the route handler in a try/catch block and
  // sends a response on error
  return async (req: Request, res: Response) => {
    try {
      const promise = routeHandler(req, res);
      // only await promises from async handlers.
      if (promise) await promise;
    } catch (err: any) {
      res.status(400).send({ error: err.message });
    }
  };
};

//
// Configure Routes
//
app.use("/api/connect", catchAsyncErrors(connectionRouter));
app.use("/api/info", catchAsyncErrors(infoRouter));
app.use("/api/invoice", catchAsyncErrors(invoicesRouter));
app.use("/api/channels", catchAsyncErrors(channelsRouter));
app.use("/api/addresses", catchAsyncErrors(addressesRouter));
app.get("/api/test", catchAsyncErrors(testRouter));
