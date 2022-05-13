# vessel

Vessel is a secure treasury management solution for DAOs, communities, and squads on Flow. Store your assets safely, manage transactions collaboratively, and keep track of value over time.

## Prerequisites

- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)
- [GoLang 1.6](https://golang.org/doc/install)
- [Node/NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Flow CLI](https://docs.onflow.org/flow-cli/install/)

## Installation

```bash
yarn install
```

## Development

#### Contracts

To start a local blockchain using `flow emulator`:

```bash
yarn chain
```

To deploy all contracts in `./packages/cadence/contracts`:

```bash
yarn deploy
```

##### Alternatively...

NOTE: Docker must be running for this method

You can build & run the emulator via Docker with the contracts automatically deployed, and a few
accounts already created:

```bash
make vessel-emulator
```

#### Client

First, make sure you have a `.env` file in the same location and shape as `packages/client/.env.example`. Then, to start the client:

```bash
yarn start
```

You should now be able to see the client app at `localhost:3000`.
