import styles from "../styles/RecentSearches.module.css";
import AddressLink from "./addressLink";

export default function RecentSearches(props) {
  const closeButtonPressed = (address) => {
    props.closeButtonPressed(address);
  };

  return props.inputs.length > 0 ? (
    <div>
      <h4 className={styles.header}>Recent Searches</h4>
      <div className={styles.recentContainer}>
        {props.inputs.map((input) => {
          return (
            <AddressLink
              address={input}
              key={input}
              closeButtonPressed={closeButtonPressed}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
}
