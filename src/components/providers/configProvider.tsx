import { FC, createContext, useContext } from 'react';

import { useNetwork } from 'components/providers/networkProvider';

import { InvariantContext } from 'utils/context';

import { NetworkConfig } from 'networks/types';

export type ConfigContextType = NetworkConfig & {
  links: {
    website: string;
    discord: string;
    twitter: string;
    blog: string;
    github: string;
    forum: string;
    signal: string;
    uniswapLiquidity: string;
    uniswapSwap: string;
  };
};

const Context = createContext<ConfigContextType>(InvariantContext('ConfigProvider'));

export function useConfig(): ConfigContextType {
  return useContext(Context);
}

const ConfigProvider: FC = props => {
  const { children } = props;
  const { activeNetwork } = useNetwork();

  const config = activeNetwork.config;
  const value: ConfigContextType = {
    ...activeNetwork.config,
    links: {
      website: 'https://swingby.network',
      discord: 'https://discord.com/invite/q3cAjpV',
      blog: 'https://swingby.medium.com/',
      twitter: 'https://twitter.com/swingbyprotocol',
      github: 'https://github.com/swingbyprotocol',
      forum: 'https://forum.barnbridge.com',
      signal: 'https://signal.barnbridge.com',
      uniswapLiquidity: `https://app.uniswap.org/#/add/v2/${config.tokens?.swingby}/${config.tokens?.usdc}`,
      uniswapSwap: `https://app.uniswap.org/#/swap?use=V2&inputCurrency=${config.tokens?.swingby}&outputCurrency=${config.tokens?.usdc}`,
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ConfigProvider;
