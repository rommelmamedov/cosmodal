import React, { PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import ReactModal from 'react-modal';

import { ModalClassNames } from '../../types';

export type BaseModalProps = PropsWithChildren<{
	isOpen: boolean;
	onClose?: () => void;
	title?: ReactElement | string;
	maxWidth?: string;
	classNames?: ModalClassNames;
	closeIcon?: ReactNode;
}>;

export const BaseModal = ({ isOpen, onClose, title, classNames, children }: BaseModalProps) => {
	// ReactModal accessibility.
	useEffect(() => {
		ReactModal.setAppElement('body');
	}, []);

	return (
		<ReactModal
			ariaHideApp={false}
			className={classNames?.modalContent ?? 'customModalContent md'}
			closeTimeoutMS={200}
			contentElement={(props, children) => (
				<div className="modal-content" {...props}>
					{children}
				</div>
			)}
			isOpen={isOpen}
			onRequestClose={e => {
				e.preventDefault();
				onClose?.();
			}}
			overlayClassName={classNames?.modalOverlay ?? 'customModalOverlay'}
			overlayElement={(props, children) => (
				<div className="modal-overlay" {...props}>
					{children}
				</div>
			)}
			portalClassName={classNames?.portalClassName ?? 'customModal'}
			shouldCloseOnOverlayClick={true}
		>
			<div className="customModalInner">
				<div className="customModalHeader noBorder">
					{title && <h6>{title}</h6>}
					{onClose && (
						<button className="close" data-style="link" onClick={onClose} title="Close">
							<svg fill="none" height="15" viewBox="0 0 15 15" width="15">
								<path
									d="M6.80149 7.5086L0.646484 13.6636L1.35359 14.3707L7.5086 8.2157L13.6636 14.3707L14.3707 13.6636L8.2157 7.5086L14.3707 1.35359L13.6636 0.646484L7.5086 6.80149L1.35359 0.646484L0.646484 1.35359L6.80149 7.5086Z"
									fill="currentColor"
								/>
							</svg>
						</button>
					)}
				</div>
				<div className="customModalBody">{children}</div>
			</div>
		</ReactModal>
	);
};
