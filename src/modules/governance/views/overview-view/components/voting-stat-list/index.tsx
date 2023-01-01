import React from 'react';
import cn from 'classnames';
import Erc20Contract from 'web3/erc20Contract';
import { formatToken, formatUSD } from 'web3/utils';

import Tooltip from 'components/antd/tooltip';
import { ExternalLink } from 'components/button';
import Grid from 'components/custom/grid';
import { Hint, Text } from 'components/custom/typography';
import { Icon } from 'components/icon';
import { useKnownTokens } from 'components/providers/knownTokensProvider';
import { UseLeftTime } from 'hooks/useLeftTime';
import { APIOverviewData, useDaoAPI } from 'modules/governance/api';
import { useDAO } from 'modules/governance/components/dao-provider';

import { getFormattedDuration } from 'utils';

import s from './s.module.scss';
import { useTokens } from 'components/providers/tokensProvider';

export type VotingStatListProps = {
  className?: string;
};

const VotingStatList: React.FC<VotingStatListProps> = props => {
  const { className } = props;

  const daoAPI = useDaoAPI();
  const daoCtx = useDAO();
  const { getAmountInUSD } = useTokens();
  const { projectToken } = useKnownTokens();
  const [overview, setOverview] = React.useState<APIOverviewData | undefined>();
  const totalAPR = 20;
  //const totalAPR = (daoCtx.daoReward.apr && daoCtx.nodeReward.apr) ? daoCtx.daoReward.apr + daoCtx.nodeReward.apr : 0;

  React.useEffect(() => {
    daoAPI.fetchOverviewData().then(setOverview);
  }, []);

  return (
    <div className={cn(s.cards, className)}>
      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Text type="p2">
                This number shows the amount of $SWINGBY (and their USD value) currently staked in the DAO.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="blue">
              Total Staked
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Grid flow="col" gap={4} align="end">
              <Text type="h2" weight="bold" color="primary">
                {formatToken(daoCtx.daoBarn.bondStaked)}
              </Text>
              <Text type="p1" color="secondary">
                {projectToken.symbol}
              </Text>
              {/* <Tooltip
                title={
                  <>
                    The BarnBridge Governance contracts are covered by: <br />- Bridge Mutual,{' '}
                    <a
                      href="https://app.bridgemutual.io/user/cover/0xdb9A242cfD588507106919051818e771778202e9"
                      rel="noopener noreferrer"
                      target="_blank">
                      click here
                    </a>{' '}
                    to purchase coverage
                  </>
                }>
                <Icon name="insured" color="green" size={32} />
              </Tooltip> */}
            </Grid>
            <Text type="p1" color="secondary">
              {formatUSD(getAmountInUSD(daoCtx.bondStaked, projectToken.symbol))}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Text type="lb2" weight="semibold" color="blue">
            Staking APR (Node bonus)
          </Text>
          <Grid flow="row" gap={4}>
            <UseLeftTime end={(daoCtx.daoRewardLegacy.pullFeature?.endTs ?? 0) * 1000} delay={5_000}>
              {() => (
                <Text type="h2" weight="bold" color="primary">
                  {/* {formatToken(daoCtx.daoReward.apr)} % ( +{formatToken(daoCtx.nodeReward.apr)} % ) */}
                  {formatToken(5)} % ( +{formatToken(daoCtx.nodeReward.apr)} % )
                </Text>
              )}
            </UseLeftTime>
            <Text type="p1" color="secondary">
              Total APR for Node = {formatToken(totalAPR)}%
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Grid flow="row" gap={8} align="start">
                <Text type="p2">
                  This number shows the amount of vSWINGBY currently minted. This number may differ from the amount of
                  $SWINGBY staked because of the multiplier mechanic
                </Text>
                <ExternalLink
                  href="https://integrations.barnbridge.com/specs/dao-specifications#multiplier-and-voting-power"
                  className="link-blue"
                  style={{ fontWeight: 600 }}>
                  Learn more
                </ExternalLink>
              </Grid>
            }>
            <Text type="lb2" weight="semibold" color="blue">
              vSWINGBY
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Text type="h2" weight="bold" color="primary">
              {formatToken(overview?.totalVbond)}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Grid flow="row" gap={8} align="start">
                <Text type="p2">
                  This counter shows the average amount of time $SWINGBY stakers locked their deposits in order to take
                  advantage of the voting power bonus.
                </Text>
                <ExternalLink
                  href="https://integrations.barnbridge.com/specs/dao-specifications#users-can-lock-bond-for-vbond"
                  className="link-blue"
                  style={{ fontWeight: 600 }}>
                  Learn more
                </ExternalLink>
              </Grid>
            }>
            <Text type="lb2" weight="semibold" color="blue">
              Avg. Lock Time
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Text type="h2" weight="bold" color="primary">
              {overview?.avgLockTimeSeconds ? getFormattedDuration(overview?.avgLockTimeSeconds) : '-'}
            </Text>
            <Text type="p1" color="secondary">
              average time
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Grid flow="row" gap={8} align="start">
                <Text type="p2">This number shows the amount of vSWINGBY that is delegated to other addresses.</Text>
                <ExternalLink
                  href="https://integrations.barnbridge.com/specs/dao-specifications#users-can-delegate-vbond-to-other-users"
                  className="link-blue"
                  style={{ fontWeight: 600 }}>
                  Learn more
                </ExternalLink>
              </Grid>
            }>
            <Text type="lb2" weight="semibold" color="blue">
              Delegated
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Text type="h2" weight="bold" color="primary">
              {formatToken(overview?.totalDelegatedPower)}
            </Text>
            <Text type="p1" color="secondary">
              out of{' '}
              {formatToken(overview?.totalVbond)}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          {/* <Hint
            text={
              <Text type="p2">
                This card shows the number of holders of $SWINGBY and compares it to the number of stakers and voters in
                the DAO.
              </Text>
            }>

          </Hint> */}
          <Text type="lb2" weight="semibold" color="blue">
            Info
          </Text>
          <Grid flow="row" gap={4}>
            <Grid flow="col" gap={4} align="end">
              <Text type="h2" weight="bold" color="primary">
                {overview?.barnUsers}
              </Text>
              <Text type="p1" color="secondary">
                stakers
              </Text>
              <Text type="h2" weight="bold" color="primary">
                {overview?.voters}
              </Text>
              <Text type="p1" color="secondary">
                voters
              </Text>
            </Grid>
            <Text type="p1" color="secondary">
              Quorum = {daoCtx.daoGovernance.minQuorum}%
            </Text>
            <Text type="p1" color="secondary">
              Acceptance = {daoCtx.daoGovernance.acceptanceThreshold}%
            </Text>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default VotingStatList;
