import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ExternalLink, Link } from 'components/button';
import OldIcon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { useConfig } from 'components/providers/configProvider';

import s from './s.module.scss';

const LayoutFooter: React.FC = () => {
  const { links } = useConfig();

  return (
    <footer className={s.footer}>
      <div className={s.footerTop}>
        <div className={s.footerTopLeft}>
          <RouterLink to="/" className={s.logo}>
            <OldIcon name="bond-square-token" className="mr-12" />
            {/* <OldIcon name="barnbridge" width="113" color="primary" /> */}
            <Text type="h3" weight="bold" className={s.logoLabel} color="primary">
              Swingby DAO
            </Text>
          </RouterLink>
          {/* { <Text type="small" weight="semibold" color="secondary" className="mb-24">
            A fluctuations derivatives protocol for hedging yield sensitivity and market price.
          </Text> */}
          <div className={s.socialLinks}>
            <ExternalLink href={links.twitter} variation="ghost-alt" icon="twitter" iconPosition="only" />
            <ExternalLink href={links.discord} variation="ghost-alt" icon="discord" iconPosition="only" />
            <ExternalLink href={links.github} variation="ghost-alt" icon="github" iconPosition="only" />
          </div>
        </div>
        <div className={s.footerTopRight}>
          <section className={s.navSection}>
            <ul>
              <li>
                <ExternalLink variation="text-alt" href={links.website}>
                  Website
                </ExternalLink>
              </li>
              <li>
                <ExternalLink variation="text-alt" href={links.blog}>
                  Blog
                </ExternalLink>
              </li>
            </ul>
          </section>
          <section className={s.navSection}>
            <ul>
              <li>
                <ExternalLink variation="text-alt" href="https://skybridge.info">
                  skybridge.info
                </ExternalLink>
              </li>
              <li>
                <ExternalLink variation="text-alt" href="https://bridge.swingby.network/">
                  ERC20 - BEP20 Token bridge
                </ExternalLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <div className={s.footerBottom}>
        <Text type="small" weight="semibold" className={s.copyright}>
          Swingby DAO © 2021
        </Text>
        {/* <div className={s.footerBottomLinks}>
          <ExternalLink variation="text-alt" href={links.uniswapSwap}>
            Uniswap v2 USDC/BOND market
          </ExternalLink>
          <ExternalLink variation="text-alt" href={links.uniswapLiquidity}>
            Uniswap v2 USDC/BOND add liquidity
          </ExternalLink>
        </div> */}
      </div>
    </footer>
  );
};

export default LayoutFooter;
