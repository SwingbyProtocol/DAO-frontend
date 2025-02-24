import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

const DaoRewardABI: AbiItem[] = [
  // call
  createAbiItem('apr', [], ['uint256']),
  // send
  createAbiItem('claim', [], ['uint256']),
];

class DaoRewardContract extends Web3Contract {
  constructor(address: string) {
    super(DaoRewardABI, address, 'DAO Reward');

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

    // this.pullFeature = {
    //   source: pullFeature[0],
    //   startTs: Number(pullFeature[1]),
    //   endTs: Number(pullFeature[2]),
    //   totalDuration: Number(pullFeature[3]),
    //   totalAmount: new BigNumber(pullFeature[4]).unscaleBy(18)!, /// TODO: re-check
    // };
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

export default DaoRewardContract;
