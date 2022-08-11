import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

const NodeRewardABI: AbiItem[] = [
  // call
  createAbiItem('pullFeature', [], ['address', 'uint256', 'uint256', 'uint256']),
  createAbiItem('apr', [], ['uint256']),
  // send
  createAbiItem('claim', [], ['uint256']),
];

class NodeRewardContract extends Web3Contract {
  constructor(address: string) {
    super(NodeRewardABI, address, 'Node Reward');

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      this.toClaim = undefined;
    });
  }

  // apr
  apr?: number;
  // user data
  toClaim?: BigNumber;

  async loadCommonData(): Promise<void> {
    const [apr] = await this.batch([
      { method: 'apr' }]);

    this.apr = Number(apr);
    this.emit(Web3Contract.UPDATE_DATA);
  }

  async loadUserData(): Promise<void> {
    const account = this.account;
    this.assertAccount();

    const [toClaim] = await this.batch([{ method: 'claim', callArgs: { from: account } }]);

    this.toClaim = BigNumber.from(toClaim)?.unscaleBy(18); /// TODO: re-check
    this.emit(Web3Contract.UPDATE_DATA);
  }

  async claim(gasPrice?: number): Promise<void> {
    await this.send('claim', [], {}, gasPrice);
  }
}

export default NodeRewardContract;
