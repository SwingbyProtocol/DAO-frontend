import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

const sbBTCPoolABI: AbiItem[] = [
  // call
  createAbiItem('pullFeature', [], ['address', 'uint256', 'uint256', 'uint256']),
  // send
  createAbiItem('claim', [], ['uint256']),

  createAbiItem('userMultiplier', ['address'], ['uint256'])
];

class sbBTCPoolContract extends Web3Contract {
  constructor(address: string) {
    super(sbBTCPoolABI, address, 'sbBTC Pool');

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      this.toClaim = undefined;
    });
  }

  // common data
  pullFeature?: {
    source: string;
    startTs: number;
    endTs: number;
    totalDuration: number;
    totalAmount: BigNumber;
  };
  // apr
  apr?: number;
  // user data
  toClaim?: BigNumber;
  // user multipler
  multiP?: BigNumber;

  // computed data
  get bondRewards(): BigNumber | undefined {
    if (!this.pullFeature) {
      return undefined;
    }

    const { startTs, endTs, totalDuration } = this.pullFeature;
    const now = Date.now() / 1_000;

    if (startTs > now) {
      return BigNumber.ZERO;
    }

    if (endTs <= now) {
      return BigNumber.ZERO;
    }

    return BigNumber.ZERO
  }

  // async loadCommonData(): Promise<void> {
  //   const [pullFeature, apr] = await this.batch([
  //     { method: 'pullFeature' },
  //     { method: 'apr' }]);

  //   this.pullFeature = {
  //     source: pullFeature[0],
  //     startTs: Number(pullFeature[1]),
  //     endTs: Number(pullFeature[2]),
  //     totalDuration: Number(pullFeature[3]),
  //     totalAmount: new BigNumber(pullFeature[4]).unscaleBy(18)!, /// TODO: re-check
  //   };
  //   this.apr = Number(apr);
  //   this.emit(Web3Contract.UPDATE_DATA);
  // }

  async loadUserData(): Promise<void> {
    const account = this.account;
    this.assertAccount();

    const [toClaim, multiPlier] = await this.batch([
      { method: 'claim', callArgs: { from: account } },
      { method: 'userMultiplier', methodArgs: [account], callArgs: { from: account } }
    ]);
    this.multiP = BigNumber.from(multiPlier)
    this.toClaim = BigNumber.from(toClaim)?.unscaleBy(8); /// TODO: re-check
    //console.log(this.multiP?.isZero())
    //if (this.multiP?.isZero() === true) {
    // this.toClaim = new BigNumber(0)
    // }
    this.emit(Web3Contract.UPDATE_DATA);
  }

  async claim(gasPrice?: number): Promise<void> {
    await this.send('claim', [], {}, gasPrice);
  }
}

export default sbBTCPoolContract;
