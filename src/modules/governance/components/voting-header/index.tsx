import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import cn from 'classnames';
import Erc20Contract from 'web3/erc20Contract';
import { formatBigValue, formatToken, formatUSD } from 'web3/utils';

import Button from 'components/antd/button';
import Divider from 'components/antd/divider';
import Skeleton from 'components/antd/skeleton';
import Tooltip from 'components/antd/tooltip';
import { ExternalLink } from 'components/button';
import Grid from 'components/custom/grid';
import { Hint, Text } from 'components/custom/typography';
import { useKnownTokens } from 'components/providers/knownTokensProvider';
import { TokenIcon } from 'components/token-icon';
import { UseLeftTime } from 'hooks/useLeftTime';
import useMergeState from 'hooks/useMergeState';
import { useDAO } from 'modules/governance/components/dao-provider';
import { useWallet } from 'wallets/walletProvider';
import { useTokens } from 'components/providers/tokensProvider';

import VotingDetailedModal from '../voting-detailed-modal';

import { getFormattedDuration, getNowTs, inRange } from 'utils';

import s from './s.module.scss';

type VotingHeaderState = {
  claiming_legacy: boolean;
  claiming: boolean;
  claimingNode: boolean;
  claimingSbBTC: boolean;
  showDetailedView: boolean;
};

const InitialState: VotingHeaderState = {
  claiming_legacy: false,
  claiming: false,
  claimingNode: false,
  claimingSbBTC: false,
  showDetailedView: false,
};

const VotingHeader: React.FC = () => {
  const daoCtx = useDAO();
  const walletCtx = useWallet();
  const { getAmountInUSD } = useTokens();
  const { projectToken } = useKnownTokens();
  const [state, setState] = useMergeState<VotingHeaderState>(InitialState);

  const { toClaim: toClaim_legacy } = daoCtx.daoRewardLegacy;
  const { toClaim } = daoCtx.daoReward;
  const { toClaim: toClaimNode } = daoCtx.nodeReward;
  const { toClaim: toClaimSbBTC } = daoCtx.sbBTCPool;
  const bondBalance = (projectToken.contract as Erc20Contract).balance?.unscaleBy(projectToken.decimals);
  const { votingPower, userLockedUntil, balance: myStakedBalance } = daoCtx.daoBarn;
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    if (walletCtx.account) {
      daoCtx.daoBarn.getMultiplierAtTs(walletCtx.account, getNowTs()).then(value => setMultiplier(value.toNumber()));
    }
  }, [walletCtx.account]);

  const loadedUserLockedUntil = (userLockedUntil ?? Date.now()) - Date.now();

  function handleLeftTimeEnd() {
    // daoCtx.daoBarn.reload(); /// TODO: check
  }

  function handleClaimLegacy() {
    setState({ claiming_legacy: true });

    daoCtx.daoRewardLegacy
      .claim()
      .catch(Error)
      .then(() => {
        // daoCtx.daoReward.reload(); /// TODO: check
        (projectToken.contract as Erc20Contract).loadBalance().catch(Error);
        setState({ claiming_legacy: false });
      });
  }


  function handleClaim() {
    setState({ claiming: true });

    daoCtx.daoReward
      .claim()
      .catch(Error)
      .then(() => {
        // daoCtx.daoReward.reload(); /// TODO: check
        (projectToken.contract as Erc20Contract).loadBalance().catch(Error);
        setState({ claiming: false });
      });
  }

  function handleClaimNode() {
    setState({ claimingNode: true });

    daoCtx.nodeReward
      .claim()
      .catch(Error)
      .then(() => {
        // daoCtx.daoReward.reload(); /// TODO: check
        (projectToken.contract as Erc20Contract).loadBalance().catch(Error);
        setState({ claimingNode: false });
      });
  }

  function handleClaimSbBTC() {
    setState({ claimingSbBTC: true });

    daoCtx.sbBTCPool
      .claim()
      .catch(Error)
      .then(() => {
        // daoCtx.daoReward.reload(); /// TODO: check
        (projectToken.contract as Erc20Contract).loadBalance().catch(Error);
        setState({ claimingSbBTC: false });
      });
  }


  return (
    <div className={cn(s.component, 'pv-24 ph-64 sm-ph-32')}>
      <Text type="lb2" weight="semibold" color="blue" className="mb-16">
        My Account
      </Text>
      <Grid flow="col" gap={16} className={s.items}>
        <Grid flow="row" gap={4}>
          <Text type="p2" color="secondary">
            Staked
          </Text>
          <Grid flow="col" gap={16} align="center">
            <Skeleton loading={myStakedBalance === undefined}>
              <Text type="h3" weight="bold" color="primary">
                {formatToken(myStakedBalance)}
              </Text>
            </Skeleton>
            {/* <TokenIcon name={projectToken.icon} /> */}
          </Grid>
        </Grid>
        <Divider type="vertical" />
        <Grid flow="row" gap={4}>
          <Text type="p2" color="secondary">
            Reward (legacy)
          </Text>
          <Grid flow="col" gap={4} align="center">
            <Tooltip
              title={formatToken(toClaim_legacy ?? 0, {
                compact: true,
                decimals: projectToken.decimals,
              }) + " (" + (formatUSD(getAmountInUSD(toClaim_legacy, projectToken.symbol)) ?? "") + ")"}>
              <Text type="h3" weight="bold" color="primary">
                {formatToken(toClaim_legacy ?? 0, {
                  hasLess: true,
                })}
              </Text>
            </Tooltip>
            {/* <TokenIcon name={projectToken.icon} /> */}
            <Button type="light" disabled={toClaim_legacy?.isZero() || (toClaim_legacy === undefined)} onClick={handleClaimLegacy}>
              {!state.claiming_legacy ? 'Claim' : <Spin spinning />}
            </Button>
          </Grid>
        </Grid>
        <Grid flow="row" gap={4}>
          <Text type="p2" color="secondary">
            Reward
          </Text>
          <Grid flow="col" gap={4} align="center">
            <Tooltip
              title={formatToken(toClaim ?? 0, {
                compact: true,
                decimals: projectToken.decimals,
              }) + " (" + (formatUSD(getAmountInUSD(toClaim, projectToken.symbol)) ?? "") + ")"}>
              <Text type="h3" weight="bold" color="primary">
                {formatToken(toClaim ?? 0, {
                  hasLess: true,
                })}
              </Text>
            </Tooltip>
            <Button type="light" disabled={toClaim?.isZero() || (toClaim === undefined)} onClick={handleClaim}>
              {!state.claiming ? 'Claim' : <Spin spinning />}
            </Button>
          </Grid>
        </Grid>
        <Grid flow="row" gap={4}>
          <Text type="p2" color="secondary">
            Node bonus
          </Text>
          <Grid flow="col" gap={4} align="center" >
            <Tooltip
              title={formatToken(toClaimNode ?? 0, {
                compact: true,
                decimals: projectToken.decimals,
              }) + " (" + (formatUSD(getAmountInUSD(toClaimNode, projectToken.symbol)) ?? "") + ")"}>
              <Text type="h3" weight="bold" color="primary">
                {toClaimNode ? "+" : ""}{formatToken(toClaimNode ?? 0, {
                  hasLess: true,
                })}
              </Text>
            </Tooltip>
            <Button type="light" disabled={toClaim?.isZero() || (toClaimNode === undefined)} onClick={handleClaimNode}>
              {!state.claimingNode ? 'Claim' : <Spin spinning />}
            </Button>
          </Grid>

        </Grid>
        <Divider type="vertical" />
        <Grid flow="row" gap={4}>
          <Text type="p2" color="secondary">
            sbBTC Reward
          </Text>
          <Grid flow="col" gap={4} align="center">
            <Tooltip
              title={toClaimSbBTC?.toNumber() + " (" + (formatUSD(getAmountInUSD(toClaimSbBTC, "WBTC")) ?? "") + ")"}>
              <Text type="h3" weight="bold" color="primary">
                {toClaimSbBTC ? toClaimSbBTC.toNumber() : 0}
              </Text>
            </Tooltip>
            {/* <TokenIcon name={projectToken.icon} /> */}
            <Button type="light" disabled={toClaimSbBTC?.isZero() || (toClaimSbBTC === undefined)} onClick={handleClaimSbBTC}>
              {!state.claimingSbBTC ? 'Claim' : <Spin spinning />}
            </Button>
          </Grid>
        </Grid>
        <Divider type="vertical" />
        <Grid flow="row" gap={4}>
          <Text type="p2" color="secondary">
            Total voting power
          </Text>
          <Grid flow="col" gap={4} align="center">
            <Skeleton loading={votingPower === undefined}>
              <Text type="h3" weight="bold" color="primary">
                {formatToken(votingPower)}
              </Text>
            </Skeleton>
            <Button type="light" onClick={() => setState({ showDetailedView: true })}>
              Detailed view
            </Button>

            {state.showDetailedView && <VotingDetailedModal onCancel={() => setState({ showDetailedView: false })} />}
          </Grid>
        </Grid>

        <UseLeftTime end={userLockedUntil ?? 0} delay={1_000} onEnd={handleLeftTimeEnd}>
          {leftTime => {
            const leftMultiplier = (multiplier - 1) * (leftTime / loadedUserLockedUntil) + 1;

            return leftMultiplier > 1 ? (
              <>
                <Divider type="vertical" />
                <Grid flow="row" gap={4}>
                  <Hint
                    text={
                      <>
                        <Text type="p2">
                          The multiplier mechanic allows users to lock $SWINGBY for a period up to 1 year and get a bonus
                          of up to 2x SWINGBY. The bonus is linear, as per the following example:
                        </Text>
                        <ul>
                          <li>
                            <Text type="p2">lock 1000 $SWINGBY for 1 year → get back 2000 vSWINGBY</Text>
                          </li>
                          <li>
                            <Text type="p2">lock 1000 $SWINGBY for 6 months → get back 1500 vSWINGBY</Text>
                          </li>
                        </ul>
                        <ExternalLink
                          href="https://docs.barnbridge.com/governance/barnbridge-dao/multiplier-and-voting-power"
                          variation="link">
                          Learn more
                        </ExternalLink>
                      </>
                    }>
                    <Text type="p2" color="secondary">
                      Multiplier & Lock timer
                    </Text>
                  </Hint>

                  <Grid flow="col" gap={8} align="center">
                    <Tooltip title={`x${leftMultiplier}`}>
                      <Text type="lb1" weight="bold" color="blue" className={s.ratio}>
                        {inRange(multiplier, 1, 1.01) ? '>' : ''} {formatBigValue(leftMultiplier, 2, '-', 2)}x
                      </Text>
                    </Tooltip>
                    <Text type="p2" color="secondary">
                      for
                    </Text>
                    <Text type="h3" weight="bold" color="primary">
                      {getFormattedDuration(0, userLockedUntil)}
                    </Text>
                  </Grid>
                </Grid>
              </>
            ) : undefined;
          }}
        </UseLeftTime>
      </Grid>
    </div >
  );
};

export default VotingHeader;
