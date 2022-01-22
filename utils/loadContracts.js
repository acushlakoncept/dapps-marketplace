
export const loadContract = async (name, web3) => {
  const res = await fetch(`/contracts/${name}.json`)
  const Artifact = await res.json()
  let contract = null;

  try {
    contract = new web3.eth.Contract(
      Artifact.abi, 
      Artifact.networks[process.env.NEXT_PUBLIC_NETWORK_ID].address)
  } catch {
    console.log(`Contract ${name} cannot be loaded - Connect to the right network`)
  }

  return contract;
}