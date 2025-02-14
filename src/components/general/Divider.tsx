import styles from "./Divider.module.css";

export const Divider = () => {
  return (
    <div
      className={styles.divider}
      style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}
    ></div>
  );
};
