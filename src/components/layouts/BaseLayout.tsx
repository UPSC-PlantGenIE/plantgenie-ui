import styles from "./BaseLayout.module.css";

export const BaseLayout = () => {
  return (
    <>
      <div id="nav" role="navigation" className={styles.nav}>Nav</div>
      <div id="header" className={styles.header}>Header</div>
      <div id="main" className={styles.main}>Main content</div>
      <div id="footer" className={styles.footer}>Footer</div>
    </>
  );
};
