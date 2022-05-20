import LineItem from "./lineItem";
import styles from "../styles/VaultStrategyInfo.module.css";

export default function VaultStrategyInfo(props) {
  return (
    <div className={styles.container}>
      {/* <LineItem myTitle={props.name} myValue={props.address} /> */}
      <div>{props.name}</div>
      <div>{props.address}</div>
      <div>{`debt ratio ${(props.params[2] / 10000).toString()}`}</div>
      <div>{`last report ${props.params[5].toString()}`}</div>
      <div>{`total debt ${props.params[6].toString()}`}</div>
      <div>{`total gain ${props.params[7].toString()}`}</div>
    </div>
  );
}
