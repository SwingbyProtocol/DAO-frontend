import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Tabs from 'components/antd/tabs';
import { ExternalLink } from 'components/button';
import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { TokenIcon } from 'components/token-icon'
import { Text } from 'components/custom/typography';
import DaoAPIProvider from 'modules/governance/api';
import { useWallet } from 'wallets/walletProvider';

import DAOProvider from './components/dao-provider';
import VotingHeader from './components/voting-header';
import OverviewView from './views/overview-view';
import PortfolioView from './views/portfolio-view';
import ProposalCreateView from './views/proposal-create-view';
import ProposalDetailView from './views/proposal-detail-view';
import ProposalsView from './views/proposals-view';
import TreasuryView from './views/treasury-view';

import s from './s.module.scss';

type GovernanceViewParams = {
  vt: string;
};

const GovernanceViewInternal: React.FC = () => {
  const history = useHistory();
  const {
    params: { vt = 'overview' },
  } = useRouteMatch<GovernanceViewParams>();

  const wallet = useWallet();

  const [activeTab, setActiveTab] = React.useState<string>(vt);

  function handleTabChange(tabKey: string) {
    if (tabKey) {
      setActiveTab(tabKey);
      history.push(`/governance/${tabKey}`);
    }
  }

  React.useEffect(() => {
    if (vt !== activeTab) {
      setActiveTab(vt);
    }
  }, [vt]);

  return (
    <Grid flow="row">
      {wallet.account && <VotingHeader />}

      <Tabs className={s.tabs} activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.Tab
          key="overview"
          tab={
            <>
              <Icon name="bar-charts-outlined" /> Overview
            </>
          }
        />
        <Tabs.Tab
          key="portfolio"
          disabled={!wallet.account}
          tab={
            <>
              <Icon name="wallet-outlined" /> Portfolio
            </>
          }
        />
        <Tabs.Tab
          key="proposals"
          tab={
            <>
              <Icon name="proposal-outlined" /> Proposals
            </>
          }
        />
        <Tabs.Tab
          key="treasury"
          tab={
            <>
              <Icon name="treasury-outlined" /> Treasury
            </>
          }
        />
        <Tabs.Tab
          key="signal"
          tab={
            <ExternalLink href="https://snapshot.org/#/swingbydao.eth" style={{ color: 'inherit' }}>
              <Grid flow="col" gap={8} align="center">
                <Icon name="chats-outlined" style={{ paddingTop: "3px" }} /><p style={{ textDecoration: "underline" }}>Signal Vote</p>
              </Grid>
            </ExternalLink>
          }
        />
        <Tabs.Tab
          key="github"
          tab={
            <ExternalLink href="https://github.com/SwingbyProtocol/swips/issues" style={{ color: 'inherit' }}>
              <Grid flow="col" gap={8} align="center">
                <Icon name="forum-outlined" style={{ paddingTop: "3px" }} /><p style={{ textDecoration: "underline" }}>Github Issues</p>
              </Grid>
            </ExternalLink>
          }
        />
        <Tabs.Tab
          key="sushiswap"
          tab={
            <ExternalLink href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x8287c7b963b405b7b8d467db9d79eec40625b13a" style={{ color: 'inherit' }}>
              <Grid flow="col" gap={8} align="center">
                <TokenIcon name="sushi" style={{ paddingTop: "3px" }} /><p style={{ textDecoration: "underline" }}>Sushiswap</p>
              </Grid>
            </ExternalLink>
          }
        />
        <Tabs.Tab
          key="uniswap"
          tab={
            <ExternalLink href="https://app.uniswap.org/#/swap?chain=mainnet&inputCurrency=ETH&outputCurrency=0x8287C7b963b405b7B8D467DB9d79eEC40625b13A" style={{ color: 'inherit' }}>
              <Grid flow="col" gap={8} align="center">
                <TokenIcon name="uni" style={{ paddingTop: "3px" }} /><p style={{ textDecoration: "underline" }}>Uniswap</p>
              </Grid>
            </ExternalLink>
          }
        />
      </Tabs>

      <div className="content-container-fix content-container">
        <Switch>
          <Route path="/governance/overview" exact component={OverviewView} />
          <Redirect exact from="/governance/portfolio" to="/governance/portfolio/deposit" />
          <Route path="/governance/portfolio/:action(\w+)" component={PortfolioView} />
          <Redirect exact from="/governance/treasury" to="/governance/treasury/holdings" />
          <Route path="/governance/treasury/:tab(\w+)" exact component={TreasuryView} />
          <Route path="/governance/proposals/create" exact component={ProposalCreateView} />
          <Route path="/governance/proposals/:id(\d+)" exact component={ProposalDetailView} />
          <Route path="/governance/proposals" exact component={ProposalsView} />
          <Redirect from="/governance" to="/governance/overview" />
        </Switch>
      </div>
    </Grid >
  );
};

const GovernanceView: React.FC = props => {
  return (
    <DaoAPIProvider>
      <DAOProvider>
        <GovernanceViewInternal>{props.children}</GovernanceViewInternal>
      </DAOProvider>
    </DaoAPIProvider>
  );
};

export default GovernanceView;
