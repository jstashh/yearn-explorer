import { ethers } from "ethers";
import store from "./store";

const callAggregatorAbi = require("./abis/callAggregator.json");

export async function getAggregatedProperties(target, properties) {
  const aggregator = new ethers.Contract(
    "0x5D7201c10AfD0Ed1a1F408E321Ef0ebc7314B086",
    callAggregatorAbi,
    store.provider
  );

  const propertyNames = properties.map((array) => array[0]);

  const coder = new ethers.utils.AbiCoder();
  const result = await aggregator.getProperties(target, propertyNames);

  var decodedData = {};

  properties.forEach((property, index) => {
    const resData = result[index];
    const decoded = coder.decode([property[1]], resData)[0];
    decodedData[property[0]] = decoded;
  });

  return decodedData;
}
