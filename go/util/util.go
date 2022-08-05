package util

import (
	"encoding/hex"
	"fmt"
	"io/ioutil"
	"os/exec"
	"strings"

	"github.com/bjartek/overflow/overflow"
	"github.com/onflow/cadence"
)

func DeployFiatToken(ownerAcct, tokenName, version string, overflowState *overflow.OverflowState) {
	signer1, _ := overflowState.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer1"))
	signer2, _ := overflowState.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer2"))
	signer3, _ := overflowState.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer3"))
	signer4, _ := overflowState.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer4"))
	signer5, _ := overflowState.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer5"))

	pk1000 := signer1.Key().ToConfig().PrivateKey.PublicKey().String()
	pk500_1 := signer2.Key().ToConfig().PrivateKey.PublicKey().String()
	pk500_2 := signer3.Key().ToConfig().PrivateKey.PublicKey().String()
	pk250_1 := signer4.Key().ToConfig().PrivateKey.PublicKey().String()
	pk250_2 := signer5.Key().ToConfig().PrivateKey.PublicKey().String()

	multisigPubKeys := []cadence.Value{
		cadence.String(pk1000[2:]),
		cadence.String(pk500_1[2:]),
		cadence.String(pk500_2[2:]),
		cadence.String(pk250_1[2:]),
		cadence.String(pk250_2[2:]),
	}

	w1000, _ := cadence.NewUFix64("1000.0")
	w500, _ := cadence.NewUFix64("500.0")
	w250, _ := cadence.NewUFix64("250.0")

	multiSigKeyWeights := []cadence.Value{w1000, w500, w500, w250, w250}

	multiSigAlgos := []cadence.Value{
		cadence.NewUInt8(1),
		cadence.NewUInt8(1),
		cadence.NewUInt8(1),
		cadence.NewUInt8(1),
		cadence.NewUInt8(1),
	}
	fb, err := ioutil.ReadFile("contracts/core/FiatToken.cdc")

	if err != nil {
		panic(err)
	}

	overflowState.Tx("deploy_contract_with_auth",
		overflow.SignProposeAndPayAs("account"),
		overflow.Arg("contractName", "FiatToken"),
		overflow.Arg("code", hex.EncodeToString(fb)),
		overflow.Arg("VaultStoragePath", cadence.NewPath("storage", "USDCVault")),
		overflow.Arg("VaultBalancePubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultBalance"}),
		overflow.Arg("VaultUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultUUID"}),
		overflow.Arg("VaultReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultReceiver"}),
		overflow.Arg("BlocklistExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCBlocklistExe"}),
		overflow.Arg("BlocklisterUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCBlocklistExeCap"}),
		overflow.Arg("BlocklisterStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCBlocklister"}),
		overflow.Arg("BlocklisterCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCBlocklisterCapReceiver"}),
		overflow.Arg("BlocklisterPubSigner", cadence.Path{Domain: "public", Identifier: "USDCBlocklisterPublicSigner"}),
		overflow.Arg("PauseExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCPauseExe"}),
		overflow.Arg("PauserUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCPauseExeCap"}),
		overflow.Arg("PauserStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCPauser"}),
		overflow.Arg("PauserCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCPauserCapReceiver"}),
		overflow.Arg("PauserPubSigner", cadence.Path{Domain: "public", Identifier: "USDCPauserPublicSigner"}),
		overflow.Arg("AdminStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCAdmin"}),
		overflow.Arg("AdminPubSigner", cadence.Path{Domain: "public", Identifier: "USDCAdminPublicSigner"}),
		overflow.Arg("AdminExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCAdmin"}),
		overflow.Arg("AdminCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCAdminCapReciever"}),
		overflow.Arg("AdminUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCAdminPub"}),
		overflow.Arg("OwnerStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCOwner"}),
		overflow.Arg("OwnerUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCOwnerCap"}),
		overflow.Arg("OwnerExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCOwnerExecutor"}),
		overflow.Arg("OwnerCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCOwnerCapReceiver"}),
		overflow.Arg("OwnerPubSigner", cadence.Path{Domain: "public", Identifier: "USDCOwnerPubSigner"}),
		overflow.Arg("MasterMinterStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMasterMinter"}),
		overflow.Arg("MasterMinterPubSigner", cadence.Path{Domain: "public", Identifier: "USDCMasterMinterPublicSigner"}),
		overflow.Arg("MasterMinterUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCMasterMinterUUID"}),
		overflow.Arg("MasterMinterExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMasterMinterExecutor"}),
		overflow.Arg("MasterMinterCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCMasterMinterCapReceiver"}),
		overflow.Arg("MinterControllerStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMinterController"}),
		overflow.Arg("MinterControllerUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCMinterControllerUUID"}),
		overflow.Arg("MinterControllerPubSigner", cadence.Path{Domain: "public", Identifier: "USDCMinterControllerPublicSigner"}),
		overflow.Arg("MinterStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMinter"}),
		overflow.Arg("MinterUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCMinterUUID"}),
		overflow.Arg("initialAdminCapabilityPrivPath", cadence.Path{Domain: "private", Identifier: "USDCAdminPrivPath"}),
		overflow.Arg("initialOwnerCapabilityPrivPath", cadence.Path{Domain: "private", Identifier: "USDCOwnerPrivPath"}),
		overflow.Arg("initialMasterMinterCapabilityPrivPath", cadence.Path{Domain: "private", Identifier: "USDCMasterMinterPrivPath"}),
		overflow.Arg("initialPauserCapabilityPrivPath", cadence.Path{Domain: "private", Identifier: "USDCPauserPrivPath"}),
		overflow.Arg("initialBlocklisterCapabilityPrivPath", cadence.Path{Domain: "private", Identifier: "USDCBlocklisterPrivPath"}),
		overflow.Arg("tokenName", tokenName),
		overflow.Arg("version", version),
		overflow.Arg("initTotalSupply", 1000000000.00000000),
		overflow.Arg("initPaused", false),
		overflow.Arg("adminPubKeys", cadence.NewArray(multisigPubKeys)),
		overflow.Arg("adminPubKeysWeights", cadence.NewArray(multiSigKeyWeights)),
		overflow.Arg("adminPubKeysAlgos", cadence.NewArray(multiSigAlgos)),
		overflow.Arg("ownerPubKeys", cadence.NewArray(multisigPubKeys)),
		overflow.Arg("ownerPubKeysWeights", cadence.NewArray(multiSigKeyWeights)),
		overflow.Arg("ownerPubKeysAlgos", cadence.NewArray(multiSigAlgos)),
		overflow.Arg("masterMinterPubKeys", cadence.NewArray(multisigPubKeys)),
		overflow.Arg("masterMinterPubKeysWeights", cadence.NewArray(multiSigKeyWeights)),
		overflow.Arg("masterMinterPubKeysAlgos", cadence.NewArray(multiSigAlgos)),
		overflow.Arg("blocklisterPubKeys", cadence.NewArray(multisigPubKeys)),
		overflow.Arg("blocklisterPubKeysWeights", cadence.NewArray(multiSigKeyWeights)),
		overflow.Arg("blocklisterPubKeysAlgos", cadence.NewArray(multiSigAlgos)),
		overflow.Arg("pauserPubKeys", cadence.NewArray(multisigPubKeys)),
		overflow.Arg("pauserPubKeysWeights", cadence.NewArray(multiSigKeyWeights)),
		overflow.Arg("pauserPubKeysAlgos", cadence.NewArray(multiSigAlgos)),
	).Print()
	UpdateContractAddresses()
}

func UpdateContractAddresses() {
	command := "node updateContractAddresses.js emulator"
	parts := strings.Fields(command)
	_, err := exec.Command(parts[0], parts[1:]...).Output()
	if err != nil {
		panic(err)
	}
}
