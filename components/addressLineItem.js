import styles from "../styles/LineItem.module.css";

export default function LineItem(props) {
  if (!props.address) {
    return <></>;
  }
  const address = `${props.address.substring(0, 6)}...${props.address.substring(
    props.address.length - 4
  )}`;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.myTitle}</div>
      {/* <div className={styles.address}>{address}</div> */}
      <a
        href={`https://ftmscan.com/address/${props.address}`}
        className={styles.explorerLink}
      >
        {address}
      </a>
    </div>
  );
}
