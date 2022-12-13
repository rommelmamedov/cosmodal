import React from 'react';

import { Wallet } from '../../types';
import { BaseModal, BaseModalProps } from './BaseModal';

export interface SelectWalletModalProps extends BaseModalProps {
	wallets: Wallet[];
	selectWallet: (wallet: Wallet) => void;
}

export const SelectWalletModal = ({ wallets, selectWallet, classNames, ...props }: SelectWalletModalProps) => (
	<BaseModal classNames={classNames} title="Connect wallet" {...props}>
		<ul className="wallet-list">
			{wallets.map(wallet => (
				<li
					key={wallet.type}
					className="wallet-list-item"
					onClick={e => {
						e.preventDefault();
						selectWallet(wallet);
					}}
				>
					<img alt="keplr logo" src={wallet.imageUrl} />
					<div className="wallet-list-item-info">
						<div className="wallet-name">{wallet.name}</div>
						<div className="wallet-description">{wallet.description}</div>
					</div>
				</li>
			))}
		</ul>
	</BaseModal>
);
