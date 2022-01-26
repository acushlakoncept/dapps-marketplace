import { useEffect } from "react";
import useSWR from 'swr'

const adminAddresses = {
    "0xae624f6fa5bbb2f3a163b3587f8e002fde0985a241c09459d61bc61dac12741a" : true
}

export const handler = (web3, provider) => () => {

    const { data, mutate, ...rest } = useSWR(() => 
        web3 ? "web3/accounts" : null,
        async () => {
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0];

          if (!account) {
              throw new Error("Cannot retrieve an account, Please refresh the browser");
          }
          
          return account;
        }
    )

    useEffect(() => {
       const mutator = accounts => mutate(accounts[0] ?? null);
       provider?.on("accountsChanged", mutator)

       return () => {
          provider?.removeListener("accountsChanged", mutator)
       }

    }, [provider])

    return { 
        data,
        isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
        mutate,
        ...rest 
    }
}