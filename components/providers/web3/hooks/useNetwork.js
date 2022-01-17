import { useEffect } from "react/cjs/react.development";
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

export const handler = (web3, provider) => () => {

    const {mutate, ...rest} = useSWR(() => 
        web3 ? "web3/network" : null,
        async () => {
          const chainId = await web3.eth.getChainId();
          return NETWORKS[chainId] ?? chainId;
        }
    )

    useEffect(() => {
        provider &&
        provider.on("chainChanged", chainId => {
            mutate(NETWORKS[parseInt(chainId, 16)])
        })
    }, [web3]);
    
    return {
        network: {
            mutate,
            ...rest,
        }
    }
}

