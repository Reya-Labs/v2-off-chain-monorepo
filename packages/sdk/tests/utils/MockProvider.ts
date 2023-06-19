import { Network, BaseProvider } from '@ethersproject/providers';
import { TransactionRequest, BlockTag } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';

export class MockProvider extends BaseProvider {
  // Network
  public getNetwork(): Promise<Network> {
    return Promise.resolve({
      name: this._network.name,
      chainId: this._network.chainId,
    });
  }

  // Account
  //abstract getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber>;

  call(
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ): Promise<string> {
    return Promise.resolve('');
  }

  estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(1000));
  }

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(1000));
  }
}
