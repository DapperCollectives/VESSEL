pub fun main(addr: Address): UFix64 {
    let acct = getAccount(addr)
    return acct.balance
}