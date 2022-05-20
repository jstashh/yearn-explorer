import Link from "next/link";
import Image from "next/image";
import styles from "../styles/AddressLink.module.css";
import icon from "../images/close.svg";

export default function AddressLink(props) {
  const buttonPressed = () => {
    props.closeButtonPressed(props.address);
  };

  return (
    <div className={styles.container}>
      <Link href={`/address/${props.address}`}>
        <div className={styles.containerLinkContainer}>
          <a className={styles.recentLink}>{props.address}</a>
          <br />
        </div>
      </Link>
      <button type="button" className={styles.button} onClick={buttonPressed}>
        <Image src={icon} alt="close" width={15} height={15} />
      </button>
    </div>
  );
}
