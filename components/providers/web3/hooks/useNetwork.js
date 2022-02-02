import { useEffect } from "react";
import useSWR from "swr"

const NETWORKS = {
    1: "Ethereum Mainnet",
    2: "Ropsten Test Network",
    3: "Rinkeby Test Network",
    4: "Goerli Test Network",
    5: "Kovan Test Network",
    42: "Kovan Test Network",
    56: "Binance Smart Chain",
    79: "Zenith Mainnet",
    1337: "Ganache",
    250: "Fantom Opera Mainnet",
    43114: "Avalanche Mainnet C-Chain",
}

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID];

export const handler = (web3, provider) => () => {

    const {data, mutate, ...rest} = useSWR(() => 
        web3 ? "web3/network" : null,
        async () => {
          const chainId = await web3.eth.getChainId();

          if(!chainId) {
              throw new Error("Cannot retrieve a network, Please refresh the browser");
          }

          return NETWORKS[chainId];
        }
    )

    useEffect(() => {
        const mutator = chainId => window.location.reload();
        provider?.on("chainChanged", mutator)
  
        return () => {
           provider?.removeListener("chainChanged", mutator)
        }
 
     }, [provider])
    
    return {
        data,
        mutate,
        target: targetNetwork,
        isSupported: data === targetNetwork,
        ...rest,
    }
}

