import { Link } from "../routing/Link";
import { PairedLeaves } from "../../assets/icons";

import styles from "./Header.module.css";

export const Header = () => {
  return (
    <div id="header" className={styles.header} style={{ padding: "0.15em" }}>
      <div>
        <Link to="/" className={styles.brand}>
          <PairedLeaves width={40} height={40} />
          <h1 style={{ fontFamily: "var(--source)", fontSize: "2em" }}>
            PlantGenIE
          </h1>
        </Link>
      </div>
    </div>
  );
};
