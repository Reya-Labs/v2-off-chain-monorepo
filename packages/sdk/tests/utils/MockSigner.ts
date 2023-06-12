import { Provider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import {
  TransactionRequest,
  BlockTag,
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider';
import { BigNumber, Bytes, ethers } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';
import { MockProvider } from './MockProvider';

export class MockSigner extends Signer {
  readonly provider?: Provider;

  public output = '';

  ///////////////////
  // Sub-classes MUST implement these

  // Returns the checksum address
  getAddress(): Promise<string> {
    return Promise.resolve('0x');
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  signMessage(message: Bytes | string): Promise<string> {
    return Promise.resolve('0x');
  }

  // Signs a transaction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  signTransaction(
    transaction: Deferrable<TransactionRequest>,
  ): Promise<string> {
    return Promise.resolve('0x');
  }

  // Returns a new instance of the Signer, connected to provider.
  // This MAY throw if changing providers is not supported.
  connect(provider: Provider): Signer {
    return this;
  }

  ///////////////////
  // Sub-classes MUST call super
  constructor() {
    super();
    this.provider = new MockProvider({ chainId: 0, name: 'test' });
  }

  ///////////////////
  // Sub-classes MAY override these

  async getBalance(blockTag?: BlockTag): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(10));
  }

  // Populates "from" if unspecified, and estimates the gas for the transaction
  async estimateGas(
    transaction: Deferrable<TransactionRequest>,
  ): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(10));
  }

  public setFunctionOutputData(output: string) {
    this.output = output;
  }

  // Populates "from" if unspecified, and calls with the transaction
  async call(
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag,
  ): Promise<string> {
    return Promise.resolve(this.output);
  }

  // Populates all fields in a transaction, signs it and sends it to the network
  async sendTransaction(
    transaction: Deferrable<TransactionRequest>,
  ): Promise<TransactionResponse> {
    const receipt: TransactionReceipt = {
      to: '',
      from: '',
      contractAddress: '',
      transactionIndex: 1,
      gasUsed: BigNumber.from(1),
      logsBloom: '',
      blockHash: '',
      transactionHash: '',
      logs: [],
      blockNumber: 0,
      confirmations: 0,
      cumulativeGasUsed: BigNumber.from(1),
      effectiveGasPrice: BigNumber.from(1),
      byzantium: true,
      type: 1,
    };
    return Promise.resolve({
      hash: '',
      nonce: 6,
      gasLimit: BigNumber.from(10),
      data: '',
      chainId: 0,
      value: BigNumber.from(10),
      confirmations: 2,
      from: '',
      wait: (confirmations?: number) => {
        return Promise.resolve(receipt);
      },
    });
  }
}
