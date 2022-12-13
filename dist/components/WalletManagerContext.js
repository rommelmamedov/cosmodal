"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConnectWalletToChain = exports.useWallet = exports.useWalletManager = exports.WalletManagerContext = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const types_1 = require("../types");
const utils_1 = require("../utils");
exports.WalletManagerContext = (0, react_1.createContext)(null);
const useWalletManager = () => {
    const context = (0, react_1.useContext)(exports.WalletManagerContext);
    if (!context) {
        throw new Error('You forgot to use WalletManagerProvider.');
    }
    return context;
};
exports.useWalletManager = useWalletManager;
const useWallet = (chainId) => {
    const { status: managerStatus, error: managerError, connectedWallet: managerConnectedWallet, chainInfoOverrides, getSigningCosmWasmClientOptions, getSigningStargateClientOptions, } = (0, exports.useWalletManager)();
    // Connect to chain ID if provided when main wallet connection has been
    // established.
    const shouldConnectToChainId = managerStatus === types_1.WalletConnectionStatus.Connected && !!managerConnectedWallet && !!chainId;
    const [chainIdStatus, setChainIdStatus] = (0, react_1.useState)(types_1.WalletConnectionStatus.Initializing);
    const [chainIdError, setChainIdError] = (0, react_1.useState)();
    const [chainIdConnectedWallet, setChainIdConnectedWallet] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        // If should not connect, already connecting, or already connected, do
        // nothing.
        if (!shouldConnectToChainId ||
            chainIdStatus === types_1.WalletConnectionStatus.Connecting ||
            chainIdStatus === types_1.WalletConnectionStatus.Connected ||
            chainIdStatus === types_1.WalletConnectionStatus.Errored) {
            return;
        }
        // Try to connect.
        const connect = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            setChainIdStatus(types_1.WalletConnectionStatus.Connecting);
            setChainIdConnectedWallet(undefined);
            setChainIdError(undefined);
            try {
                const chainInfo = yield (0, utils_1.getChainInfo)(chainId, chainInfoOverrides);
                setChainIdConnectedWallet(yield (0, utils_1.getConnectedWalletInfo)(managerConnectedWallet.wallet, managerConnectedWallet.walletClient, chainInfo, yield (getSigningCosmWasmClientOptions === null || getSigningCosmWasmClientOptions === void 0 ? void 0 : getSigningCosmWasmClientOptions(chainInfo)), yield (getSigningStargateClientOptions === null || getSigningStargateClientOptions === void 0 ? void 0 : getSigningStargateClientOptions(chainInfo))));
                setChainIdStatus(types_1.WalletConnectionStatus.Connected);
            }
            catch (error) {
                console.error(error);
                setChainIdError(error);
                setChainIdStatus(types_1.WalletConnectionStatus.Errored);
            }
        });
        connect();
    }, [
        managerStatus,
        managerConnectedWallet,
        chainId,
        getSigningCosmWasmClientOptions,
        getSigningStargateClientOptions,
        chainInfoOverrides,
        shouldConnectToChainId,
        chainIdStatus,
    ]);
    // If chainId wallet is connected and manager wallet changes status away from
    // connected, reset so that we reconnect once manager reconnects. This ensures
    // that we disconnect when the manager disconnects, and update accounts when
    // the manager changes accounts.
    (0, react_1.useEffect)(() => {
        if (!!chainId &&
            !!chainIdConnectedWallet &&
            chainIdStatus === types_1.WalletConnectionStatus.Connected &&
            managerStatus !== types_1.WalletConnectionStatus.Connected) {
            setChainIdStatus(types_1.WalletConnectionStatus.Initializing);
            setChainIdError(undefined);
            setChainIdConnectedWallet(undefined);
        }
    }, [managerStatus, chainId, chainIdStatus, chainIdConnectedWallet]);
    const status = shouldConnectToChainId ? chainIdStatus : managerStatus;
    const connected = status === types_1.WalletConnectionStatus.Connected;
    const error = shouldConnectToChainId ? chainIdError : managerError;
    const connectedWallet = chainId ? chainIdConnectedWallet : managerConnectedWallet;
    return Object.assign({ status, connected, error }, connectedWallet);
};
exports.useWallet = useWallet;
const useConnectWalletToChain = () => {
    const { status, connectedWallet, chainInfoOverrides, getSigningCosmWasmClientOptions, getSigningStargateClientOptions } = (0, exports.useWalletManager)();
    const connectWalletToChain = (0, react_1.useCallback)((chainId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (status !== types_1.WalletConnectionStatus.Connected || !connectedWallet) {
            throw new Error('Wallet must first be connected to the default chain.');
        }
        const chainInfo = yield (0, utils_1.getChainInfo)(chainId, chainInfoOverrides);
        return yield (0, utils_1.getConnectedWalletInfo)(connectedWallet.wallet, connectedWallet.walletClient, chainInfo, yield (getSigningCosmWasmClientOptions === null || getSigningCosmWasmClientOptions === void 0 ? void 0 : getSigningCosmWasmClientOptions(chainInfo)), yield (getSigningStargateClientOptions === null || getSigningStargateClientOptions === void 0 ? void 0 : getSigningStargateClientOptions(chainInfo)));
    }), [chainInfoOverrides, connectedWallet, getSigningCosmWasmClientOptions, getSigningStargateClientOptions, status]);
    return connectWalletToChain;
};
exports.useConnectWalletToChain = useConnectWalletToChain;
//# sourceMappingURL=WalletManagerContext.js.map