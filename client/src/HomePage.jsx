import React, { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import {
  configureChains,
  createConfig,
  useAccount,
  WagmiConfig,
  useDisconnect,
} from "wagmi";
import { useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";

const HomePage = () => {
  const { open, close } = useWeb3Modal();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [genSignature, setGenSignature] = useState(null);
  const [recoveredAddr, setRecoveredAddr] = useState(null);
  const { data, isError, isLoading, isSuccess, signMessage, variables, reset } =
    useSignMessage({
      message: "Hello Message",
      onSuccess(data) {
        console.log("Success", data);
        setGenSignature(data);
      },
    });

  const handleDisconnect = async () => {
    disconnect();
    reset();
  };

  const verifySig = async (e) => {
    if (variables?.message && genSignature != null) {
      const recoveredAddress = await recoverMessageAddress({
        message: variables?.message,
        signature: genSignature,
      });
      console.log("Recoved address : ", recoveredAddress);
      setRecoveredAddr(recoveredAddress);
    }
  };

  return (
    <div className="App">
      <>
        {!isConnected ? <button onClick={() => open()}>Connect</button> : null}
        {isConnected ? (
          <>
            <button onClick={handleDisconnect}>Disconnect</button>
            <button
              disabled={isLoading}
              onClick={() => {
                setRecoveredAddr(null);
                signMessage();
              }}
            >
              Sign message
            </button>
          </>
        ) : null}

        {isSuccess && (
          <>
            <button disabled={isLoading} onClick={() => verifySig()}>
              Verify Signature
            </button>
            <div>Signature: {data}</div>
            {recoveredAddr != null ? (
              <div>Recovered Address : {recoveredAddr}</div>
            ) : null}
          </>
        )}
        {isError && <div>Error signing message</div>}
      </>
    </div>
  );
};

export default HomePage;
