package main

import (
	"github.com/bjartek/overflow/overflow"
)

type OverflowTestUtils struct {
	O *overflow.Overflow
}

func main() {
	otu := DeployOverflow()
	otu.DeployFiatTokenContract("treasuryOwner", "USDC", "0.1.0")
}

func DeployOverflow() *OverflowTestUtils {
	return &OverflowTestUtils{O: overflow.NewTestingEmulator().Start()}
	//NewOverflowEmulator
}

func (otu *OverflowTestUtils) DeployFiatTokenContract(ownerAcct string, tokenName string, version string) {

	const Acct1000 = "signer1"
	const Acct500_1 = "signer2"
	const Acct500_2 = "signer3"
	const Acct250_1 = "signer3"
	const Acct250_2 = "signer5"

	pk1000 := otu.O.Account(Acct1000).Key().ToConfig().PrivateKey.PublicKey().String()
	pk500_1 := otu.O.Account(Acct500_1).Key().ToConfig().PrivateKey.PublicKey().String()
	pk500_2 := otu.O.Account(Acct500_2).Key().ToConfig().PrivateKey.PublicKey().String()
	pk250_1 := otu.O.Account(Acct250_1).Key().ToConfig().PrivateKey.PublicKey().String()
	pk250_2 := otu.O.Account(Acct250_2).Key().ToConfig().PrivateKey.PublicKey().String()

	w1000 := float64(1000.0)
	w500 := float64(500.0)
	w250 := float64(250.0)

	otu.O.TransactionFromFile("deploy_contract_with_auth.cdc").
		SignProposeAndPayAs(ownerAcct).
		Args(otu.O.Arguments().
			Account(ownerAcct).
			StoragePath("USDCVaultProvider-2").
			PublicPath("USDCVaultBalance-2").
			PublicPath("USDCVaultUUID-2").
			PublicPath("USDCVaultAllowance-2").
			PublicPath("USDCVaultReceiver-2").
			PublicPath("USDCVaultPublicSigner-2").
			StoragePath("USDCBlocklistExe-2").
			PrivatePath("USDCBlocklistExeCap-2").
			StoragePath("USDCBlocklister-2").
			PublicPath("USDCBlocklisterCapReceiver-2").
			PublicPath("USDCBlocklisterPublicSigner-2").
			StoragePath("USDCPauseExe-2").
			PrivatePath("USDCPauseExeCap-2").
			StoragePath("USDCPauser-2").
			PublicPath("USDCPauserCapReceiver-2").
			PublicPath("USDCPauserPublicSigner-2").
			StoragePath("USDCAdmin-2").
			PublicPath("USDCAdminPublicSigner-2").
			StoragePath("USDCOwner-2").
			PrivatePath("USDCOwnerCap-2").
			StoragePath("USDCMasterMinter-2").
			PrivatePath("USDCMasterMinterCap-2").
			PublicPath("USDCMasterMinterPublicSigner-2").
			PublicPath("USDCMasterMinterUUID-2").
			StoragePath("USDCMinterController-2").
			PublicPath("USDCMinterControllerUUID-2").
			PublicPath("USDCMinterControllerPublicSigner-2").
			StoragePath("USDCMinter-2").
			PublicPath("USDCMinterUUID-2").
			PublicPath("USDCMinterPublicSigner-2").
			String(tokenName).
			String(version).
			UFix64(1000000000.00000000).
			Boolean(false).
			StringArray(pk1000[2:], pk500_1[2:], pk500_2[2:], pk250_1[2:], pk250_2[2:]).
			UFix64Array(w1000, w500, w500, w250, w250).
			UInt8Array(uint8(1), uint8(1), uint8(1), uint8(1), uint8(1)))

}
