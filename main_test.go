package test_main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

var FlowTokenVaultID = "A.0ae53cb6e3f42a79.FlowToken.Vault"
var NonFungibleTokenCollectionID = "A.f8d6e0586b0a20c7.ExampleNFT.Collection"
var DefaultAccountBalance uint64 = 1e5
var TransferAmount float64 = 100
var TransferAmountUInt64 uint64 = 100e8
var Signers = []string{"signer1", "signer2", "signer3", "signer4", "signer5"}
var DefaultThreshold = len(Signers)
var RecipientAcct = "recipient"

func TestTreasurySetup(t *testing.T) {
	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)

	t.Run("User should be able to add a Treasury to their account.", func(t *testing.T) {
		otu.SetupTreasury("treasuryOwner", Signers, uint64(DefaultThreshold))
	})

	t.Run("Signing account should have been initialized with specified signers.", func(t *testing.T) {
		// signers := otu.GetTreasurySigners("treasuryOwner")
		// TODO: Verify addresses are there
	})

	t.Run("Treasury should be able to receive fungible tokens", func(t *testing.T) {
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

		// Treasury must first have a collection to receive an NFT
		otu.CreateNFTCollection("signer1")
		otu.SendCollectionToTreasury("signer1", "treasuryOwner")

		otu.SendNFTToTreasury("account", "treasuryOwner", 0)

		// Assert that the NFT has been transfered into the treasury
		collectionIds := otu.GetTreasuryIdentifiers("treasuryOwner")
		ownedNFTIds := otu.GetTreasuryCollection("treasuryOwner", collectionIds[1][0])
		assert.Contains(otu.T, ownedNFTIds, uint64(0))

	})
}

func TestTransferTokensToAccountActions(t *testing.T) {
	var transferTokenActionUUID uint64
	var transferNFTActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	otu.SetupTreasury("treasuryOwner", Signers, uint64(DefaultThreshold))
	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
	otu.CreateNFTCollection("account")
	otu.MintNFT("account")

	otu.CreateNFTCollection("signer1")
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("account", "treasuryOwner", 0)

	t.Run("Signers should be able to propose a transfer of fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount)
	})

	t.Run("Signers should be able to sign to approve a proposed action to transfer tokens", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		transferTokenActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", transferTokenActionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer tokens once it has received
		the required threshold of signatures`, func(t *testing.T) {
		otu.ExecuteAction("treasuryOwner", transferTokenActionUUID)

		// Assert that all funds have been transfered out of the treasury vault
		treasuryBalance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		assert.Equal(otu.T, uint64(0), treasuryBalance)

		// Assert that all funds have been received by the recipient account
		recipientBalance := otu.GetAccount(RecipientAcct).Balance
		assert.Equal(otu.T, TransferAmountUInt64+DefaultAccountBalance, recipientBalance)
	})

	t.Run("Signers should be able to propose a transfer of a non-fungible token out of the Treasury", func(t *testing.T) {
		// TODO: create collection in one of the signer accounts
		otu.ProposeNonFungibleTokenTransferAction("treasuryOwner", Signers[0], "account", uint64(0))
	})

	t.Run("Signers should be able to sign to approve a proposed action to transfer an NFT", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		transferNFTActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", transferNFTActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", transferNFTActionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer an NFT once it has received
		the required threshold of signatures`, func(t *testing.T) {
		otu.ExecuteAction("treasuryOwner", transferNFTActionUUID)

		// Assert that the NFT has been transfered out of the treasury vault
		collectionIds := otu.GetTreasuryIdentifiers("treasuryOwner")
		ownedNFTIds := otu.GetTreasuryCollection("treasuryOwner", collectionIds[1][0])
		assert.Equal(otu.T, 0, len(ownedNFTIds))

		// TODO: Assert that the NFT has been received by the recipient account
	})
}

func TestTransferFungibleTokensToTreasuryActions(t *testing.T) {
	var transferTokenActionUUID uint64
	// var transferNFTActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	otu.SetupTreasury("treasuryOwner", Signers, uint64(DefaultThreshold))
	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
	otu.CreateNFTCollection("account")
	otu.MintNFT("account")

	otu.CreateNFTCollection("signer1")
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")

	otu.SendNFTToTreasury("account", "treasuryOwner", 0)

	// Recipient treasury
	otu.SetupTreasury("recipient", Signers, uint64(DefaultThreshold))

	t.Run("Signers should be able to propose a transfer of fungible tokens out of the Treasury to another Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferToTreasuryAction("treasuryOwner", Signers[0], RecipientAcct, FlowTokenVaultID, TransferAmount)
	})

	t.Run("Signers should be able to sign to approve a proposed action to transfer tokens", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		transferTokenActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", transferTokenActionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer tokens to a Treasury once it has received
		the required threshold of signatures`, func(t *testing.T) {
		otu.ExecuteAction("treasuryOwner", transferTokenActionUUID)

		// Assert that all funds have been transfered out of the treasury vault
		treasuryBalance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		assert.Equal(otu.T, uint64(0), treasuryBalance)

		// Assert that all funds have been received by the recipient account
		recipientTreasuryBalance := otu.GetTreasuryVaultBalance("recipient", FlowTokenVaultID)
		assert.Equal(otu.T, TransferAmountUInt64, recipientTreasuryBalance)
	})
}

func TestTransferNonFungibleTokensToAccountActions(t *testing.T) {
	// TODO
}

func TestTransferNonFungibleTokensToTreasuryActions(t *testing.T) {
	var transferNFTActionUUID uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, uint64(DefaultThreshold))
	otu.CreateNFTCollection("account")
	otu.MintNFT("account")

	otu.CreateNFTCollection("signer1")
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("account", "treasuryOwner", 0)

	// Recipient treasury
	otu.SetupTreasury("recipient", Signers, uint64(DefaultThreshold))

	t.Run("Signers should be able to propose a transfer of a non fungible token out of the Treasury to another Treasury", func(t *testing.T) {
		otu.ProposeNonFungibleTokenTransferToTreasuryAction("treasuryOwner", Signers[0], RecipientAcct, NonFungibleTokenCollectionID, 0)
	})

	t.Run("Signers should be able to sign to approve a proposed action to transfer a non-fungible token to a Treasury", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		transferNFTActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", transferNFTActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", transferNFTActionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer a non-fungible token to a Treasury once it has received
		the required threshold of signatures`, func(t *testing.T) {
		// First, create an empty collection and transfer it to the treasury
		otu.CreateNFTCollection("signer1")
		otu.SendCollectionToTreasury("signer1", "recipient")

		otu.ExecuteAction("treasuryOwner", transferNFTActionUUID)

		// Assert that the NFT has been transfered out of the treasury vault
		collectionIds := otu.GetTreasuryIdentifiers("treasuryOwner")
		ownedNFTIds := otu.GetTreasuryCollection("treasuryOwner", collectionIds[1][0])
		assert.Equal(otu.T, 0, len(ownedNFTIds))

		// Assert that the NFT has been transfered into the recpient treasury
		collectionIds = otu.GetTreasuryIdentifiers("recipient")
		ownedNFTIds = otu.GetTreasuryCollection("recipient", collectionIds[1][0])
		assert.Contains(otu.T, ownedNFTIds, uint64(0))
	})
}

func TestAddSignerAction(t *testing.T) {
	var addSignerActionUUID uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, uint64(DefaultThreshold))

	t.Run("User should be able to propose a signer to be added", func(t *testing.T) {
		otu.ProposeAddSignerAction("treasuryOwner", "signer6")
	})

	t.Run("Signers should be able to sign to approve a proposed action to add a new signer", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		addSignerActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", addSignerActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", addSignerActionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A treasuryOwner should be able to execute a proposed action to add a signer to Treasury once it has received the required threshold of signatures`, func(t *testing.T) {

		otu.ExecuteAction("treasuryOwner", addSignerActionUUID)

		signers := otu.GetTreasurySigners("treasuryOwner").String()

		assert.Contains(otu.T, signers, otu.GetAccountAddress("signer6"))
	})

}

func TestRemoveSignerAction(t *testing.T) {
	var removeSignerActionUUID uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, uint64(DefaultThreshold))

	t.Run("User should be able to propose a signer to be removed", func(t *testing.T) {
		otu.ProposeRemoveSignerAction("treasuryOwner", "signer4")
	})

	t.Run("Signers should be able to sign to approve a proposed action to remove a signer", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		removeSignerActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", removeSignerActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetVerifiedSignersForAction("treasuryOwner", removeSignerActionUUID)
		for _, signer := range Signers {
			assert.True(otu.T, true, signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A treasuryOwner should be able to execute a proposed action to remove a signer once it has received the required threshold of signatures`, func(t *testing.T) {

		otu.ExecuteAction("treasuryOwner", removeSignerActionUUID)

		signers := otu.GetTreasurySigners("treasuryOwner").String()

		assert.NotContains(otu.T, signers, otu.GetAccountAddress("signer4"))
	})
}
