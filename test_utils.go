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
	O *overflow.Overflow
}

const ServiceAddress = "0xf8d6e0586b0a20c7"

func NewOverflowTest(t *testing.T) *OverflowTestUtils {
	return &OverflowTestUtils{T: t, O: overflow.NewTestingEmulator().Start()}
	// return &OverflowTestUtils{T: t, O: overflow.NewOverflowEmulator().Start()}
}

func (otu *OverflowTestUtils) SetupTreasury(name string, signers []string, threshold uint64) *OverflowTestUtils {
	addresses := make([]string, len(signers))

	for i := 0; i < len(signers); i++ {
		addresses[i] = otu.GetAccountAddress(signers[i])
	}

	otu.O.TransactionFromFile("create_treasury").
		SignProposeAndPayAs(name).
		Args(otu.O.Arguments().
			RawAddressArray(
				addresses...).
			UInt64(threshold)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) SetupTreasuryFail(name string, signers []string, threshold uint64, msg string) *OverflowTestUtils {
	addresses := make([]string, len(signers))

	for i := 0; i < len(signers); i++ {
		addresses[i] = otu.GetAccountAddress(signers[i])
	}

	otu.O.TransactionFromFile("create_treasury").
		SignProposeAndPayAs(name).
		Args(otu.O.Arguments().
			RawAddressArray(
				addresses...).
			UInt64(threshold)).
		Test(otu.T).
		AssertFailure(msg)

	return otu
}

func (otu *OverflowTestUtils) ProposeNewThreshold(proposingAcct string, newThreshold uint64) *OverflowTestUtils {
	otu.O.TransactionFromFile("update_threshold").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().UInt64(newThreshold)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeNewThresholdFail(proposingAcct string, newThreshold uint64, msg string) *OverflowTestUtils {
	otu.O.TransactionFromFile("update_threshold").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().UInt64(newThreshold)).
		Test(otu.T).
		AssertFailure(msg)

	return otu
}

func (otu *OverflowTestUtils) SendFlowToTreasury(from string, to string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("send_flow_to_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to).
			UFix64(amount)).
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
	otu.O.TransactionFromFile("send_collection_to_treasury").
		SignProposeAndPayAs(from).
		Args(otu.O.Arguments().
			Account(to)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeFungibleTokenTransferAction(treasuryAcct string, proposingAcct, recipientAcct string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("propose_fungible_token_transfer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			UFix64(amount)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeFungibleTokenTransferToTreasuryAction(treasuryAcct string, proposingAcct, recipientAcct string, vaultIdentifier string, amount float64) *OverflowTestUtils {
	otu.O.TransactionFromFile("propose_fungible_token_transfer_to_treasury").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			String(vaultIdentifier).
			UFix64(amount)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeNonFungibleTokenTransferAction(treasuryAcct string, proposingAcct, recipientAcct string, id uint64) *OverflowTestUtils {
	otu.O.TransactionFromFile("propose_non_fungible_token_transfer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			UInt64(id)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeNonFungibleTokenTransferToTreasuryAction(treasuryAcct string, proposingAcct, recipientAcct string, collectionIdentifier string, id uint64) *OverflowTestUtils {
	otu.O.TransactionFromFile("propose_non_fungible_token_transfer_to_treasury").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			Account(recipientAcct).
			String(collectionIdentifier).
			UInt64(id)).
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

func (otu *OverflowTestUtils) GetTreasurySigners(account string) cadence.Value {
	signers := otu.O.ScriptFromFile("get_treasury_signers").
		Args(otu.O.Arguments().Account(account)).
		RunFailOnError()

	return signers
}

func (otu *OverflowTestUtils) GetTreasuryThreshold(account string) uint64 {
	threshold := otu.O.ScriptFromFile("get_treasury_threshold").
		Args(otu.O.Arguments().Account(account)).
		RunFailOnError()

	return threshold.ToGoValue().(uint64)
}

func (otu *OverflowTestUtils) ProposeAddSignerAction(proposingAcct, address string) *OverflowTestUtils {
	otu.O.TransactionFromFile("add_signer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().Address(address)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ProposeRemoveSignerAction(proposingAcct, address string) *OverflowTestUtils {
	otu.O.TransactionFromFile("remove_signer").
		SignProposeAndPayAs(proposingAcct).
		Args(otu.O.Arguments().Address(address)).
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

func (otu *OverflowTestUtils) SignerRevokeApproval(treasuryAcct string, actionUUID uint64, signingAccount string) *OverflowTestUtils {
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

	otu.O.TransactionFromFile("signer_revoke").
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

func (otu *OverflowTestUtils) GetVerifiedSignersForAction(treasuryAcct string, actionUUID uint64) map[string]bool {
	verifiedSigners := otu.O.ScriptFromFile("get_verified_signers_for_action").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID)).
		RunReturnsJsonString()

	var _signers map[string]string
	var signers map[string]bool = map[string]bool{}
	json.Unmarshal([]byte(verifiedSigners), &_signers)

	for k, v := range _signers {
		signers[k] = (v == "true")
	}

	return signers
}

func (otu *OverflowTestUtils) GetTotalVerifiedForAction(treasuryAcct string, actionUUID uint64) uint64 {
	totalVerified, _ := otu.O.ScriptFromFile("get_total_verified_for_action").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID)).
		RunReturns()

	return totalVerified.ToGoValue().(uint64)
}

func (otu *OverflowTestUtils) ExecuteAction(treasuryAcct string, actionUUID uint64) *OverflowTestUtils {
	otu.O.TransactionFromFile("execute_action").
		SignProposeAndPayAs("signer1").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID)).
		Test(otu.T).
		AssertSuccess()

	return otu
}

func (otu *OverflowTestUtils) ExecuteActionFail(treasuryAcct string, actionUUID uint64, msg string) *OverflowTestUtils {
	otu.O.TransactionFromFile("execute_action").
		SignProposeAndPayAs("signer1").
		Args(otu.O.Arguments().
			Account(treasuryAcct).
			UInt64(actionUUID)).
		Test(otu.T).
		AssertFailure(msg)

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

func (otu *OverflowTestUtils) GetAccountAddress(name string) string {
	return fmt.Sprintf("0x%s", otu.O.Account(name).Address().String())
}

func (otu *OverflowTestUtils) GetAccount(name string) *flow.Account {
	rawAddress := otu.O.Account(name).Address()
	account, _ := otu.O.Services.Accounts.Get(rawAddress)

	return account
}
