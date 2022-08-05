package main

import (
	"github.com/DapperCollectives/VESSEL/go/util"
	"github.com/bjartek/overflow/overflow"
)

type OverflowUtils struct {
	overflowState *overflow.OverflowState
}

func main() {
	util.DeployFiatToken("treasuryOwner", "USDC", "0.1.0", DeployOverflow().overflowState)
}

func DeployOverflow() *OverflowUtils {
	return &OverflowUtils{overflowState: overflow.NewOverflowEmulator().Start()}
}
