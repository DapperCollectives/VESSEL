// This transactions deploys the FiatToken contract
//
// Owner (AuthAccount) of this script is the owner of the contract
//
transaction(
    contractName: String, 
    code: String,
        VaultStoragePath: StoragePath,
        VaultBalancePubPath: PublicPath,
        VaultUUIDPubPath: PublicPath,
        VaultReceiverPubPath: PublicPath,
        BlocklistExecutorStoragePath: StoragePath,
        BlocklisterStoragePath: StoragePath,
        BlocklisterCapReceiverPubPath: PublicPath,
        BlocklisterUUIDPubPath: PublicPath,
        BlocklisterPubSigner: PublicPath,
        PauseExecutorStoragePath: StoragePath,
        PauserStoragePath: StoragePath,
        PauserCapReceiverPubPath: PublicPath,
        PauserUUIDPubPath: PublicPath,
        PauserPubSigner: PublicPath,
        AdminExecutorStoragePath: StoragePath,
        AdminStoragePath: StoragePath,
        AdminCapReceiverPubPath: PublicPath,
        AdminUUIDPubPath: PublicPath,
        AdminPubSigner: PublicPath,
        OwnerExecutorStoragePath: StoragePath,
        OwnerStoragePath: StoragePath,
        OwnerCapReceiverPubPath: PublicPath,
        OwnerUUIDPubPath: PublicPath,
        OwnerPubSigner: PublicPath,
        MasterMinterExecutorStoragePath: StoragePath,
        MasterMinterStoragePath: StoragePath,
        MasterMinterCapReceiverPubPath: PublicPath,
        MasterMinterPubSigner: PublicPath,
        MasterMinterUUIDPubPath: PublicPath,
        MinterControllerStoragePath: StoragePath,
        MinterControllerUUIDPubPath: PublicPath,
        MinterControllerPubSigner: PublicPath,
        MinterStoragePath: StoragePath,
        MinterUUIDPubPath: PublicPath,
        initialAdminCapabilityPrivPath: PrivatePath,
        initialOwnerCapabilityPrivPath: PrivatePath,
        initialMasterMinterCapabilityPrivPath: PrivatePath,
        initialPauserCapabilityPrivPath: PrivatePath,
        initialBlocklisterCapabilityPrivPath: PrivatePath,
        tokenName: String,
        version: String,
        initTotalSupply: UFix64,
        initPaused: Bool,
        adminPubKeys: [String],
        adminPubKeysWeights: [UFix64],
        adminPubKeysAlgos: [UInt8],
        ownerPubKeys: [String],
        ownerPubKeysWeights: [UFix64],
        ownerPubKeysAlgos: [UInt8],
        masterMinterPubKeys: [String],
        masterMinterPubKeysWeights: [UFix64],
        masterMinterPubKeysAlgos: [UInt8],
        blocklisterPubKeys: [String],
        blocklisterPubKeysWeights: [UFix64],
        blocklisterPubKeysAlgos: [UInt8],
        pauserPubKeys: [String],
        pauserPubKeysWeights: [UFix64],
        pauserPubKeysAlgos: [UInt8],
) {
    prepare(owner: AuthAccount) {
        let existingContract = owner.contracts.get(name: contractName)

        if (existingContract == nil) {
            owner.contracts.add(
                name: contractName, 
                code: code.decodeHex(), 
                owner,
                VaultStoragePath: VaultStoragePath,
                VaultBalancePubPath: VaultBalancePubPath,
                VaultUUIDPubPath: VaultUUIDPubPath,
                VaultReceiverPubPath: VaultReceiverPubPath,
                BlocklistExecutorStoragePath: BlocklistExecutorStoragePath,
                BlocklisterStoragePath: BlocklisterStoragePath,
                BlocklisterCapReceiverPubPath: BlocklisterCapReceiverPubPath,
                BlocklisterUUIDPubPath: BlocklisterUUIDPubPath,
                BlocklisterPubSigner: BlocklisterPubSigner,
                PauseExecutorStoragePath: PauseExecutorStoragePath,
                PauserStoragePath: PauserStoragePath,
                PauserCapReceiverPubPath: PauserCapReceiverPubPath,
                PauserUUIDPubPath: PauserUUIDPubPath,
                PauserPubSigner: PauserPubSigner,
                AdminExecutorStoragePath: AdminExecutorStoragePath,
                AdminStoragePath: AdminStoragePath,
                AdminCapReceiverPubPath: AdminCapReceiverPubPath,
                AdminUUIDPubPath: AdminUUIDPubPath,
                AdminPubSigner: AdminPubSigner,
                OwnerExecutorStoragePath: OwnerExecutorStoragePath,
                OwnerStoragePath: OwnerStoragePath,
                OwnerCapReceiverPubPath: OwnerCapReceiverPubPath,
                OwnerUUIDPubPath: OwnerUUIDPubPath,
                OwnerPubSigner: OwnerPubSigner,
                MasterMinterExecutorStoragePath: MasterMinterExecutorStoragePath,
                MasterMinterStoragePath: MasterMinterStoragePath,
                MasterMinterCapReceiverPubPath: MasterMinterCapReceiverPubPath,
                MasterMinterPubSigner: MasterMinterPubSigner,
                MasterMinterUUIDPubPath: MasterMinterUUIDPubPath,
                MinterControllerStoragePath: MinterControllerStoragePath,
                MinterControllerUUIDPubPath: MinterControllerUUIDPubPath,
                MinterControllerPubSigner: MinterControllerPubSigner,
                MinterStoragePath: MinterStoragePath,
                MinterUUIDPubPath: MinterUUIDPubPath,
                initialAdminCapabilityPrivPath: initialAdminCapabilityPrivPath,
                initialOwnerCapabilityPrivPath: initialOwnerCapabilityPrivPath,
                initialMasterMinterCapabilityPrivPath: initialMasterMinterCapabilityPrivPath,
                initialPauserCapabilityPrivPath: initialPauserCapabilityPrivPath,
                initialBlocklisterCapabilityPrivPath: initialBlocklisterCapabilityPrivPath,
                tokenName: tokenName,
                version: version,
                initTotalSupply: initTotalSupply,
                initPaused: initPaused,
                adminPubKeys: adminPubKeys,
                adminPubKeysWeights: adminPubKeysWeights,
                adminPubKeysAlgos: adminPubKeysAlgos,
                ownerPubKeys: ownerPubKeys,
                ownerPubKeysWeights: ownerPubKeysWeights,
                ownerPubKeysAlgos: ownerPubKeysAlgos,
                masterMinterPubKeys: masterMinterPubKeys,
                masterMinterPubKeysWeights: masterMinterPubKeysWeights,
                masterMinterPubKeysAlgos: masterMinterPubKeysAlgos,
                blocklisterPubKeys: blocklisterPubKeys,
                blocklisterPubKeysWeights: blocklisterPubKeysWeights,
                blocklisterPubKeysAlgos: blocklisterPubKeysAlgos,
                pauserPubKeys: pauserPubKeys,
                pauserPubKeysWeights: pauserPubKeysWeights,
                pauserPubKeysAlgos: pauserPubKeysAlgos,
            )
        } else {
            owner.contracts.update__experimental(name: contractName, code: code.decodeHex())
        }
    }
}