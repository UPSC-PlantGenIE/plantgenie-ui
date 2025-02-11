import styles from "./Selection.module.css";

export const SelectionMenu = () => {
  const exampleOptions = [
    { id: 1, name: "Picea abies", img: "/picea-abies-avatar-tiny.png" },
    {
      id: 2,
      name: "Pinus sylvestris",
      img: "/pinus-sylvestris-avatar-tiny.png",
    },
  ];

  return (
    <div className={styles.Selection}>
      <button className={styles.SelectionButton}>
        <span className={styles.SelectedItem}>Selected</span>
        <svg
          className={styles.DropdownIcon}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fillRule="evenodd"
            d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ul>
        {exampleOptions.map((value, index) => (
          <li key={value.id} role="option">
            <img src={value.img} />
            <span>{value.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
