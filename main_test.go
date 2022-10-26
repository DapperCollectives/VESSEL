package test_main

import (
	"fmt"
	"testing"

	"github.com/bjartek/overflow/overflow"
	"github.com/stretchr/testify/assert"
)

var FlowTokenVaultID = "A.0ae53cb6e3f42a79.FlowToken.Vault"
var FUSDTokenVaultID = "A.f8d6e0586b0a20c7.FUSD.Vault"
var NonFungibleTokenCollectionID = "A.f8d6e0586b0a20c7.ExampleNFT.Collection"
var DefaultAccountBalance uint64 = 1e5
var TransferAmount float64 = 100
var TransferAmountUInt64 uint64 = 100e8
var Signers = []string{"treasuryOwner", "signer1", "signer2", "signer3", "signer4"}
var DefaultThreshold = len(Signers)
var MaxSigners = append(GenerateSigners(20), "treasuryOwner")
var MaxThreshold = 20
var RecipientAcct = "recipient"
var FLOWPublicReceiverPathId = "flowTokenReceiver"
var FUSDPublicReceiverPathId = "fusdReceiver"

func TestTreasurySetup(t *testing.T) {
	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)

	t.Run("User shouldn't be able to add a Treasury with a higher threshold.", func(t *testing.T) {
		otu.SetupTreasuryFail("treasuryOwner", Signers, 10, "Number of signers must be equal or higher than the threshold.")
	})

	t.Run("User should be able to add a Treasury to their account.", func(t *testing.T) {
		otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	})

	t.Run("Signing account should have been initialized with specified signers.", func(t *testing.T) {
		signers := otu.GetTreasurySigners("treasuryOwner").String()

		for _, signer := range Signers {
			assert.Contains(otu.T, signers, otu.GetAccountAddress(signer))
		}
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

	t.Run("Treasury has fungible tokens, destroy Treasury should not be allowed", func(t *testing.T) {
		otu.DestroyTreasuryWithVaultsNotAllowed("treasuryOwner")
	})

	t.Run("Treasury should be able to receive non-fungible tokens", func(t *testing.T) {
		otu.CreateNFTCollection("signer1")
		otu.MintNFT("signer1")

		// Treasury must first have a collection to receive an NFT
		otu.CreateNFTCollection("treasuryOwner")
		// Only signers can send collection to treasury
		otu.SendCollectionToTreasury("signer1", "treasuryOwner")
		otu.SendNFTToTreasury("signer1", "treasuryOwner", 0)

		// Assert that the NFT has been transfered into the treasury
		// collectionIds := otu.GetTreasuryIdentifiers("treasuryOwner")
		// ownedNFTIds := otu.GetTreasuryCollection("treasuryOwner", collectionIds[1][0])
		// assert.Contains(otu.T, ownedNFTIds, uint64(0))
	})

	t.Run("Signer should be able to add a blocto vault to treasury", func(t *testing.T) {
		otu.AddBloctoVaultToTreasury("signer1", "treasuryOwner")

		// Assert that the vault has been added to the treasury
		identifiers := otu.GetTreasuryIdentifiers("treasuryOwner")
		assert.Contains(otu.T, identifiers[0], "A.f8d6e0586b0a20c7.BloctoToken.Vault")
	})
}

func TestTransferFungibleTokensToAccountActions(t *testing.T) {
	var transferTokenActionUUID uint64

	otu := NewOverflowTest(t)

	otu.MintFlow("signer1", TransferAmount)
	otu.CreateNFTCollection("signer1")
	otu.MintNFT("signer1")
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.CreateNFTCollection("treasuryOwner")

	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("signer1", "treasuryOwner", 0)

	t.Run("Signers should be able to propose a transfer of fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount, FLOWPublicReceiverPathId, FlowTokenVaultID)
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
		var txResult overflow.TransactionResult
		for _, signer := range Signers {
			// Test if the action fails without all signer approvals
			otu.ExecuteActionFailed("treasuryOwner", transferTokenActionUUID, "This action has not received a signature from every signer yet.")
			txResult = otu.SignerApproveAction("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the SignerApproveAction event was emitted with the correct params from the last approval
		otu.AssertActionApprovedBySignerEvent(txResult, ACTION_APPROVED_BY_SIGNER_EVENT)

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)
		fmt.Printf("signers map: %v\n", signersMap)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer tokens once it has received
		the required threshold of signatures`, func(t *testing.T) {
		txResult := otu.ExecuteAction("treasuryOwner", transferTokenActionUUID)

		// Assert ActionExecuted event was emitted with correct params
		otu.AssertActionExecutedEventsMatch(txResult, TRANSFER_FUNGIBLE_TOKENS_EXECUTE_ACTION_EVENT)

		// Assert that all funds have been transfered out of the treasury vault
		treasuryBalance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		assert.Equal(otu.T, uint64(0), treasuryBalance)

		// Assert that all funds have been received by the recipient account
		recipientBalance := otu.GetAccount(RecipientAcct).Balance
		assert.Equal(otu.T, TransferAmountUInt64+DefaultAccountBalance, recipientBalance)
	})
}

func TestTransferFUSDToAccountActions(t *testing.T) {
	var transferTokenActionUUID uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.SetupFUSD("account")
	otu.MintFUSD("account", TransferAmount)
	otu.SendFUSDToTreasury("account", "treasuryOwner", TransferAmount)

	t.Run("Signers should be able to propose a transfer of FUSD tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], "account", TransferAmount, FUSDPublicReceiverPathId, FUSDTokenVaultID)
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
			// Test if the action fails without all signer approvals
			otu.ExecuteActionFailed("treasuryOwner", transferTokenActionUUID, "This action has not received a signature from every signer yet.")
			otu.SignerApproveAction("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer tokens once it has received
		the required threshold of signatures`, func(t *testing.T) {
		otu.ExecuteAction("treasuryOwner", transferTokenActionUUID)

		// Assert that all funds have been transfered out of the treasury vault
		treasuryBalance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		assert.Equal(otu.T, uint64(0), treasuryBalance)

		// Assert that all funds have been received by the recipient account
		recipientBalance := otu.GetAccountFUSDBalance("account")
		assert.Equal(otu.T, TransferAmountUInt64, recipientBalance)
	})
}

func TestTransferTokensToAccountActionsWith20Signers(t *testing.T) {
	var transferTokenActionUUID uint64
	var transferNFTActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	otu.CreateNFTCollection("signer1")
	otu.MintNFT("signer1")

	otu.SetupTreasury("treasuryOwner", MaxSigners, MaxThreshold)
	otu.CreateNFTCollection("treasuryOwner")

	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("signer1", "treasuryOwner", 0)

	otu.CreateNFTCollection("account")

	t.Run("Signers should be able to propose a transfer of fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferAction("treasuryOwner", MaxSigners[0], RecipientAcct, TransferAmount, FLOWPublicReceiverPathId, FlowTokenVaultID)
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
		for _, signer := range MaxSigners {
			otu.SignerApproveAction("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)
		for _, signer := range MaxSigners {
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

	t.Run("Signers shouldn't be able to propose a transfer of 0.0 fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferActionFail("treasuryOwner", Signers[0], RecipientAcct, 0.0, FLOWPublicReceiverPathId)
	})

	t.Run("Signers should be able to propose a transfer of a non-fungible token out of the Treasury", func(t *testing.T) {
		otu.ProposeNonFungibleTokenTransferAction("treasuryOwner", MaxSigners[0], "account", uint64(0))
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
		for _, signer := range MaxSigners {
			otu.SignerApproveAction("treasuryOwner", transferNFTActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferNFTActionUUID)
		for _, signer := range MaxSigners {
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

		// Assert that the NFT has been received by the recipient account
		// ownedNFTIds = otu.GetAccountCollection("account")
		// assert.Contains(otu.T, ownedNFTIds, uint64(0))
	})

	t.Run("Destroy Treasury should be allowed if both vaults and collections are empty", func(t *testing.T) {
		otu.DestroyTreasuryShoudBeAllowed("treasuryOwner")
	})

}

func TestTransferFungibleTokensToTreasuryActions(t *testing.T) {
	var transferTokenActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
	otu.CreateNFTCollection("account")
	otu.CreateNFTCollection("signer1")
	otu.MintNFT("account")

	otu.SendCollectionToTreasury("signer1", "treasuryOwner")

	otu.SendNFTToTreasury("account", "treasuryOwner", 0)

	// Recipient treasury
	otu.SetupTreasury("recipient", Signers, DefaultThreshold)

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
			// Test if the action fails without all signer approvals
			otu.ExecuteActionFailed("treasuryOwner", transferTokenActionUUID, "This action has not received a signature from every signer yet.")
			otu.SignerApproveAction("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer tokens to a Treasury once it has received
		the required threshold of signatures`, func(t *testing.T) {
		txResult := otu.ExecuteAction("treasuryOwner", transferTokenActionUUID)

		// Assert ActionExecuted event is called with expected params
		otu.AssertActionExecutedEventsMatch(txResult, TRANSFER_FUNGIBLE_TOKENS_TO_TREASURY_EXECUTE_ACTION_EVENT)

		// Assert that all funds have been transfered out of the treasury vault
		treasuryBalance := otu.GetTreasuryVaultBalance("treasuryOwner", FlowTokenVaultID)
		assert.Equal(otu.T, uint64(0), treasuryBalance)

		// Assert that all funds have been received by the recipient account
		recipientTreasuryBalance := otu.GetTreasuryVaultBalance("recipient", FlowTokenVaultID)
		assert.Equal(otu.T, TransferAmountUInt64, recipientTreasuryBalance)
	})

	t.Run("Signers shouldn't be able to propose to transfer 0.0 fungible tokens out of the Treasury to another Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferToTreasuryActionFail("treasuryOwner", Signers[0], RecipientAcct, FlowTokenVaultID, 0.0)
	})
}

func TestTransferNonFungibleTokensToAccountActions(t *testing.T) {
	var transferNFTActionUUID uint64

	otu := NewOverflowTest(t)
	//create NFT collection and mint NFT for signer1
	otu.CreateNFTCollection("signer1")
	otu.MintNFT("signer1")

	//set up treasury and send nft from signer1 to treasuray
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.CreateNFTCollection("treasuryOwner")
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("signer1", "treasuryOwner", 0)

	//set up the account
	otu.CreateNFTCollection("account")

	t.Run("Treasury has non-fungible tokens, destroy Treasury should not be allowed", func(t *testing.T) {
		otu.DestroyTreasuryWithCollectionsNotAllowed("treasuryOwner")
	})

	t.Run("Signers should be able to propose a transfer of non fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeNonFungibleTokenTransferAction("treasuryOwner", Signers[0], "account", uint64(0))
	})

	t.Run("Signers should be able to sign to approve a proposed action to transfer a non-fungible token to an account", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		transferNFTActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.ExecuteActionFailed("treasuryOwner", transferNFTActionUUID, "This action has not received a signature from every signer yet.")
			otu.SignerApproveAction("treasuryOwner", transferNFTActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferNFTActionUUID)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer a non-fungible token to an account once it has received
		the required threshold of signatures`, func(t *testing.T) {
		txResult := otu.ExecuteAction("treasuryOwner", transferNFTActionUUID)

		// Assert ActionExecuted event was emitted with correct params
		otu.AssertActionExecutedEventsMatch(txResult, TRANSFER_NON_FUNGIBLE_TOKENS_EXECUTE_ACTION_EVENT)

		// Assert that the NFT has been transfered out of the treasury vault
		collectionIds := otu.GetTreasuryIdentifiers("treasuryOwner")
		ownedNFTIds := otu.GetTreasuryCollection("treasuryOwner", collectionIds[1][0])
		assert.Equal(otu.T, 0, len(ownedNFTIds))

		// Assert that the NFT has been transfered into the account collection
		ownedNFTIds = otu.GetAccountCollection("account")
		assert.Contains(otu.T, ownedNFTIds, uint64(0))
	})

}

func TestTransferNonFungibleTokensToTreasuryActions(t *testing.T) {
	var transferNFTActionUUID uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.CreateNFTCollection("account")
	otu.MintNFT("account")

	otu.CreateNFTCollection("signer1")
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("account", "treasuryOwner", 0)

	// Recipient treasury
	otu.SetupTreasury("recipient", Signers, DefaultThreshold)

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
			// Test if the action fails without all signer approvals
			otu.ExecuteActionFailed("treasuryOwner", transferNFTActionUUID, "This action has not received a signature from every signer yet.")
			otu.SignerApproveAction("treasuryOwner", transferNFTActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferNFTActionUUID)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A signer should be able to execute a proposed action to transfer a non-fungible token to a Treasury once it has received
		the required threshold of signatures`, func(t *testing.T) {
		// First, create an empty collection in the recipient's  account and transfer it to the treasury
		otu.CreateNFTCollection("signer1")
		otu.SendCollectionToTreasury("signer1", "recipient")

		txResult := otu.ExecuteAction("treasuryOwner", transferNFTActionUUID)

		// Assert ActionExecuted event was emitted with correct params
		otu.AssertActionExecutedEventsMatch(txResult, TRANSFER_NON_FUNGIBLE_TOKENS_TO_TREASURY_EXECUTE_ACTION_EVENT)

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

func TestSignerRejectApproval(t *testing.T) {
	var transferTokenActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	// Setup with threshold of 1 so that all signers must reject
	// for action to be deleted
	otu.SetupTreasury("treasuryOwner", Signers, 1)
	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)

	// Propose action
	otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount, FLOWPublicReceiverPathId, FlowTokenVaultID)

	t.Run("Signers should be able to sign to reject their approval of a proposed action", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}

		transferTokenActionUUID = keys[0]

		// All but one signer rejects approval so we dont delete the action
		for i, signer := range Signers {
			if i == len(Signers)-1 {
				continue
			}
			otu.SignerRejectApproval("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)
		for i, signer := range Signers {
			if i == len(Signers)-1 {
				continue
			}
			assert.Equal(otu.T, "rejected", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run("If inverse threshold of rejections is reached, action should be deleted", func(t *testing.T) {
		// Last signer rejects approval
		txResult := otu.SignerRejectApproval("treasuryOwner", transferTokenActionUUID, Signers[len(Signers)-1])

		// Assert event is emitted with correct params
		otu.AssertActionRejectedBySignerEvent(txResult, ACTION_REJECTED_BY_SIGNER_EVENT)

		actionsMap := otu.GetProposedActions("treasuryOwner")
		// Action should no longer exist under proposed actions
		assert.Empty(otu.T, actionsMap[transferTokenActionUUID])
	})
}

func TestSignerRevokeApproval(t *testing.T) {
	var transferTokenActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	// Setup with threshold of 1 so that all signers must reject
	// for action to be deleted
	otu.SetupTreasury("treasuryOwner", Signers, 1)
	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)

	// Propose action
	otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount, FLOWPublicReceiverPathId, FlowTokenVaultID)

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
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)

		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run("Signers should be able to sign to reject their approval of a proposed action", func(t *testing.T) {

		// All but one signer rejects approval so we dont delete the action
		for i, signer := range Signers {
			if i == len(Signers)-1 {
				continue
			}
			otu.SignerRejectApproval("treasuryOwner", transferTokenActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", transferTokenActionUUID)
		for i, signer := range Signers {
			if i == len(Signers)-1 {
				continue
			}
			assert.Equal(otu.T, "rejected", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run("If inverse threshold of rejections is reached, action should be deleted", func(t *testing.T) {
		// Last signer rejects approval
		otu.SignerRejectApproval("treasuryOwner", transferTokenActionUUID, Signers[len(Signers)-1])
		actionsMap := otu.GetProposedActions("treasuryOwner")
		// Action should no longer exist under proposed actions
		assert.Empty(otu.T, actionsMap[transferTokenActionUUID])
	})
}

func TestAddSignerUpdateThresholdAction(t *testing.T) {
	var addSignerActionUUID uint64

	var signers = []string{"treasuryOwner", "signer1", "signer2", "signer3"}

	otu := NewOverflowTest(t)
	originalThreshold := len(signers)
	newThreshold := uint(len(signers) + 1)
	otu.SetupTreasury("treasuryOwner", signers, originalThreshold)

	t.Run("User should be able to propose a signer to be added", func(t *testing.T) {
		otu.ProposeAddSignerUpdateThresholdAction("treasuryOwner", "treasuryOwner", "signer4", newThreshold)
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
		for _, signer := range signers {
			otu.ExecuteActionFailed("treasuryOwner", addSignerActionUUID, "This action has not received a signature from every signer yet.")
			otu.SignerApproveAction("treasuryOwner", addSignerActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", addSignerActionUUID)
		for _, signer := range signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A treasuryOwner should be able to execute a proposed action to add a signer to Treasury once it has received the required threshold of signatures`, func(t *testing.T) {

		txResult := otu.ExecuteAction("treasuryOwner", addSignerActionUUID)

		// Assert Event is emitted with correct params
		otu.AssertActionExecutedEventsMatch(txResult, ADD_SIGNER_UPDATE_THRESHOLD_EXECUTE_ACTION_EVENT)

		signers := otu.GetTreasurySigners("treasuryOwner").String()
		threshold := otu.GetTreasuryThreshold("treasuryOwner")

		assert.Contains(otu.T, signers, otu.GetAccountAddress("signer4"))
		assert.Equal(otu.T, newThreshold, uint(threshold))
	})
}

func TestAddSignerUpdateThresholdFailures(t *testing.T) {
	var addSignerActionUUID uint64

	var signers = []string{"treasuryOwner", "signer1", "signer2", "signer3"}

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", signers, len(signers))

	t.Run("User shouldn't be able to add a same signer twice", func(t *testing.T) {
		otu.ProposeAddSignerUpdateThresholdAction("treasuryOwner", "treasuryOwner", "signer3", uint(len(signers)))
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		addSignerActionUUID = keys[0]

		// Each signer submits an approval signature
		for _, signer := range signers {
			otu.SignerApproveAction("treasuryOwner", addSignerActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", addSignerActionUUID)
		for _, signer := range signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}

		otu.ExecuteActionFailed("treasuryOwner", addSignerActionUUID, "Cannot add an already existing signer.")
	})
}

func TestRemoveSignerUpdateThresholdAction(t *testing.T) {
	var removeSignerActionUUID uint64

	otu := NewOverflowTest(t)
	originalThreshold := len(Signers)
	newThreshold := uint(len(Signers) - 1)
	otu.SetupTreasury("treasuryOwner", Signers, originalThreshold)

	t.Run("User should be able to propose a signer to be removed", func(t *testing.T) {
		otu.ProposeRemoveSignerUpdateThresholdAction("treasuryOwner", "treasuryOwner", "signer4", newThreshold)
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
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", removeSignerActionUUID)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A treasuryOwner should be able to execute a proposed action to remove a signer once it has received the required threshold of signatures`, func(t *testing.T) {

		txResult := otu.ExecuteAction("treasuryOwner", removeSignerActionUUID)

		// Assert Event is emitted with correct params
		otu.AssertActionExecutedEventsMatch(txResult, REMOVE_SIGNER_UPDATE_THRESHOLD_EXECUTE_ACTION_EVENT)

		signers := otu.GetTreasurySigners("treasuryOwner").String()
		threshold := otu.GetTreasuryThreshold("treasuryOwner")

		assert.NotContains(otu.T, signers, otu.GetAccountAddress("signer4"))
		assert.Equal(otu.T, newThreshold, uint(threshold))
	})
}

func TestRemoveSignerActionErrors(t *testing.T) {
	var removeSignerActionUUID uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)

	t.Run("User should be able to propose a signer to be removed", func(t *testing.T) {
		otu.ProposeRemoveSignerUpdateThresholdAction("treasuryOwner", "treasuryOwner", "signer4", uint(DefaultThreshold+1))
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
			otu.ExecuteActionFailed("treasuryOwner", removeSignerActionUUID, "This action has not received a signature from every signer yet.")
			otu.SignerApproveAction("treasuryOwner", removeSignerActionUUID, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", removeSignerActionUUID)

		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run("A treasuryOwner shouldn't be able to execute a proposed action to remove a signer because the threshold will be higher than the number of signers", func(t *testing.T) {
		otu.ExecuteActionFailed("treasuryOwner", removeSignerActionUUID, "Cannot update threshold, number of signers must be equal or higher than the threshold.")

		signers := otu.GetTreasurySigners("treasuryOwner").String()

		assert.Contains(otu.T, signers, otu.GetAccountAddress("signer4"))
	})
}

func TestRemoveLastSignerError(t *testing.T) {
	var removeSignerActionUUID uint64

	var signers = []string{"treasuryOwner"}

	otu := NewOverflowTest(t)
	originalThreshold := len(signers)
	otu.SetupTreasury("treasuryOwner", signers, originalThreshold)

	t.Run("User should be able to propose a signer to be removed", func(t *testing.T) {
		otu.ProposeRemoveSignerUpdateThresholdAction("treasuryOwner", "treasuryOwner", "treasuryOwner", uint(originalThreshold-1))
	})

	t.Run("Signer should be able to sign to approve a proposed action to remove themselves as signer", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		removeSignerActionUUID = keys[0]

		// Each signer submits an approval signature
		otu.SignerApproveAction("treasuryOwner", removeSignerActionUUID, "treasuryOwner")

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", removeSignerActionUUID)

		for _, signer := range signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run("A treasuryOwner shouldn't be able to execute a proposed action to remove themselves when they are the last remaining signer", func(t *testing.T) {
		otu.ExecuteActionFailed("treasuryOwner", removeSignerActionUUID, "Threshold must be greater than 0.")

		signers := otu.GetTreasurySigners("treasuryOwner").String()

		assert.Contains(otu.T, signers, otu.GetAccountAddress("treasuryOwner"))
	})

}

func TestUpdateThreshold(t *testing.T) {
	var proposeUpdateThreshold uint64

	otu := NewOverflowTest(t)
	otu.SetupTreasury("treasuryOwner", Signers, 2)

	t.Run("User should be able to propose an update to the threshold", func(t *testing.T) {
		otu.ProposeNewThreshold("treasuryOwner", "treasuryOwner", DefaultThreshold)
	})

	t.Run("Signers should be able to sign to approve a proposed action to update the threshold", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		proposeUpdateThreshold = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", proposeUpdateThreshold, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", proposeUpdateThreshold)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}
	})

	t.Run(`A treasuryOwner should be able to execute a proposed action to update the threshold once it has received the required threshold of signatures`, func(t *testing.T) {

		txResult := otu.ExecuteAction("treasuryOwner", proposeUpdateThreshold)

		// Assert Event is emitted with correct params
		otu.AssertActionExecutedEventsMatch(txResult, UPDATE_THRESHOLD_EXECUTE_ACTION_EVENT)

		updatedThreshold := otu.GetTreasuryThreshold("treasuryOwner")

		assert.Equal(otu.T, updatedThreshold, DefaultThreshold)
	})

	t.Run("User shouldn't be able to propose an update to the threshold which is bigger than the number of signers", func(t *testing.T) {
		otu.ProposeNewThreshold("treasuryOwner", "treasuryOwner", 10)

		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		proposeUpdateThreshold = keys[0]

		// Each signer submits an approval signature
		for _, signer := range Signers {
			otu.SignerApproveAction("treasuryOwner", proposeUpdateThreshold, signer)
		}

		// Assert that the signatures were registered
		signersMap := otu.GetSignerResponsesForAction("treasuryOwner", proposeUpdateThreshold)
		for _, signer := range Signers {
			assert.Equal(otu.T, "approved", signersMap[otu.GetAccountAddress(signer)])
		}

		otu.ExecuteActionFailed("treasuryOwner", proposeUpdateThreshold, "Cannot update threshold, number of signers must be equal or higher than the threshold.")

		threshold := otu.GetTreasuryThreshold("treasuryOwner")

		assert.Equal(otu.T, threshold, DefaultThreshold)
	})
}

func TestTreasuryOwnerExploits(t *testing.T) {
	var transferTokenActionUUID uint64

	otu := NewOverflowTest(t)
	otu.MintFlow("signer1", TransferAmount)
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.SendFlowToTreasury("signer1", "treasuryOwner", TransferAmount)
	otu.CreateNFTCollection("signer1")
	otu.MintNFT("signer1")

	otu.CreateNFTCollection("treasuryOwner")
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")
	otu.SendNFTToTreasury("signer1", "treasuryOwner", 0)

	t.Run("Signers should be able to propose a transfer of fungible tokens out of the Treasury", func(t *testing.T) {
		otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount, FLOWPublicReceiverPathId, FlowTokenVaultID)
	})

	t.Run("Treasury owner should not be able to unilaterally manipulate actions or resources in the Treasury", func(t *testing.T) {
		// Get first ID of proposed action
		actions := otu.GetProposedActions("treasuryOwner")
		keys := make([]uint64, 0, len(actions))
		for k := range actions {
			keys = append(keys, k)
		}
		transferTokenActionUUID = keys[0]

		otu.AttemptDirectManagerAccessExploit("treasuryOwner")
		otu.AttemptBorrowManagerExploit("treasuryOwner")
		otu.AttemptBorrowActionExecuteExploit("treasuryOwner", transferTokenActionUUID)
		otu.AttemptWithdrawNFTExploit("treasuryOwner")
		otu.AttemptWithdrawTokensExploit("treasuryOwner")
	})
}

func TestDestroyCollectionAndVault(t *testing.T) {
	otu := NewOverflowTest(t)

	otu.CreateNFTCollection("signer1")
	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.SendCollectionToTreasury("signer1", "treasuryOwner")

	t.Run("Signer should not be able to remove non-empty vault", func(t *testing.T) {
		otu.SetupFUSD("account")
		otu.MintFUSD("account", TransferAmount)
		otu.SendFUSDToTreasury("account", "treasuryOwner", TransferAmount)
		otu.RemoveVaultFromTreasuryFailure("signer1", "treasuryOwner", FUSDTokenVaultID)
	})
	t.Run("Signer should be able to remove empty vault", func(t *testing.T) {
		otu.RemoveVaultFromTreasury("signer1", "treasuryOwner", "A.0ae53cb6e3f42a79.FlowToken.Vault")
	})
	t.Run("Signer should be able to remove empty collection", func(t *testing.T) {
		otu.RemoveCollectionFromTreasury("signer1", "treasuryOwner", "A.f8d6e0586b0a20c7.ExampleNFT.Collection")
	})
	t.Run("Signer should not be able to remove non-empty collection", func(t *testing.T) {
		otu.CreateNFTCollection("signer1")
		otu.MintNFT("signer1")
		otu.SendCollectionToTreasury("signer1", "treasuryOwner")
		otu.SendNFTToTreasury("signer1", "treasuryOwner", 0)
		otu.RemoveCollectionFromTreasuryFailure("signer1", "treasuryOwner", "A.f8d6e0586b0a20c7.ExampleNFT.Collection")
	})

}

func TestGetProposedActionView(t *testing.T) {
	otu := NewOverflowTest(t)

	otu.SetupTreasury("treasuryOwner", Signers, DefaultThreshold)
	otu.ProposeFungibleTokenTransferAction("treasuryOwner", Signers[0], RecipientAcct, TransferAmount, FLOWPublicReceiverPathId, FlowTokenVaultID)
	actions := otu.GetProposedActions("treasuryOwner")

	keys := make([]uint64, 0, len(actions))
	for k := range actions {
		keys = append(keys, k)
	}
	transferTokenActionUUID := keys[0]

	actionView := otu.GetActionView("treasuryOwner", transferTokenActionUUID)

	assert.Equal(otu.T, otu.GetAccountAddress(Signers[0]), actionView["proposer"])
	assert.Equal(otu.T, otu.GetAccountAddress(RecipientAcct), actionView["recipient"])
	assert.Equal(otu.T, TransferAmount, actionView["tokenAmount"])
	assert.Equal(otu.T, "TransferToken", actionView["type"])
	assert.Equal(otu.T, "A.0ae53cb6e3f42a79.FlowToken.Vault", actionView["vaultId"])
}
