import styles from "../styles/Header.module.css";
import Link from "next/link";

export default function Header(props) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{props.title}</h1>
      <Link href="/">
        <a className={styles.link}>Home</a>
      </Link>
    </div>
  );
}
