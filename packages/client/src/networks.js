const networksConfig = {
  emulator: {
    accessApi: "http://localhost:8888",
    walletDiscovery: "http://localhost:8701/fcl/authn",
    walletDiscoveryApi: null,
    walletDiscoveryInclude: [],
  },
  testnet: {
    accessApi: "https://rest-testnet.onflow.org",
    walletDiscovery: "https://fcl-discovery.onflow.org/testnet/authn",
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/testnet/authn',
    walletDiscoveryInclude: ['0x82ec283f88a62e65'],
  },
  mainnet: {
    accessApi: "https://access.onflow.org",
    walletDiscovery: "https://fcl-discovery.onflow.org/authn",
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/authn',
    walletDiscoveryInclude: ['0xead892083b3e2c6c'],
  },
};

export default networksConfig;
