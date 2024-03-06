## Overview

Mango is a web based lightning wallet

## What is the lightning network?

The Lightning Network is a rapidly growing second layer payment protocol that works on top of Bitcoin to provide near-instantaneous transactions between two parties. It improves Bitcoin’s transaction speed, scalability and privacy.

## Features

- Connect to an LND node
- Send a payment over lightning
- Receive a payment over lightning
- View channels (coming soon)


## Set up and installation

### Git

- `git clone` the repo
- `cd` into the root of the project directory

### Polar

- Download Polar [here](https://lightningpolar.com/) - Polar is a tool for regtesting lightning networks
- Set up a local cluster - learn about how to do this [here](https://docs.lightning.engineering/lapps/guides/polar-lapps/local-cluster-setup-with-polar)
    - The network must have a Bitcoin node, two LND lightning nodes, and a channel between them with liquidity on both sides

### Database

- Set up a MongoDB database locally or using Atlas
- A modified version of the connection string will be used in `/backend/.env`
    - If you are running the database locally, the connection string will be `mongodb://127.0.0.1:27017` by default
    - The default environment variable for the `DB_URI` is `mongodb://127.0.0.1:27017/mango`

### Environment

- Rename the `/client/.env.example` file to `/client/.env` and rename `/backend/.env.example` to `/backend/.env`
    - Update the environment variables appropriately  - some environment variables will be obtained from Polar and MondoDB

### Dependency installation and development servers

- To run the backend, `cd backend` from the root of the project directory
    - Run `npm i` to install the backend dependencies
    - Run `npm run dev` to run the backend in development
    - The server will start listening for requests (by default the server will be hosted on [http://localhost:3001](http://localhost:3001/))
- To run the frontend, `cd client` from the root of the project directory
    - Run `npm i` to install the frontend dependencies
    - Run `npm start` to run the frontend in development
    - Navigate to the local client URL (by default this is [http://localhost:3000](http://localhost:3000/)) in the browser to see the project

## Tech stack

### Front end

- React
- TypeScript
- Tailwind
- Redux
- RTK Query

### Back end

- Node.js
- TypeScript
- Express

### Database

- MongoDB

### Lightning

- Polar
- LND

### Protocols

- REST
- gRPC