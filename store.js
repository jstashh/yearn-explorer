import { ethers } from "ethers";

class Store {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.ftm.tools/",
      250
    );
  }
}

const store = new Store();
export default store;
