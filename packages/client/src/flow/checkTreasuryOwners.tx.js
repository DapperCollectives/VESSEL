export const CHECK_TREASURY_OWNER_ADDRESS = `
  pub fun main(ownerAddr: Address): Bool {
    return getAccount(ownerAddr) != nil
  }
`;
