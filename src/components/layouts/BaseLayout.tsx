import { ReactNode } from "react";
import styles from "./BaseLayout.module.css";

interface BaseLayoutProps {
  children?: ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <div id="nav" role="navigation" className={styles.nav}>
        Nav
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
