package test_main

import (
	"encoding/json"

	"github.com/bjartek/overflow/overflow"
	"gotest.tools/assert"
)

////////////////////////////
// Action Executed Events //
////////////////////////////

// Transfer Fungible Tokens To Account
var TRANSFER_FUNGIBLE_TOKENS_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 136,
		"actionView": map[string]interface{}{
			"intent":      "Transfer 100.00000000 A.0ae53cb6e3f42a79.FlowToken.Vault tokens from the treasury to 0x01cf0e2f2f715450",
			"proposer":    "0xec4809cd812aee0a",
			"recipient":   "0x01cf0e2f2f715450",
			"timestamp":   "",
			"tokenAmount": 100.0,
			"type":        "TransferToken",
			"vaultId":     "A.0ae53cb6e3f42a79.FlowToken.Vault",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 128,
	},
)

// Transfer Fungible Tokens To Treasury
var TRANSFER_FUNGIBLE_TOKENS_TO_TREASURY_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 141,
		"actionView": map[string]interface{}{
			"intent":      "Transfer 100.00000000 A.0ae53cb6e3f42a79.FlowToken.Vault tokens from the treasury to 0x01cf0e2f2f715450",
			"proposer":    "0xec4809cd812aee0a",
			"timestamp":   "",
			"recipient":   "0x01cf0e2f2f715450",
			"tokenAmount": 100.0,
			"type":        "TransferTokenToTreasury",
			"vaultId":     "A.0ae53cb6e3f42a79.FlowToken.Vault",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 126,
	},
)

// Transfer Non Fungible Tokens To Account
var TRANSFER_NON_FUNGIBLE_TOKENS_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 134,
		"actionView": map[string]interface{}{
			"collectionId": "A.f8d6e0586b0a20c7.ZeedzINO.Collection",
			"intent":       "Transfer A.f8d6e0586b0a20c7.ZeedzINO.Collection NFT from the treasury to 0xf8d6e0586b0a20c7",
			"nftId":        0,
			"proposer":     "0xec4809cd812aee0a",
			"timestamp":    "",
			"recipient":    "0xf8d6e0586b0a20c7",
			"type":         "TransferNFT",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 126,
	},
)

// Transfer Non Fungible Tokens To Treasury
var TRANSFER_NON_FUNGIBLE_TOKENS_TO_TREASURY_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 138,
		"actionView": map[string]interface{}{
			"collectionId": "A.f8d6e0586b0a20c7.ZeedzINO.Collection",
			"intent":       "Transfer an NFT from collection A.f8d6e0586b0a20c7.ZeedzINO.Collection with ID 0 from this Treasury to Treasury at address 0x01cf0e2f2f715450",
			"nftId":        0,
			"proposer":     "0xec4809cd812aee0a",
			"timestamp":    "",
			"recipient":    "0x01cf0e2f2f715450",
			"type":         "TransferNFTToTreasury",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 124,
	},
)

// Update Threshold

var UPDATE_THRESHOLD_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 129,
		"actionView": map[string]interface{}{
			"intent":       "Update the threshold of signers to 5.",
			"newThreshold": 5,
			"proposer":     "0xec4809cd812aee0a",
			"timestamp":    "",
			"type":         "UpdateThreshold",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 124,
	},
)

// Add Signer Update Threshold
var ADD_SIGNER_UPDATE_THRESHOLD_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 129,
		"actionView": map[string]interface{}{
			"intent":       "Add signer 0x1beecc6fef95b62e. Update the threshold of signers to 5.",
			"newThreshold": 5,
			"proposer":     "0xec4809cd812aee0a",
			"timestamp":    "",
			"signerAddr":   "0x1beecc6fef95b62e",
			"type":         "AddSignerUpdateThreshold",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 124,
	},
)

// Remove Signer Update Threshold
var REMOVE_SIGNER_UPDATE_THRESHOLD_EXECUTE_ACTION_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 129,
		"actionView": map[string]interface{}{
			"intent":       "Remove signer 0x1beecc6fef95b62e. Update the threshold of signers to 4.",
			"newThreshold": 4,
			"proposer":     "0xec4809cd812aee0a",
			"timestamp":    "",
			"signerAddr":   "0x1beecc6fef95b62e",
			"type":         "RemoveSignerUpdateThreshold",
		},
		"executor": "0xec4809cd812aee0a",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 124,
	},
)

///////////////////////////////////////////
// Signer Approve/Reject Action Events //
///////////////////////////////////////////

// Signer Approve Action
var ACTION_APPROVED_BY_SIGNER_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 136,
		"address":    "0x1beecc6fef95b62e",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 0,
			"0x179b6b1cb6755e31": 0,
			"0x1beecc6fef95b62e": 0,
			"0xec4809cd812aee0a": 0,
			"0xf4a3472b32eac8d8": 0,
		},
		"treasuryUUID": 128,
	},
)

// Signer Reject Action
var ACTION_REJECTED_BY_SIGNER_EVENT, _ = json.Marshal(
	map[string]interface{}{
		"actionUUID": 132,
		"address":    "0x1beecc6fef95b62e",
		"signerResponses": map[string]interface{}{
			"0x06909bc5ba14c266": 1,
			"0x179b6b1cb6755e31": 1,
			"0x1beecc6fef95b62e": 1,
			"0xec4809cd812aee0a": 1,
			"0xf4a3472b32eac8d8": 1,
		},
		"treasuryUUID": 126,
	},
)

//////////////////////////
// Test Event Functions //
//////////////////////////

func (otu *OverflowTestUtils) AssertActionExecutedEventsMatch(txResult overflow.TransactionResult, expected []byte) {
	txResult.AssertEmitEventName("A.f8d6e0586b0a20c7.DAOTreasuryV5.ActionExecuted")
	event := txResult.Result.GetEventsWithName("A.f8d6e0586b0a20c7.DAOTreasuryV5.ActionExecuted")[0]

	// timestamp is a dynamic field in an ActionView interface, it's very hard to test it
	// Here we are resetting the value to an empty string to match an empty timestamp from expected payloads
	event["actionView"].(map[string]interface{})["timestamp"] = ""

	fieldsJson, _ := json.Marshal(event)
	assert.Equal(otu.T, string(expected), string(fieldsJson))
}

func (otu *OverflowTestUtils) AssertActionApprovedBySignerEvent(txResult overflow.TransactionResult, expected []byte) {
	txResult.AssertEmitEventName("A.f8d6e0586b0a20c7.DAOTreasuryV5.ActionApprovedBySigner")
	event := txResult.Result.GetEventsWithName("A.f8d6e0586b0a20c7.DAOTreasuryV5.ActionApprovedBySigner")[0]
	fieldsJson, _ := json.Marshal(event)
	assert.Equal(otu.T, string(expected), string(fieldsJson))
}

func (otu *OverflowTestUtils) AssertActionRejectedBySignerEvent(txResult overflow.TransactionResult, expected []byte) {
	txResult.AssertEmitEventName("A.f8d6e0586b0a20c7.DAOTreasuryV5.ActionRejectedBySigner")
	event := txResult.Result.GetEventsWithName("A.f8d6e0586b0a20c7.DAOTreasuryV5.ActionRejectedBySigner")[0]
	fieldsJson, _ := json.Marshal(event)
	assert.Equal(otu.T, string(expected), string(fieldsJson))
}
