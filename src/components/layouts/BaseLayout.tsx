import { ReactNode } from "react";
import { SelectionMenu } from "../general/Selection";

import styles from "./BaseLayout.module.css";
import { Divider } from "../general/Divider";
import { Link } from "../routing/Link";

interface BaseLayoutProps {
  children?: ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <div id="nav" role="navigation" className={styles.nav}>
        <div className={styles.navMain}>
          <div className={styles.navSelectContainer}>
            <label className={styles.selectLabel}>Selected Species</label>
            <SelectionMenu />
          </div>
          <div className={styles.linkContainer}>
            <Divider />
            <h2 className={styles.linkContainerHeader}>Genome Tools</h2>
            <Divider />
            <Link
              to="/gene-lists"
              className={styles.links}
              activeClassName={styles.linksActive}
            >
              Gene Lists
            </Link>
            <Link
              to="/jbrowse"
              className={styles.links}
              activeClassName={styles.linksActive}
            >
              JBrowse
            </Link>
            <Link
              to="/blast"
              className={styles.links}
              activeClassName={styles.linksActive}
            >
              BLAST
            </Link>
          </div>
          <div className={styles.linkContainer}>
            <Divider />
            <h2 className={styles.linkContainerHeader}>
              Gene Expression Tools
            </h2>
            <Divider />
            <Link
              to="/exheatmap"
              className={styles.links}
              activeClassName={styles.linksActive}
            >
              Expression Heatmap
            </Link>

            <Link
              to="/"
              className={styles.links}
              activeClassName={styles.linksActive}
            >
              Expression Network
            </Link>
          </div>
        </div>
        <div className={styles.navFooter}>
          <div className={styles.navFooterVersionLabel}>
            development version
          </div>
          <div className={styles.navFooterVersionInfo}>
            <div className={styles.navFooterVersion}>
              PlantGenIE version:{" "}
              <span className={styles.versionValue}>0.1-dev</span>
            </div>
          </div>
        </div>
      </div>
      <div id="header" className={styles.header}>
        Header
      </div>
      <div id="main" className={styles.main}>
        {children ? children : "Main Content"}
      </div>
      <div id="footer" className={styles.footer}>
        Footer
      </div>
    </>
  );
};
