import { Request, Response, NextFunction } from "express";

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

// simple middleware to grab the token from the header and add
// it to the request's body
export const tokenToBody = (req: Request, _: Response, next: NextFunction) => {
  req.body.token = req.header("X-Token");
  next();
}
