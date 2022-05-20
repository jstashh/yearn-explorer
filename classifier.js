import { ethers, Contract } from "ethers";
import store from "./store";

const vaultAbi = require("./abis/vault.json");
const registryAbi = require("./abis/registry.json");
const strategyAbi = require("./abis/strategy.json");

const registry = new Contract(
  "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804",
  registryAbi,
  store.provider
);

export async function isVault(address) {
  const vault = new Contract(address, vaultAbi, store.provider);
  try {
    const token = await vault.token();
    const registered = await registry.isRegistered(token);
    return registered;
  } catch (error) {
    // console.error(error);
    return false;
  }
}

export async function isStrategy(address) {
  const strategy = new Contract(address, strategyAbi, store.provider);
  try {
    const vault = await strategy.vault();
    return vault !== ethers.constants.AddressZero;
  } catch (error) {
    // console.error(error);
    return false;
  }
}

export async function classify(address) {
  const vault = await isVault(address);
  if (vault) {
    return "vault";
  }
  const strat = await isStrategy(address);
  if (strat) {
    return "strategy";
  }
  return "unknown";
}
