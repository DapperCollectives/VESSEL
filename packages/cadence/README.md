# Vessel Contracts

## Prerequisites

- [Node/NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [GoLang 1.6](https://golang.org/doc/install)
- [Flow CLI](https://docs.onflow.org/flow-cli/install/)

## Development

Vessel treasury management contracts are located in `./contracts`.

```bash
node chain
```

To deploy all contracts:

```bash
node deploy
```

## Test

```bash
go test main_test.go
```

## Build & Run Emulator with Accounts & Contracts pre-initialized from Dockerfile

```bash
make build-vessel-emulator
```

```bash
make run-vessel-emulator
```

## Run VESSEL Test Suite from Dockerfile
