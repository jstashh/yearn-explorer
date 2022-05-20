import styles from "../styles/Search.module.css";
import icon from "../images/search.svg";
import Image from "next/image";
// import React from "react";

export default function Search(props) {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        // ref={myInput}
        value={props.value}
        placeholder="Search by Address of Strategy / Vault"
        onChange={props.handleOnChange}
        spellCheck={false}
      />
      <button
        type="button"
        className={styles.button}
        onClick={props.buttonPressed}
      >
        <Image src={icon} alt="search" width={25} height={25} />
      </button>
    </div>
  );
}
