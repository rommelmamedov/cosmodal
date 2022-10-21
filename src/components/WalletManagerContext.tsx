import { ChainInfo } from "@keplr-wallet/types"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  ConnectedWallet,
  ConnectWalletToChainFunction,
  IWalletManagerContext,
  UseWalletResponse,
  WalletConnectionStatus,
} from "../types"
import { getChainInfo, getConnectedWalletInfo } from "../utils"

export const WalletManagerContext = createContext<IWalletManagerContext | null>(
  null
)

export const useWalletManager = () => {
  const context = useContext(WalletManagerContext)
  if (!context) {
    throw new Error("You forgot to use WalletManagerProvider.")
  }

  return context
}

export const useWallet = (
  chainId?: ChainInfo["chainId"]
): UseWalletResponse => {
  const {
    status: managerStatus,
    error: managerError,
    connectedWallet: managerConnectedWallet,
    chainInfoOverrides,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
  } = useWalletManager()

  // Connect to chain ID if provided when main wallet connection has been
  // established.
  const shouldConnectToChainId =
    managerStatus === WalletConnectionStatus.Connected &&
    !!managerConnectedWallet &&
    !!chainId
  const [chainIdStatus, setChainIdStatus] = useState<WalletConnectionStatus>(
    () =>
      shouldConnectToChainId
        ? // Initialize as connecting if we should immediately try to connect.
          WalletConnectionStatus.Connecting
        : WalletConnectionStatus.Initializing
  )

  const [chainIdError, setChainIdError] = useState<unknown>()
  const [chainIdConnectedWallet, setChainIdConnectedWallet] =
    useState<ConnectedWallet>()
  useEffect(() => {
    if (!shouldConnectToChainId) {
      // If manager not connected, pass through status updates.
      setChainIdStatus(managerStatus)
      setChainIdConnectedWallet(undefined)
      setChainIdError(undefined)
      return
    }

    const connect = async () => {
      setChainIdStatus(WalletConnectionStatus.Connecting)
      setChainIdError(undefined)

      const chainInfo = await getChainInfo(chainId, chainInfoOverrides)

      setChainIdConnectedWallet(
        await getConnectedWalletInfo(
          managerConnectedWallet.wallet,
          managerConnectedWallet.walletClient,
          chainInfo,
          await getSigningCosmWasmClientOptions?.(chainInfo),
          await getSigningStargateClientOptions?.(chainInfo)
        )
      )
      setChainIdStatus(WalletConnectionStatus.Connected)
    }

    connect().catch((error) => {
      console.error(error)
      setChainIdError(error)
      setChainIdStatus(WalletConnectionStatus.Errored)
    })
  }, [
    managerStatus,
    managerConnectedWallet,
    chainId,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
    chainInfoOverrides,
    shouldConnectToChainId,
  ])

  const status = chainId ? chainIdStatus : managerStatus
  const connected = status === WalletConnectionStatus.Connected
  const error = chainId ? chainIdError : managerError
  const connectedWallet = chainId
    ? chainIdConnectedWallet
    : managerConnectedWallet

  return { status, connected, error, ...connectedWallet }
}

export const useConnectWalletToChain = () => {
  const {
    status,
    connectedWallet,
    chainInfoOverrides,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
  } = useWalletManager()

  const connectWalletToChain: ConnectWalletToChainFunction = useCallback(
    async (chainId) => {
      if (status !== WalletConnectionStatus.Connected || !connectedWallet) {
        throw new Error("Wallet must first be connected to the default chain.")
      }

      const chainInfo = await getChainInfo(chainId, chainInfoOverrides)

      return await getConnectedWalletInfo(
        connectedWallet.wallet,
        connectedWallet.walletClient,
        chainInfo,
        await getSigningCosmWasmClientOptions?.(chainInfo),
        await getSigningStargateClientOptions?.(chainInfo)
      )
    },
    [
      chainInfoOverrides,
      connectedWallet,
      getSigningCosmWasmClientOptions,
      getSigningStargateClientOptions,
      status,
    ]
  )

  return connectWalletToChain
}
