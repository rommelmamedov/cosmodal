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
				<li key={wallet.type} className="connectWalletModalItem">
					<button
						className="connectWalletModalBtn"
						disabled={wallet.name === 'Kryptic'}
						onClick={e => {
							e.preventDefault();
							selectWallet(wallet);
						}}
						title={wallet.name}
					>
						<img alt={`${wallet.name} logo`} src={wallet.imageUrl} />
						<span className="text">
							<span className="title">{wallet.name}</span>
							<em className="subtitle">{wallet.description}</em>
						</span>
					</button>
				</li>
			))}
		</ul>
	</BaseModal>
);
