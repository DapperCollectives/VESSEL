# VESSEL

Vessel is a secure treasury management solution for DAOs, communities, and squads on Flow. Store your assets safely, manage transactions collaboratively, and keep track of value over time.

## Prerequisites

- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)
- [GoLang 1.6](https://golang.org/doc/install)
- [Node/NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Flow CLI v0.37.0](https://docs.onflow.org/flow-cli/install/)

If you plan to use the app on Flow's testnet, you may want to seed your account with FLOW tokens [here](https://testnet-faucet.onflow.org/).

## Installation

```bash
yarn install
```

## Multi-Sig Documentation

### Contracts

Audit Status: Initial Audit Findings Addressed

#### DAOTreasury.cdc

Contract containing the `Treasury` resource. A `Treasury` can hold Fungible Token `Vault` resources, and Non-Fungible Token `Collection` resources.

Anyone may deposit a `Vault` or `Collection` resource into the `Treasury`. Additionally, anyone may deposit fungible/non-fungible tokens into their respective vault/collection held in the `Treasury`.

A `Treasury` is initialized with a list of Flow addresses, which constitute the signers on the `Treasury`. It is also initialized with an initial threshold, which constitutes the number of signatures needed to execute an `MyMultiSig.Action` against the `Treasury`.

Anyone may propose a `MyMultiSig.Action` for the `Treasury` to execute via `TreasuryPublic.proposeAction`. Signers on the `MyMultiSig.Manager` may borrow a reference to a proposed `MyMultiSig.Action`, and call `verifySignature`. If the signature verification passes, the signer's address will be added to the map of accounts that have verified the action.

Once a `MyMultiSig.Action` has received >= the required signature threshold, a signer may call `Treasury.executeAction` to follow through with the proposed action.

#### MyMultiSig.cdc

The signer addresses and initial threshold are used to initialize a `MyMultiSig.Manager` resource, which is used to manage eligible signers and set the threshold of signatures needed to execute a `MyMultiSig.Action`.

#### TreasuryActions.cdc

The set of actions that a Treasury can execute is limited to the actions defined within `TreasuryActions.cdc`. These include actions to transfer tokens (fungible or non-fungible) to Flow accounts, or another `Treasury`. It also includes actions to manage the list of signers and the signer threshold.

Actions that manage signers & threshold must undergo the same multi-signing process as actions that move assets out of the Treasury.

##### Message format for `MyMultiSig.Action.verifySignature`

For a signer to successfully endorse a proposed action, they must submit a list of signatures.

The message format for a given action is (omitting the curly braces):

```bash
{uuid of MyMultiSig.Action}{hex-encoded MyMultiSig.Action intent}{blockId}
```

The signatures passed via the `signatures` arguments should correspond to signatures of the message with each of the account's key IDs, indicated by the `keyIds` argument.

For the signature to be valid, the weight of the sum of all the keys that successfully signed the message must add up to >= 999. (should this actually be 1000?)

## Development

#### Deploying Contracts to Emulator

To start a local blockchain use:

```bash
flow emulator --verbose
```

To deploy all contracts in `./packages/cadence/contracts`:

```bash
yarn deploy
```

#### Using Emulator Dev Wallet

To use a dev-wallet for connecting locally, download [fcl-dev-wallet](https://github.com/onflow/fcl-dev-wallet) and run it alongside your flow emulator with

```bash
npm run dev
```

#### Seeding Emulator with NFT

after creating a treasury with the service account, run

```bash
yarn nft
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

#### Switching networks

When switching between networks like emulator and testnet, `packages/client/src/contracts.json` needs to be updated with the appropriate addresses from `flow.json`.

You can specify the target network either via a `NETWORK` env variable or by modifying the `NETWORK` variable in `updateContractAddresses.js`.

```
NETWORK=testnet yarn update-contracts
```