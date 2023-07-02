import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  ChakraProvider,
} from "@chakra-ui/react";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygon, polygonMumbai } from "@wagmi/chains";
import { Global } from "@emotion/react";
import {
  connectorsForWallets,
  DisclaimerComponent,
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import theme from "@/lib/theme";
import Fonts from "@/components/Fonts";
import "../styles/globals.css";
import { UserContextWrapper } from "@/context/UserContext";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Parking Block DApp",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains,

});

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
  webSocketProvider,
});

export default function ParkingBlock({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={midnightTheme({
            accentColor: "#000000",
          })}
          coolMode
          chains={chains}
        >
          <UserContextWrapper>
            <Component {...pageProps} />
          </UserContextWrapper>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
