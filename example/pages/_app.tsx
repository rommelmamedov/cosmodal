import "../styles/globals.css"

import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from "@rommelmamedov/cosmodal"
import type { AppProps } from "next/app"
import { FunctionComponent } from "react"
import { GasPrice } from "@cosmjs/stargate"

const LOCAL_STORAGE_KEY = "connectedWalletId"

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <WalletManagerProvider
    walletConnectClientMeta={{
      name: "CosmodalExampleDApp",
      description: "A dApp using the @rommelmamedov/cosmodal library.",
      url: "https://rommelmamedov-cosmodal.vercel.app",
      icons: ["https://moonphase.is/image.svg"],
    }}
    enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
    renderLoader={() => <p>Loading...</p>}
    localStorageKey={LOCAL_STORAGE_KEY}
    defaultChainId={ChainInfoID.Juno1}
    getSigningCosmWasmClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        "0.0025" + chainInfo.feeCurrencies[0].coinMinimalDenom
      ),
    })}
    getSigningStargateClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        "0.0025" + chainInfo.feeCurrencies[0].coinMinimalDenom
      ),
    })}
    // Choose a different RPC node for the desired chain.
    // chainInfoOverrides={[
    //   {
    //     ...ChainInfoMap[ChainInfoID.Juno1],
    //     rpc: "https://another.rpc.com",
    //   }
    // ]}
  >
    <Component {...pageProps} />
  </WalletManagerProvider>
)

export default MyApp
