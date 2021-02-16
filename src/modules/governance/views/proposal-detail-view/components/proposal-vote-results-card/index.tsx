import React from 'react';

import Card from 'components/antd/card';
import Button from 'components/antd/button';
import Progress from 'components/antd/progress';
import Grid from 'components/custom/grid';
import { Hint, Paragraph, Small } from 'components/custom/typography';
import ProposalVotersModal from '../proposal-voters-modal';
import { useProposal } from '../../providers/ProposalProvider';

import s from './styles.module.scss';

const ProposalVoteResultsCard: React.FunctionComponent = () => {
  const proposalCtx = useProposal();
  const [votersModal, showVotersModal] = React.useState<boolean>(false);

  return (
    <Card
      className={s.component}
      title={
        <Paragraph type="p1" semiBold color="primary">
          Vote results
        </Paragraph>
      }
      extra={
        <Button type="link" onClick={() => showVotersModal(true)}>
          View voters
        </Button>
      }>
      <Grid flow="row" className={s.row}>
        <Grid flow="col" justify="space-between">
          <Grid flow="row" gap={4}>
            <Small semiBold color="secondary">
              For
            </Small>
            <Grid flow="col" gap={8}>
              <Paragraph type="p1" semiBold color="primary">
                {proposalCtx.proposal?.forVotes.toFormat(2)}
              </Paragraph>
              <Paragraph type="p1" color="secondary">
                ({proposalCtx.forRate?.toFixed(2)}%)
              </Paragraph>
            </Grid>
          </Grid>
          <Grid flow="row" gap={4} align="end">
            <Small semiBold color="secondary" align="right">
              Against
            </Small>
            <Grid flow="col" gap={8}>
              <Paragraph type="p1" semiBold color="primary">
                {proposalCtx.proposal?.againstVotes.toFormat(2)}
              </Paragraph>
              <Paragraph type="p1" color="secondary">
                ({proposalCtx.againstRate?.toFixed()}%)
              </Paragraph>
            </Grid>
          </Grid>
        </Grid>
        <Progress
          percent={proposalCtx.forRate}
          strokeColor="var(--theme-green-color)"
          trailColor="var(--theme-red-color)"
        />
      </Grid>
      <Grid flow="row" className={s.row}>
        <Grid flow="col" justify="space-between">
          <Grid flow="row" gap={4}>
            <Hint
              text="Quorum is the percentage of the amount of tokens staked in the DAO that support for a proposal must be greater than for the proposal to be considered valid. For example, if the Quorum % is set to 20%, then more than 20% of the amount of tokens staked in the DAO must vote to approve a proposal for the vote to be considered valid.">
              <Small semiBold color="secondary">
                Quorum
              </Small>
            </Hint>
            <Grid flow="col" gap={8}>
              <Paragraph type="p1" semiBold color="primary">
                {proposalCtx.quorum?.toFixed(2)}%
              </Paragraph>
              <Paragraph type="p1" color="secondary">
                (&gt; {proposalCtx.proposal?.minQuorum}% required)
              </Paragraph>
            </Grid>
          </Grid>
          <Grid flow="row" gap={4} align="end">
            <Hint
              text="Approval is the percentage of votes on a proposal that the total support must be greater than for the proposal to be approved. For example, if “Approval” is set to 51%, then more than 51% of the votes on a proposal must vote “Yes” for the proposal to pass.">
              <Small semiBold color="secondary" align="right">
                Approval
              </Small>
            </Hint>
            <Grid flow="col" gap={8}>
              <Paragraph type="p1" semiBold color="primary">
                {proposalCtx.forRate?.toFixed(2)}%
              </Paragraph>
              <Paragraph type="p1" color="secondary">
                (&gt; {proposalCtx.proposal?.acceptanceThreshold}% required)
              </Paragraph>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {votersModal && (
        <ProposalVotersModal onCancel={() => showVotersModal(false)} />
      )}
    </Card>
  );
};

export default ProposalVoteResultsCard;
