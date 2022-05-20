import styles from "../styles/LineItem.module.css";

export default function LineItem(props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.myTitle}</div>
      <div className={styles.value}>{props.myValue}</div>
    </div>
  );
}
