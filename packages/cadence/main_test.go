package test_main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTreasury(t *testing.T) {
	otu := NewOverflowTest(t)

	var actionUUID uint64
	var FlowTokenVaultID = "A.0ae53cb6e3f42a79.FlowToken.Vault"
	var DefaultAccountBalance uint64 = 1e5
	var TransferAmount float64 = 100
	var TransferAmountUInt64 uint64 = 100e8
	var Signers = []string{"signer1", "signer2", "signer3", "signer4"}
	var RecipientAcct = "recipient"

	t.Run("User should be able to add a Treasury to their account.", func(t *testing.T) {
		otu.SetupTreasury("treasuryOwner", Signers)
	})

	t.Run("Signing account should have been initialized with specified signers.", func(t *testing.T) {
		// signers := otu.GetTreasurySigners("treasuryOwner")
		// TODO: Verify addresses are there
	})

	t.Run("Treasury should be able to receive fungible tokens", func(t *testing.T) {
		otu.MintFlow("signer1", TransferAmount)
		otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
		ids := otu.GetTreasuryIdentifiers("treasuryOwner")

		assert.Contains(otu.T, ids[0], FlowTokenVaultID)

		balance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		// UFix64 comes back as uint64, which is why we don't use
		// 100.0 for the comparison (though maybe we should)
		assert.Equal(otu.T, TransferAmountUInt64, balance)
	})

	t.Run("Treasury should be able to receive non-fungible tokens", func(t *testing.T) {
		otu.CreateNFTCollection("account")
		otu.MintNFT("account")
		otu.SendNFTToTreasury("treasuryOwner", 0)
	})

	t.Run("Signers should be able to propose a transfer of fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount)
	})

	t.Run("Signers should be able to sign to approve a proposed action", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		actionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", actionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", actionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action once it has received
		the required threshold of signatures`, func(t *testing.T) {
		otu.ExecuteAction("treasuryOwner", actionUUID)

		// Assert that all funds have been transfered out of the treasury vault
		treasuryBalance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		assert.Equal(otu.T, uint64(0), treasuryBalance)

		// Assert that all funds have been received by the recipient account
		recipientBalance := otu.GetAccount(RecipientAcct).Balance
		assert.Equal(otu.T, TransferAmountUInt64+DefaultAccountBalance, recipientBalance)
	})
}
