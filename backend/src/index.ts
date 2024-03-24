import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { catchAsyncErrors, tokenToBody } from "./middleware/middleware";
import connectionRouter from './routes/connection'
import infoRouter from './routes/info'
import invoicesRouter from './routes/invoices'
import channelsRouter from './routes/channels'
import addressesRouter from './routes/addresses'
import testRouter from './routes/test'

require("dotenv").config();
const port = process.env.PORT || 3001;
// Create express server
var app = express();

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const clientOrigin = `${process.env.CLIENT_ORIGIN}` 
app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(tokenToBody);

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

//
// Configure Routes
//
app.use("/api/connect", catchAsyncErrors(connectionRouter));
app.use("/api/info", catchAsyncErrors(infoRouter));
app.use("/api/invoice", catchAsyncErrors(invoicesRouter));
app.use("/api/channels", catchAsyncErrors(channelsRouter));
app.use("/api/addresses", catchAsyncErrors(addressesRouter));
app.get("/api/test", catchAsyncErrors(testRouter));
