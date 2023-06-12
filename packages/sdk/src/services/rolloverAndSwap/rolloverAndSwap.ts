import { RolloverAndSwapArgs } from "./types";
import { ContractReceipt } from 'ethers';
import { ZERO_BN } from "../../utils/constants";
import { InfoPostSwap } from "../swap";

export async function rolloverAnd(args: RolloverAndSwapArgs) : Promise<ContractReceipt>{
    return Promise.resolve({
        to: "",
        from: "",
        contractAddress: "",
        transactionIndex: 0,
        gasUsed: ZERO_BN,
        logsBloom: "",
        blockHash: "",
        transactionHash: "",
        logs: [],
        blockNumber: 0,
        confirmations: 0,
        cumulativeGasUsed: ZERO_BN,
        effectiveGasPrice: ZERO_BN,
        byzantium: true,
        type: 0
    })
}

export async function simulateRolloverWith(args: RolloverAndSwapArgs) : Promise<InfoPostSwap>{
    return Promise.resolve({
        marginRequirement: 0,
        maxMarginWithdrawable: 0,
        availableNotional: 0,
        fee: 0,
        slippage: 0,
        averageFixedRate: 0,
        fixedTokenDeltaBalance: 0,
        variableTokenDeltaBalance: 0,
        fixedTokenDeltaUnbalanced: 0,
        gasFee: {
            value: 0,
            token: 'ETH'
        }
    })
}