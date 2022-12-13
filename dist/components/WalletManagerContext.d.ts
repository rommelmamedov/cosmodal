/// <reference types="react" />
import { ChainInfo } from '@keplr-wallet/types';
import { ConnectWalletToChainFunction, IWalletManagerContext, UseWalletResponse } from '../types';
export declare const WalletManagerContext: import("react").Context<IWalletManagerContext | null>;
export declare const useWalletManager: () => IWalletManagerContext;
export declare const useWallet: (chainId?: ChainInfo['chainId']) => UseWalletResponse;
export declare const useConnectWalletToChain: () => ConnectWalletToChainFunction;
//# sourceMappingURL=WalletManagerContext.d.ts.map