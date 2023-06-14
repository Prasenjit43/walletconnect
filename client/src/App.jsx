import "./App.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import {
  configureChains,
  createConfig,
  useAccount,
  WagmiConfig,
  useDisconnect,
} from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import HomePage from "./HomePage";

const chains = [arbitrum, mainnet, polygon];
const projectId = "XXXXXXXX"; /* <=====    ADD YOUR PROJECT ID  */
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <HomePage />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;
