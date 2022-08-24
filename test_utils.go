package test_main

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strconv"
	"testing"

	"github.com/bjartek/overflow/overflow"
	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk"
)

type OverflowTestUtils struct {
	T *testing.T
	O *overflow.OverflowState
}

const ServiceAddress = "0xf8d6e0586b0a20c7"

func NewOverflowTest(t *testing.T) *OverflowTestUtils {
	otu := &OverflowTestUtils{T: t, O: overflow.NewTestingEmulator().Start()}
	// otu := &OverflowTestUtils{T: t, O: overflow.NewOverflowEmulator().Start()}
	otu.DeployFiatToken("FiatToken", "USDC", "0.1.0", 1000000000.00000000, false)
	return otu
}

func (otu *OverflowTestUtils) DeployFiatToken(contractName, tokenName, version string, initTotalSupply float64, initPaused bool) {
	otu.O.Tx("deploy_contract_with_auth",
		overflow.SignProposeAndPayAs("account"),
		overflow.Arg("contractName", contractName),
		overflow.Arg("tokenName", tokenName),
		overflow.Arg("version", version),
		overflow.Arg("initTotalSupply", initTotalSupply),
		overflow.Arg("initPaused", initPaused),
	).Print()
}

func (otu *OverflowTestUtils) SetupTreasury(name string, signers []string, threshold int) *OverflowTestUtils {
	addresses := make([]string, len(signers))

	for i := 0; i < len(signers); i++ {
		addresses[i] = otu.GetAccountAddress(signers[i])
	}

	otu.O.TransactionFromFile("create_treasury").
		SignProposeAndPayAs(name).
		Args(otu.O.Arguments().
			RawAddressArray(
				addresses...).
			UInt(uint(threshold))).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SetupTreasuryFail(name string, signers []string, threshold int, msg string) *OverflowTestUtils {
	addresses := make([]string, len(signers))

	for i := 0; i < len(signers); i++ {
		addresses[i] = otu.GetAccountAddress(signers[i])
	}

	otu.O.TransactionFromFile("create_treasury").
		SignProposeAndPayAs(name).
		Args(otu.O.Arguments().
			RawAddressArray(
				addresses...).
			UInt(uint(threshold))).
		Test(otu.T).
		AssertFailure(msg)

	return otu
}

func (otu *OverflowTestUtils) ProposeNewThreshold(treasuryAddr, proposingAcct string, newThreshold int) *OverflowTestUtils {
	src := []byte(fmt.Sprintf("Update the threshold of signers to %d.", newThreshold))
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("update_threshold").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Address(treasuryAddr).
			UInt(uint(newThreshold)).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeNewThresholdFail(proposingAcct string, newThreshold int, msg string) *OverflowTestUtils {
	src := []byte("no action id")
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("update_threshold").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			UInt(uint(newThreshold)).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertFailure(msg)

	return otu
}

func (otu *OverflowTestUtils) SendFlowToTreasury(from string, to string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("send_tokens_to_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to).
			UFix64(amount).
			StoragePath("flowTokenVault")).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SendFUSDToTreasury(from string, to string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("send_tokens_to_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to).
			UFix64(amount).
			StoragePath("fusdVault")).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SendNFTToTreasury(from string, to string, id uint64) *OverflowTestUtils {
	otu.O.TransactionFromFile("send_nft_to_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to).
			UInt64(id)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SendCollectionToTreasury(from string, to string) *OverflowTestUtils {

	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {hexCollectionID}{blockID}
	//////////////////////////////////////////////

	src := []byte("A.f8d6e0586b0a20c7.ZeedsINO.Collection")
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(from, message)

	otu.O.TransactionFromFile("send_collection_to_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) RemoveCollectionFromTreasury(from, treasuryAddr, collectionID string) *OverflowTestUtils {

	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {hexCollectionID}{blockID}
	//////////////////////////////////////////////

	src := []byte(collectionID)
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(from, message)

	otu.O.TransactionFromFile("remove_collection_from_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(treasuryAddr).
			String(collectionID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) RemoveCollectionFromTreasuryFailure(from, treasuryAddr, collectionID string) *OverflowTestUtils {

	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {hexCollectionID}{blockID}
	//////////////////////////////////////////////

	src := []byte(collectionID)
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(from, message)

	otu.O.TransactionFromFile("remove_collection_from_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(treasuryAddr).
			String(collectionID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertFailure("")

	return otu
}

func (otu *OverflowTestUtils) RemoveVaultFromTreasury(from string, treasuryAddr string, vaultID string) *OverflowTestUtils {

	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {hexCollectionID}{blockID}
	//////////////////////////////////////////////

	src := []byte(vaultID)
	hexVaultID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexVaultID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexVaultID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(from, message)

	otu.O.TransactionFromFile("remove_vault_from_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(treasuryAddr).
			String(vaultID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) RemoveVaultFromTreasuryFailure(from string, treasuryAddr string, vaultID string) *OverflowTestUtils {

	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {hexCollectionID}{blockID}
	//////////////////////////////////////////////

	src := []byte(vaultID)
	hexVaultID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexVaultID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexVaultID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(from, message)

	otu.O.TransactionFromFile("remove_vault_from_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(treasuryAddr).
			String(vaultID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertFailure("")

	return otu
}

func (otu *OverflowTestUtils) ProposeFungibleTokenTransferAction(treasuryAcct string, proposingAcct, recipientAcct string, amount float64, publicReceiverPathId string, vaultId string) *OverflowTestUtils {
	recipient, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", recipientAcct))
	src := []byte(fmt.Sprintf("Transfer %.8f %s tokens from the treasury to 0x%s", amount, vaultId, recipient.Address()))
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)
	otu.O.TransactionFromFile("propose_fungible_token_transfer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			UFix64(amount).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height).
			PublicPath(publicReceiverPathId)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeFungibleTokenTransferActionFail(treasuryAcct string, proposingAcct, recipientAcct string, amount float64, publicReceiverPathId string) *OverflowTestUtils {
	PROPOSE_TOKEN_TRANSFER_ERROR := "Amount should be higher than 0.0"

	src := []byte("no action id")
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("propose_fungible_token_transfer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			UFix64(amount).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height).
			PublicPath(publicReceiverPathId)).
		Test(otu.T).
		AssertFailure(PROPOSE_TOKEN_TRANSFER_ERROR)

	return otu
}

func (otu *OverflowTestUtils) ProposeFungibleTokenTransferToTreasuryAction(treasuryAcct string, proposingAcct, recipientAcct string, vaultIdentifier string, amount float64) *OverflowTestUtils {

	recipient, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", recipientAcct))
	src := []byte(fmt.Sprintf("Transfer %.8f %s tokens from the treasury to 0x%s", amount, vaultIdentifier, recipient.Address()))

	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("propose_fungible_token_transfer_to_treasury").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			String(vaultIdentifier).
			UFix64(amount).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeFungibleTokenTransferToTreasuryActionFail(treasuryAcct string, proposingAcct, recipientAcct string, vaultIdentifier string, amount float64) *OverflowTestUtils {
	PROPOSE_TOKEN_TRANSFER_ERROR := "Amount should be higher than 0.0"

	src := []byte("no action id")
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("propose_fungible_token_transfer_to_treasury").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			String(vaultIdentifier).
			UFix64(amount).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertFailure(PROPOSE_TOKEN_TRANSFER_ERROR)

	return otu
}

func (otu *OverflowTestUtils) ProposeNonFungibleTokenTransferAction(treasuryAcct string, proposingAcct, recipientAcct string, id uint64) *OverflowTestUtils {
	recipient, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", recipientAcct))
	src := []byte(fmt.Sprintf("Transfer A.f8d6e0586b0a20c7.ZeedsINO.Collection NFT from the treasury to 0x%s", recipient.Address()))
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("propose_non_fungible_token_transfer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			UInt64(id).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeNonFungibleTokenTransferToTreasuryAction(treasuryAcct string, proposingAcct, recipientAcct string, collectionIdentifier string, id uint64) *OverflowTestUtils {

	recipient, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", recipientAcct))
	src := []byte(fmt.Sprintf("Transfer an NFT from collection %s with ID %s from this Treasury to Treasury at address 0x%s", collectionIdentifier, fmt.Sprint(id), recipient.Address()))

	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("propose_non_fungible_token_transfer_to_treasury").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			String(collectionIdentifier).
			UInt64(id).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) GetProposedActions(treasuryAcct string) map[uint64]string {
	proposedActions := otu.O.ScriptFromFile("get_proposed_actions").
		Args(otu.O.Arguments().
			Account(treasuryAcct)).
		RunFailOnError()

	actions := proposedActions.ToGoValue()
	actionsMap := make(map[uint64]string)
	for k, v := range actions.(map[interface{}]interface{}) {
		actionsMap[k.(uint64)] = v.(string)
	}

	return actionsMap
}

func GenerateSigners(num int) []string {
	Signers := make([]string, num)
	for i := 0; i < num; i++ {
		Signers[i] = fmt.Sprintf("%s%d", "signer", i+1)
	}
	return Signers
}

func (otu *OverflowTestUtils) GetTreasurySigners(account string) cadence.Value {
	signers := otu.O.ScriptFromFile("get_treasury_signers").
		Args(otu.O.Arguments().Account(account)).
		RunFailOnError()

	return signers
}

func (otu *OverflowTestUtils) GetTreasuryThreshold(account string) int {
	threshold := otu.O.ScriptFromFile("get_treasury_threshold").
		Args(otu.O.Arguments().Account(account)).
		RunFailOnError()

	// returning uint64 and casting to int
	// because of bug in Overflow
	return int(threshold.ToGoValue().(uint64))
}

func (otu *OverflowTestUtils) ProposeAddSignerAction(treasuryAddr, proposingAcct, address string) *OverflowTestUtils {
	signerAccount, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", address))
	src := []byte(fmt.Sprintf("Add account 0x%s as a signer.", signerAccount.Address()))
	signerHex := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(signerHex, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", signerHex, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("add_signer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Address(treasuryAddr).
			Address(address).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeRemoveSignerAction(treasuryAddr, proposingAcct, address string) *OverflowTestUtils {
	signerAccount, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", address))
	src := []byte(fmt.Sprintf("Remove 0x%s as a signer.", signerAccount.Address()))
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(proposingAcct, message)

	otu.O.TransactionFromFile("remove_signer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Address(treasuryAddr).
			Address(address).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SignerApproveAction(treasuryAcct string, actionUUID uint64, signingAccount string) *OverflowTestUtils {
	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {actionUUID}{hexEncodedIntent}{blockID}
	//////////////////////////////////////////////

	// actionUUID
	uuid := strconv.FormatUint(actionUUID, 10)

	// hex-encoded intent
	actions := otu.GetProposedActions(treasuryAcct)
	intent := actions[uint64(actionUUID)]
	src := []byte(intent)
	hexIntent := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexIntent, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()

	// message
	// {uuid}{hexIntent}{block.ID}
	message := fmt.Sprintf("%s%s%s", uuid, hexIntent, latestBlock.ID)

	// signature
	signature := otu.SignMessage(signingAccount, message)

	///////////////////
	// Run Transaction
	///////////////////

	otu.O.TransactionFromFile("signer_approve").
		SignProposeAndPayAs(signingAccount).
		Args(otu.O.Arguments().
			Account(treasuryAcct).       // treasuryAddr
			UInt64(uint64(actionUUID)).  // actionUUID
			String(message).             // message
			UInt64Array(0).              // [keyIds]
			StringArray(signature).      // [signatures]
			UInt64(latestBlock.Height)). // signatureBlock
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SignerRejectApproval(treasuryAcct string, actionUUID uint64, signingAccount string) *OverflowTestUtils {
	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {actionUUID}{hexEncodedIntent}{blockID}
	//////////////////////////////////////////////

	// actionUUID
	uuid := strconv.FormatUint(actionUUID, 10)

	// hex-encoded intent
	actions := otu.GetProposedActions("treasuryOwner")
	intent := actions[uint64(actionUUID)]
	src := []byte(intent)
	hexIntent := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexIntent, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()

	// message
	// {uuid}{hexIntent}{block.ID}
	message := fmt.Sprintf("%s%s%s", uuid, hexIntent, latestBlock.ID)

	// signature
	signature := otu.SignMessage(signingAccount, message)

	///////////////////
	// Run Transaction
	///////////////////

	otu.O.TransactionFromFile("signer_reject").
		SignProposeAndPayAs(signingAccount).
		Args(otu.O.Arguments().
			Account(treasuryAcct).       // treasuryAddr
			UInt64(uint64(actionUUID)).  // actionUUID
			String(message).             // message
			UInt64Array(0).              // [keyIds]
			StringArray(signature).      // [signatures]
			UInt64(latestBlock.Height)). // signatureBlock
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SignerRejectApprovalFailed(treasuryAcct string, actionUUID uint64, signingAccount, msg string) *OverflowTestUtils {
	//////////////////////////////////////////////
	// Generate message/signature for signer
	// msg {actionUUID}{hexEncodedIntent}{blockID}
	//////////////////////////////////////////////

	// actionUUID
	uuid := strconv.FormatUint(actionUUID, 10)

	// hex-encoded intent
	actions := otu.GetProposedActions("treasuryOwner")
	intent := actions[uint64(actionUUID)]
	src := []byte(intent)
	hexIntent := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexIntent, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()

	// message
	// {uuid}{hexIntent}{block.ID}
	message := fmt.Sprintf("%s%s%s", uuid, hexIntent, latestBlock.ID)
	// signature
	signature := otu.SignMessage(signingAccount, message)

	///////////////////
	// Run Transaction
	///////////////////

	otu.O.TransactionFromFile("signer_reject").
		SignProposeAndPayAs(signingAccount).
		Args(otu.O.Arguments().
			Account(treasuryAcct).       // treasuryAddr
			UInt64(uint64(actionUUID)).  // actionUUID
			String(message).             // message
			UInt64Array(0).              // [keyIds]
			StringArray(signature).      // [signatures]
			UInt64(latestBlock.Height)). // signatureBlock
		Test(otu.T).
		AssertFailure(msg)

	return otu
}

func (otu *OverflowTestUtils) GetSignerResponsesForAction(treasuryAcct string, actionUUID uint64) map[string]string {
	signerResponses := otu.O.ScriptFromFile("get_signer_responses_for_action").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID)).
		RunReturnsJsonString()

	var responses map[string]string
	json.Unmarshal([]byte(signerResponses), &responses)

	return responses
}

func (otu *OverflowTestUtils) ExecuteAction(treasuryAcct string, actionUUID uint64) *OverflowTestUtils {
	src := []byte(fmt.Sprint(actionUUID))
	hexID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(treasuryAcct, message)

	otu.O.TransactionFromFile("execute_action").
		SignProposeAndPayAs(treasuryAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ExecuteActionFailed(treasuryAcct string, actionUUID uint64, msg string) *OverflowTestUtils {
	src := []byte(fmt.Sprint(actionUUID))
	hexID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(treasuryAcct, message)

	otu.O.TransactionFromFile("execute_action").
		SignProposeAndPayAs(treasuryAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertFailure(msg)

	return otu
}

func (otu *OverflowTestUtils) ProposeDestroyAction(treasuryAcct string, actionUUID uint64) *OverflowTestUtils {
	src := []byte(fmt.Sprintf("Remove the action %d from the Treasury.", actionUUID))
	hexCollectionID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexCollectionID, src)

	// block.ID & block.Height
	latestBlock, _ := otu.O.GetLatestBlock()
	// message
	message := fmt.Sprintf("%s%s", hexCollectionID, latestBlock.ID)
	// signature
	signature := otu.SignMessage(treasuryAcct, message)

	otu.O.TransactionFromFile("destroy_action").
		SignProposeAndPayAs(treasuryAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) GetTreasuryIdentifiers(treasuryAcct string) [][]string {
	val := otu.O.ScriptFromFile("get_treasury_identifiers").
		Args(otu.O.Arguments().Account(treasuryAcct)).
		RunReturnsJsonString()

	var ids [][]string
	json.Unmarshal([]byte(val), &ids)

	return ids
}

func (otu *OverflowTestUtils) GetTreasuryVaultBalance(treasuryAcct string, vaultId string) uint64 {
	val, _ := otu.O.ScriptFromFile("get_vault_balance").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			String(vaultId)).
		RunReturns()

	return val.ToGoValue().(uint64)
}

func (otu *OverflowTestUtils) GetTreasuryCollection(treasuryAcct string, collectionType string) []uint64 {
	val := otu.O.ScriptFromFile("get_treasury_collection").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			String(collectionType)).
		RunReturnsJsonString()

	var ownedNFTIds []uint64
	json.Unmarshal([]byte(val), &ownedNFTIds)

	return ownedNFTIds
}

// TODO: add to overflow
func (otu *OverflowTestUtils) SignMessage(account string, message string) string {
	flowAccount, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", account))
	ctx := context.Background()
	signer, _ := flowAccount.Key().Signer(ctx)
	byteMessage := []byte(message)
	signature, _ := flow.SignUserMessage(signer, byteMessage)
	sigString := hex.EncodeToString(signature)

	return sigString
}

func (otu *OverflowTestUtils) MintFlow(account string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("mint_flow").
		SignProposeAndPayAsService().
		Args(otu.O.Arguments().
			Account(account).
			UFix64(amount)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) CreateNFTCollection(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("create_collection").
		SignProposeAndPayAs(account).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) MintNFT(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("mint_nft").
		SignProposeAndPayAsService().
		Args(otu.O.Arguments().
			Account(account).
			String("name").
			String("description").
			String("thumbnail")).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) AttemptDirectManagerAccessExploit(account string) *OverflowTestUtils {

	var MULTI_SIGN_MANAGER_ERROR_MSG = "cannot access `multiSignManager`: field has contract access"
	otu.O.TransactionFromFile("attempt_direct_manager_access").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments()).
		Test(otu.T).
		AssertFailure(MULTI_SIGN_MANAGER_ERROR_MSG)

	return otu
}

func (otu *OverflowTestUtils) AttemptBorrowManagerExploit(account string) *OverflowTestUtils {
	var BORROW_MANAGER_ERROR_MSG = "cannot access `borrowManager`: function has account access"
	otu.O.TransactionFromFile("attempt_borrow_manager_exploit").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments()).
		Test(otu.T).
		AssertFailure(BORROW_MANAGER_ERROR_MSG)

	return otu
}

func (otu *OverflowTestUtils) AttemptWithdrawNFTExploit(account string) *OverflowTestUtils {
	var WITHDRAW_NFT_ERROR_MSG = "cannot access `withdrawNFT`: function has account access"
	otu.O.TransactionFromFile("attempt_withdraw_NFT_exploit").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments()).
		Test(otu.T).
		AssertFailure(WITHDRAW_NFT_ERROR_MSG)

	return otu
}

func (otu *OverflowTestUtils) AttemptWithdrawTokensExploit(account string) *OverflowTestUtils {
	var WITHDRAW_TOKENS_ERROR_MSG = "cannot access `withdrawTokens`: function has account access"
	otu.O.TransactionFromFile("attempt_withdraw_tokens_exploit").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments()).
		Test(otu.T).
		AssertFailure(WITHDRAW_TOKENS_ERROR_MSG)

	return otu
}

func (otu *OverflowTestUtils) AttemptBorrowActionExecuteExploit(account string, actionUUID uint64) *OverflowTestUtils {
	var ERROR_MSG = "cannot access `action`: field has contract access"
	otu.O.TransactionFromFile("attempt_borrow_action_execute_exploit").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments().
			UInt64(actionUUID)).
		Test(otu.T).
		AssertFailure(ERROR_MSG)

	return otu
}

func (otu *OverflowTestUtils) GetAccountAddress(name string) string {
	account, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", name))

	return fmt.Sprintf("0x%s", account.Address().String())
}

func (otu *OverflowTestUtils) GetAccount(name string) *flow.Account {
	account, _ := otu.O.State.Accounts().ByName(fmt.Sprintf("emulator-%s", name))

	flowAccount, _ := otu.O.Services.Accounts.Get(account.Address())

	return flowAccount
}
func (otu *OverflowTestUtils) GetAccountCollection(account string) []uint64 {
	val := otu.O.ScriptFromFile("get_account_collection").
		Args(otu.O.Arguments().
			Account(account)).
		RunReturnsJsonString()

	var ownedNFTIds []uint64
	json.Unmarshal([]byte(val), &ownedNFTIds)

	return ownedNFTIds
}

func (otu *OverflowTestUtils) DestroyTreasuryWithVaultsNotAllowed(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("destroy_treasury").
		SignProposeAndPayAs(account).
		Test(otu.T).
		AssertFailure("Vault is not empty! Treasury cannot be destroyed")
	return otu
}

func (otu *OverflowTestUtils) DestroyTreasuryWithCollectionsNotAllowed(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("destroy_treasury").
		SignProposeAndPayAs(account).
		Test(otu.T).
		AssertFailure("Collection is not empty! Treasury cannot be destroyed")
	return otu
}

func (otu *OverflowTestUtils) DestroyTreasuryShoudBeAllowed(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("destroy_treasury").
		SignProposeAndPayAs(account).
		Test(otu.T).
		AssertSuccess()
	return otu
}
func (otu *OverflowTestUtils) SetupFUSDVault(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("setup_fusd_vault").
		SignProposeAndPayAs(account).
		Test(otu.T).
		AssertSuccess()
	return otu
}
func (otu *OverflowTestUtils) SetupFUSDMinter(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("setup_fusd_minter").
		SignProposeAndPayAs(account).
		Test(otu.T).
		AssertSuccess()
	return otu
}
func (otu *OverflowTestUtils) DepositFUSDMinter(account string) *OverflowTestUtils {
	otu.O.TransactionFromFile("deposit_fusd_minter").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments().
			Address(account)).
		Test(otu.T).
		AssertSuccess()
	return otu
}
func (otu *OverflowTestUtils) MintFUSD(account string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("mint_fusd").
		SignProposeAndPayAs(account).
		Args(otu.O.Arguments().
			UFix64(amount).
			Address(account)).
		Test(otu.T).
		AssertSuccess()
	return otu
}

func (otu *OverflowTestUtils) SetupFUSD(account string) *OverflowTestUtils {
	otu.SetupFUSDVault(account)
	otu.SetupFUSDMinter(account)
	otu.DepositFUSDMinter(account)
	return otu
}
func (otu *OverflowTestUtils) GetAccountFUSDBalance(account string) uint64 {
	val, _ := otu.O.ScriptFromFile("get_fusd_balance").
		Args(otu.O.Arguments().
			Address(account)).
		RunReturns()

	return val.ToGoValue().(uint64)
}

func (otu *OverflowTestUtils) AddBloctoVaultToTreasury(from string, to string) *OverflowTestUtils {

	src := []byte("A.f8d6e0586b0a20c7.BloctoToken.Vault")
	hexVaultID := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(hexVaultID, src)

	latestBlock, _ := otu.O.GetLatestBlock()
	message := fmt.Sprintf("%s%s", hexVaultID, latestBlock.ID)
	signature := otu.SignMessage(from, message)

	otu.O.TransactionFromFile("add_blocto_vault").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to).
			String(message).
			UInt64Array(0).
			StringArray(signature).
			UInt64(latestBlock.Height)).
		Test(otu.T).
		AssertSuccess()

	return otu
}
