import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

const MAINNET_CHAIN_ID = 1;

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(actions => {
  return new WalletConnectV2({
    actions,
    options: {
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
      chains: [MAINNET_CHAIN_ID],
      optionalChains: [],
      showQrModal: true,
    },
  });
});
