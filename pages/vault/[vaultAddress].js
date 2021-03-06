import { BigNumber, Contract, ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import store from "../../store";
import styles from "../../styles/VaultView.module.css";
import LineItem from "../../components/lineItem";
import AddressLineItem from "../../components/addressLineItem";
import { getAggregatedProperties } from "../../callAggregator";
import VaultStrategyInfo from "../../components/vaultStrategyInfo";

const vaultAbi = require("../../abis/vault.json");
const callAggregatorAbi = require("../../abis/callAggregator.json");
const strategiesHelperAbi = require("../../abis/strategiesHelper.json");
const vaultStrategiesParamAggregatorAbi = require("../../abis/vaultStrategiesParamAggregator.json");

const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

// Formatter for weekdays, e.g. "Monday"
const short = new Intl.DateTimeFormat("en-GB", { weekday: "long" });

// Formatter for dates, e.g. "Mon, 31 May 2021"
const long = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const formatDate = (date) => {
  const now = new Date().setHours(0, 0, 0, 0);
  const then = date.setHours(0, 0, 0, 0);
  const days = (then - now) / 86400000;
  if (days > -6) {
    if (days > -2) {
      return relative.format(days, "day");
    }
    return short.format(date);
  }
  return long.format(date);
};

function formatFee(fee) {
  return fee / 100 + "%";
}

function formatBigNumber(number, symbol) {
  const formatted = ethers.utils.formatUnits(number, 18);
  const fixed = (+formatted.toString()).toFixed(2);
  var result = ethers.utils.commify(fixed);
  if (symbol) {
    result = result + " " + symbol;
  }
  return result;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const hoursAndMinutes = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatDate(date)} ${hoursAndMinutes}`;
}

async function formatAddress(address) {
  // if (ethers.)
  if (store.provider.network.chainId !== 1) {
    return address;
  }
  const lookup = await store.provider.lookupAddress(address);
  if (lookup) {
    return lookup;
  }
  return address;
}

export default function VaultView() {
  const router = useRouter();
  const { vaultAddress } = router.query;

  const [vaultData, setVaultData] = useState({});
  const [strategiesData, setStrategiesData] = useState([]);
  const [showZeroDebtRatio, setShowZeroDebtRatio] = useState(false);

  useEffect(() => {
    async function work() {
      if (!vaultAddress) {
        return;
      }

      const properties = [
        ["name", "string"],
        ["symbol", "string"],
        ["apiVersion", "string"],
        ["emergencyShutdown", "bool"],
        ["lastReport", "uint256"],
        ["managementFee", "uint256"],
        ["performanceFee", "uint256"],
        ["totalAssets", "uint256"],
        ["depositLimit", "uint256"],
        ["debtRatio", "uint256"],
        ["management", "address"],
        ["governance", "address"],
        ["guardian", "address"],
        ["rewards", "address"],
      ];

      const decodedData = await getAggregatedProperties(
        vaultAddress,
        properties
      );

      const totalAssets = formatBigNumber(
        decodedData.totalAssets,
        decodedData.symbol
      );
      const depositLimit = formatBigNumber(
        decodedData.depositLimit,
        decodedData.symbol
      );

      const [management, governance, guardian, rewards] = await Promise.all([
        formatAddress(decodedData.management),
        formatAddress(decodedData.governance),
        formatAddress(decodedData.guardian),
        formatAddress(decodedData.rewards),
      ]);

      const data = {
        name: decodedData.name,
        apiVersion: decodedData.apiVersion,
        emergencyShutdown: decodedData.emergencyShutdown.toString(),
        lastReport: formatTimestamp(decodedData.lastReport),
        managementFee: formatFee(decodedData.managementFee),
        performanceFee: formatFee(decodedData.performanceFee),
        totalAssets,
        depositLimit,
        debtRatio: (decodedData.debtRatio / 10000).toString(),
        management,
        governance,
        guardian,
        rewards,
      };

      setVaultData(data);
    }

    async function workStrategies() {
      if (!vaultAddress) {
        return;
      }

      const aggregator = new Contract(
        "0x383588dd317a7189522b8646b729b4b87794ccd1",
        vaultStrategiesParamAggregatorAbi,
        store.provider
      );

      const stratData = await aggregator.assetVaultStrategiesInfo(vaultAddress);

      const stratDataDecoded = stratData.map((datum) => {
        const paramsStruct = datum[4];
        const params = {
          performanceFee: paramsStruct[0],
          activation: paramsStruct[1],
          debtRatio: paramsStruct[2],
          minDebtPerHarvest: paramsStruct[3],
          maxDebtPerHarvest: paramsStruct[4],
          lastReport: paramsStruct[5],
          totalDebt: paramsStruct[6],
          totalGain: paramsStruct[7],
          totalLoss: paramsStruct[8],
        };
        return {
          address: datum[0],
          name: datum[1],
          underlyingTokenSymbol: datum[2],
          realDebtRatio: datum[3],
          params,
        };
      });
      var arrayToSort = [...stratDataDecoded];
      arrayToSort.sort(function (lhs, rhs) {
        const lhsNum = +lhs.params.debtRatio.toString();
        const rhsNum = +rhs.params.debtRatio.toString();
        return rhsNum - lhsNum;
      });

      setStrategiesData(arrayToSort);
    }

    work();
    workStrategies();
  }, [vaultAddress]);

  function toggleShowZeroDebt() {
    setShowZeroDebtRatio(!showZeroDebtRatio);
  }

  return (
    <div className={styles.container}>
      <div className={styles.vaultInfoContainer}>
        <h4 className={styles.header}>Info</h4>
        <LineItem myTitle={"Name"} myValue={vaultData.name} />
        <LineItem myTitle={"Api Version"} myValue={vaultData.apiVersion} />
        <LineItem
          myTitle={"Emergency Shutdown"}
          myValue={vaultData.emergencyShutdown}
        />
        <LineItem myTitle={"Last Report"} myValue={vaultData.lastReport} />
        <h4 className={styles.header}>Funds</h4>
        <LineItem myTitle={"Total Assets"} myValue={vaultData.totalAssets} />
        <LineItem myTitle={"Deposit Limit"} myValue={vaultData.depositLimit} />
        <LineItem myTitle={"Debt Ratio"} myValue={vaultData.debtRatio} />
        <h4 className={styles.header}>Fees</h4>
        <LineItem
          myTitle={"Management Fee"}
          myValue={vaultData.managementFee}
        />
        <LineItem
          myTitle={"Performance Fee"}
          myValue={vaultData.performanceFee}
        />
        <h4 className={styles.header}>Addresses</h4>
        <AddressLineItem
          myTitle={"Management"}
          address={vaultData.management}
        />
        <AddressLineItem
          myTitle={"Governance"}
          address={vaultData.governance}
        />
        <AddressLineItem myTitle={"Guardian"} address={vaultData.guardian} />
        <AddressLineItem myTitle={"Rewards"} address={vaultData.rewards} />
      </div>
      <div className={styles.strategyInfoContainer}>
        <button
          title="Show zero debt ratio"
          className={styles.zeroDebtButton}
          onClick={toggleShowZeroDebt}
        >
          {showZeroDebtRatio ? "Hide" : "Show"} zero debt ratio
        </button>
        {strategiesData.map((datum) => {
          if (!showZeroDebtRatio && datum.realDebtRatio.toString() === "0") {
            return <></>;
          }
          return (
            <>
              <h4 className={styles.header}>{datum.name}</h4>
              <AddressLineItem myTitle={"Address"} address={datum[0]} />
              <LineItem
                myTitle={"Debt Ratio"}
                myValue={(datum.params.debtRatio / 10000).toString()}
              />
              <LineItem
                myTitle={"Real Debt Ratio"}
                myValue={(datum.realDebtRatio / 10000).toString()}
              />
              <LineItem
                myTitle={"Last Report"}
                myValue={formatTimestamp(datum.params.lastReport)}
              />
              <LineItem
                myTitle={"Total Debt"}
                myValue={formatBigNumber(
                  datum.params.totalDebt,
                  datum.underlyingTokenSymbol
                )}
              />
              <LineItem
                myTitle={"Total Gain"}
                myValue={formatBigNumber(
                  datum.params.totalGain,
                  datum.underlyingTokenSymbol
                )}
              />
              {/* <VaultStrategyInfo
                key={datum[0]}
                address={datum[0]}
                name={datum[1]}
                params={datum[2]}
              /> */}
            </>
          );
        })}
      </div>
    </div>
  );
}
