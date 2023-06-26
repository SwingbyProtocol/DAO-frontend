import React, { FC, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSessionStorage } from 'react-use-storage';
import SafeProvider, { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Web3ReactHooks } from '@web3-react/core';
import { MetaMask, NoMetaMaskError } from '@web3-react/metamask';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import * as Antd from 'antd';
import BigNumber from 'bignumber.js';

import { useNetwork } from 'components/providers/networkProvider';
import MetamaskLogoDark from 'resources/svg/wallets/metamask-logo-dark.svg';
import MetamaskLogo from 'resources/svg/wallets/metamask-logo.svg';
import WalletConnectLogo from 'resources/svg/wallets/walletconnect-logo.svg';
import ConnectWalletModal from 'wallets/components/connect-wallet-modal';
import InstallMetaMaskModal from 'wallets/components/install-metamask-modal';
import UnsupportedChainModal from 'wallets/components/unsupported-chain-modal';
//import CoinbaseWalletConfig from 'wallets/connectors/coinbase';
//import GnosisSafeConfig from 'wallets/connectors/gnosis-safe';
//import LedgerWalletConfig from 'wallets/connectors/ledger';
//import TrezorWalletConfig from 'wallets/connectors/trezor';
import { metaMask, hooks as metaMaskHooks } from 'wallets/connectors/metamask';
import { walletConnectV2, hooks as walletConnectV2Hooks } from 'wallets/connectors/walletconnect-v2';

import { InvariantContext } from 'utils/context';

export type WalletConnector = MetaMask | WalletConnectV2;

export const WalletConnectors: [WalletConnector, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
];

export function getMeta(connector: WalletConnector) {
  if (connector instanceof WalletConnectV2) {
    return {
      id: 'walletconnect',
      name: 'WalletConnect',
      logo: WalletConnectLogo,
    };
  }
  return {
    id: 'metamask',
    name: 'MetaMask',
    logo: [MetamaskLogo, MetamaskLogoDark],
  };
}

function getConnectorById(id?: string): typeof WalletConnectors[0] {
  if (id === 'walletconnect') {
    return WalletConnectors.find(([connector]) => connector instanceof WalletConnectV2)!;
  }
  return WalletConnectors.find(([connector]) => connector instanceof MetaMask)!;
}

type WalletContextType = {
  initialized: boolean;
  connecting?: WalletConnector;
  isActive: boolean;
  account?: string;
  chainId?: number;
  meta?: WalletConnector;
  connector?: WalletConnector;
  provider?: any;
  ethBalance?: BigNumber;
  showWalletsModal: () => void;
  connect: (connector: WalletConnector, isPreconnect?: boolean) => Promise<void>;
  disconnect: () => void;
};

const Context = createContext<WalletContextType>(InvariantContext('Web3WalletProvider'));

export function useWallet(): WalletContextType {
  return useContext(Context);
}

const Web3WalletProvider: FC = props => {
  const { activeNetwork } = useNetwork();
  const safeApps = useSafeAppsSDK();

  const [sessionProvider, setSessionProvider, removeSessionProvider] = useSessionStorage<string | undefined>(
    'wallet_provider',
  );
  const [meta, hook] = getConnectorById(sessionProvider);
  const isActive = hook.useIsActive();
  const accounts = hook.useAccounts();
  const provider = hook.useProvider();
  const chainId = hook.useChainId();

  const [initialized, setInitialized] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<WalletConnector | undefined>(undefined);
  const connectingRef = useRef<WalletConnector | undefined>(connecting);
  connectingRef.current = connecting;

  const [connectWalletModal, setConnectWalletModal] = useState<boolean>(false);
  const [unsupportedChainModal, setUnsupportedChainModal] = useState<boolean>(false);
  const [installMetaMaskModal, setInstallMetaMaskModal] = useState<boolean>(false);

  const disconnect = useCallback(() => {
    if (meta?.deactivate) {
      meta.deactivate();
    } else {
      meta?.resetState();
    }

    setConnecting(undefined);
    removeSessionProvider();
  }, [meta, removeSessionProvider, setConnecting]);

  const connect = useCallback(
    async (connector: WalletConnector, isPreconnect?: boolean): Promise<void> => {
      if (connectingRef.current) {
        return;
      }

      connectingRef.current = connector;
      setConnecting(connector);
      setConnectWalletModal(false);

      function onError(error: Error) {
        console.error('WalletProvider::Connect().onError', { error });

        if (error instanceof NoMetaMaskError) {
          setInstallMetaMaskModal(true);
          disconnect();
        } else {
          Antd.notification.error({
            message: error.message,
          });
        }
      }

      function onSuccess() {
        if (!connectingRef.current) {
          return;
        }

        setSessionProvider(getMeta(connector).id);
      }

      await new Promise(async (resolve, reject) => {
        try {
          if (connector instanceof WalletConnectV2) {
            if (isPreconnect) {
              await connector.connectEagerly();
            } else {
              await connector.activate(activeNetwork.meta.chainId);
            }
          } else {
            if (isPreconnect) {
              await connector.connectEagerly();
            } else {
              await connector.activate(activeNetwork.metamaskChain);
            }
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
        .then(onSuccess)
        .catch(onError);

      setConnecting(undefined);
    },
    [connectingRef, setConnecting, setSessionProvider, disconnect],
  );

  useEffect(() => {
    (async () => {
      if (sessionProvider) {
        await connect(meta, true);
      }

      setInitialized(true);
    })();
  }, []);

  // useEffect(() => {
  //   if (safeApps.connected) {
  //     connect(GnosisSafeConfig).catch(Error);
  //   }
  // }, [safeApps.connected]);

  const value: WalletContextType = {
    initialized,
    connecting,
    isActive: !!meta && isActive,
    account: meta ? accounts?.[0] : undefined,
    chainId,
    provider: meta ? provider?.provider : undefined,
    meta,
    connector: meta,
    showWalletsModal: () => {
      setConnectWalletModal(true);
    },
    connect,
    disconnect,
  };

  return (
    <Context.Provider value={value}>
      {props.children}
      {connectWalletModal && <ConnectWalletModal onCancel={() => setConnectWalletModal(false)} />}
      {installMetaMaskModal && <InstallMetaMaskModal onCancel={() => setInstallMetaMaskModal(false)} />}
      {unsupportedChainModal && <UnsupportedChainModal onCancel={() => setUnsupportedChainModal(false)} />}
    </Context.Provider>
  );
};

const WalletProvider: FC = props => {
  const { children } = props;

  return (
    <SafeProvider>
      <Web3WalletProvider>{children}</Web3WalletProvider>
    </SafeProvider>
  );
};

export default WalletProvider;
