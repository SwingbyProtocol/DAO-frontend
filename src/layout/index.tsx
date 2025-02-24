import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';

import ErrorBoundary from 'components/custom/error-boundary';
import { useConfig } from 'components/providers/configProvider';
import { useNetwork } from 'components/providers/networkProvider';
import WarningProvider from 'components/providers/warning-provider';
import LayoutFooter from 'layout/components/layout-footer';
import LayoutHeader from 'layout/components/layout-header';
import LayoutSideNav from 'layout/components/layout-side-nav';
import s from './s.module.scss';

const GovernanceView = lazy(() => import('modules/governance'));

const LayoutView: React.FC = () => {
  const { activeNetwork } = useNetwork();
  const { features } = useConfig();

  return (
    <div className={s.layout}>
      <LayoutSideNav/>
      <div className="flex flow-row flex-grow">
        <WarningProvider>
          <LayoutHeader />
          <main className={s.main}>
            <ErrorBoundary>
              <Suspense fallback={<AntdSpin className="pv-24 ph-64" />}>
                <Switch>
                  {features.dao && <Route path="/governance/:vt(\w+)" component={GovernanceView} />}
                  {features.dao && <Route path="/governance" component={GovernanceView} />}
                  <Redirect from="/" to="/governance" />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </main>
          <LayoutFooter />
        </WarningProvider>
      </div>
    </div>
  );
};

export default LayoutView;
