const networksConfig = {
  emulator: {
    accessApi: "http://localhost:8888",
    walletDiscovery: "http://localhost:8701/fcl/authn",
  },
  testnet: {
    accessApi: "https://access-testnet.onflow.org",
    walletDiscovery: "https://fcl-discovery.onflow.org/testnet/authn",
  },
  mainnet: {
    accessApi: "https://access.onflow.org",
    walletDiscovery: "https://fcl-discovery.onflow.org/authn",
  },
};

export default networksConfig;
