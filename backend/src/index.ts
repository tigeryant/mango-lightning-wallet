import cors from 'cors';
import express, { Express, Request, Response } from "express";
import * as routes from './routes';

require('dotenv').config()
const port = process.env.PORT || 3001
const app: Express = express();

// Create express server
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// simple middleware to grab the token from the header and add
// it to the request's body
app.use((req, res, next) => {
  req.body.token = req.header('X-Token');
  next();
});

/**
 * ExpressJS will hang if an async route handler doesn't catch errors and return a response.
 * To avoid wrapping every handler in try/catch, just call this func on the handler. It will
 * catch any async errors and return
 */
export const catchAsyncErrors = (
  routeHandler: (req: Request, res: Response) => Promise<void> | void,
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
app.post('/api/connect', catchAsyncErrors(routes.connect));
app.get('/api/info', catchAsyncErrors(routes.getInfo));

app.get('/api/test-channel-balance', catchAsyncErrors(routes.testChannelBalance));

app.get("/", (req: Request, res: Response) => {
  console.log(`${req.method} ${req.path} `)
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});