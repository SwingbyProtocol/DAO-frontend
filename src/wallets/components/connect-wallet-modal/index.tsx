import React from 'react';

import Button from 'components/antd/button';
import Modal, { ModalProps } from 'components/antd/modal';
import Grid from 'components/custom/grid';
import { Text } from 'components/custom/typography';
import { useGeneral } from 'components/providers/generalProvider';
import useMergeState from 'hooks/useMergeState';
// import LedgerDerivationPathModal from 'wallets/components/ledger-deriviation-path-modal';
import { WalletConnector, WalletConnectors, getMeta, useWallet } from 'wallets/walletProvider';

export type ConnectWalletModalProps = ModalProps;

type ConnectWalletModalState = {
  showLedgerModal: boolean;
};

const InitialState: ConnectWalletModalState = {
  showLedgerModal: false,
};

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = props => {
  const { ...modalProps } = props;
  const { theme } = useGeneral();

  const wallet = useWallet();
  const [state, setState] = useMergeState<ConnectWalletModalState>(InitialState);

  function handleConnectorSelect(connector: WalletConnector) {
    if (wallet.isActive) {
      return;
    }

    wallet.connect(connector).catch(Error);
  }

  return (
    <Modal width={568} {...modalProps}>
      <Grid flow="row" gap={32}>
        <Grid flow="row" gap={4}>
          <Text type="h2" weight="bold" color="primary">
            Connect Wallet
          </Text>
          <Text type="p1" color="secondary">
            Please select the wallet of your liking
          </Text>
        </Grid>

        <Grid gap={24} colsTemplate="repeat(auto-fit, minmax(120px, 240px))">
          {WalletConnectors.map(([connector], idx) => (
            <Button key={idx} type="select" style={{ height: '96px' }} onClick={() => handleConnectorSelect(connector)}>
              <img
                src={
                  Array.isArray(getMeta(connector).logo)
                    ? getMeta(connector).logo[theme === 'dark' ? 1 : 0]
                    : getMeta(connector).logo
                }
                alt={getMeta(connector).name}
                height={32}
              />
            </Button>
          ))}
        </Grid>
      </Grid>

      {/* {state.showLedgerModal && ( */}
      {/*   <LedgerDerivationPathModal */}
      {/*     onCancel={() => { */}
      {/*       setState({ showLedgerModal: false }); */}
      {/*     }} */}
      {/*   /> */}
      {/* )} */}
    </Modal>
  );
};

export default ConnectWalletModal;
