package main

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"html/template"
	"io/ioutil"

	"github.com/bjartek/overflow/overflow"
	"github.com/onflow/cadence"
)

type OverflowTestUtils struct {
	O *overflow.OverflowState
}

type Addresses struct {
	FungibleToken      string
	FiatTokenInterface string
	FiatToken          string
	OnChainMultiSig    string
}

func main() {
	otu := DeployOverflow()
	otu.DeployFiatTokenContract("treasuryOwner", "USDC", "0.1.0")
}

func DeployOverflow() *OverflowTestUtils {
	return &OverflowTestUtils{O: overflow.NewOverflowEmulator().Start()}
}

func (otu *OverflowTestUtils) DeployFiatTokenContract(ownerAcct string, tokenName string, version string) {
	signer1, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer1"))
	signer2, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer2"))
	signer3, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer3"))
	signer4, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer4"))
	signer5, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", "signer5"))

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

	tmpl, err := template.New("text/template").Parse(string(fb))
	if err != nil {
		panic(err)
	}

	ownerAccount, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", ownerAcct))

	addresses := Addresses{ownerAccount.Address().String(), ownerAccount.Address().String(), ownerAccount.Address().String(), ownerAccount.Address().String()}

	buf := &bytes.Buffer{}
	err = tmpl.Execute(buf, addresses)
	if err != nil {
		panic(err)
	}

	otu.O.Tx("deploy_contract_with_auth",
		overflow.SignProposeAndPayAs("account"),
		overflow.Arg("contractName", "FiatToken"),
		overflow.Arg("code", hex.EncodeToString(buf.Bytes())),
		overflow.Arg("VaultStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCVault"}),
		overflow.Arg("VaultProviderPrivPath", cadence.Path{Domain: "private", Identifier: "USDCVaultBalance"}),
		overflow.Arg("VaultBalancePubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultBalance"}),
		overflow.Arg("VaultUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultUUID"}),
		overflow.Arg("VaultAllowancePubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultAllowance"}),
		overflow.Arg("VaultReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCVaultReceiver"}),
		overflow.Arg("VaultPubSigner", cadence.Path{Domain: "public", Identifier: "USDCVaultPublicSigner"}),
		overflow.Arg("BlocklistExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCBlocklistExe"}),
		overflow.Arg("BlocklistExecutorPrivPath", cadence.Path{Domain: "private", Identifier: "USDCBlocklistExeCap"}),
		overflow.Arg("BlocklisterStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCBlocklister"}),
		overflow.Arg("BlocklisterCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCBlocklisterCapReceiver"}),
		overflow.Arg("BlocklisterPubSigner", cadence.Path{Domain: "public", Identifier: "USDCBlocklisterPublicSigner"}),
		overflow.Arg("PauseExecutorStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCPauseExe"}),
		overflow.Arg("PauseExecutorPrivPath", cadence.Path{Domain: "private", Identifier: "USDCPauseExeCap"}),
		overflow.Arg("PauserStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCPauser"}),
		overflow.Arg("PauserCapReceiverPubPath", cadence.Path{Domain: "public", Identifier: "USDCPauserCapReceiver"}),
		overflow.Arg("PauserPubSigner", cadence.Path{Domain: "public", Identifier: "USDCPauserPublicSigner"}),
		overflow.Arg("AdminStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCAdmin"}),
		overflow.Arg("AdminPubSigner", cadence.Path{Domain: "public", Identifier: "USDCAdminPublicSigner"}),
		overflow.Arg("OwnerStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCOwner"}),
		overflow.Arg("OwnerPrivPath", cadence.Path{Domain: "private", Identifier: "USDCOwnerCap"}),
		overflow.Arg("MasterMinterStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMasterMinter"}),
		overflow.Arg("MasterMinterPrivPath", cadence.Path{Domain: "private", Identifier: "USDCMasterMinterCap"}),
		overflow.Arg("MasterMinterPubSigner", cadence.Path{Domain: "public", Identifier: "USDCMasterMinterPublicSigner"}),
		overflow.Arg("MasterMinterUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCMasterMinterUUID"}),
		overflow.Arg("MinterControllerStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMinterController"}),
		overflow.Arg("MinterControllerUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCMinterControllerUUID"}),
		overflow.Arg("MinterControllerPubSigner", cadence.Path{Domain: "public", Identifier: "USDCMinterControllerPublicSigner"}),
		overflow.Arg("MinterStoragePath", cadence.Path{Domain: "storage", Identifier: "USDCMinter"}),
		overflow.Arg("MinterUUIDPubPath", cadence.Path{Domain: "public", Identifier: "USDCMinterUUID"}),
		overflow.Arg("MinterPubSigner", cadence.Path{Domain: "public", Identifier: "USDCMinterPublicSigner"}),
		overflow.Arg("tokenName", tokenName),
		overflow.Arg("version", version),
		overflow.Arg("initTotalSupply", 1000000000.00000000),
		overflow.Arg("initPaused", false),
		overflow.Arg("ownerAccountPubKeys", cadence.NewArray(multisigPubKeys)),
		overflow.Arg("ownerAccountKeyWeights", cadence.NewArray(multiSigKeyWeights)),
		overflow.Arg("ownerAccountKeyAlgos", cadence.NewArray(multiSigAlgos))).Print()

}
