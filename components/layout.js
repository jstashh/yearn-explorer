import Head from "next/head";
import Header from "./header";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Yearn Explorer</title>
        <meta
          name="description"
          content="Explorer for Yearn vaults and strategies"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title={"Yearn Explorer"} />

      <main className={styles.main}>{children}</main>

      {/* <footer className={styles.footer}>
        <p style={{ userSelect: "none" }}>Powered by Yearn 💙</p>
      </footer> */}
    </div>
  );
}
