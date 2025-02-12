import { useState } from "react";
import styles from "./Selection.module.css";

interface Option {
  id: number;
  name: string;
  img: string;
}

const options: Array<Option> = [
  { id: 1, name: "Picea abies", img: "/picea-abies-avatar-tiny.png" },
  {
    id: 2,
    name: "Pinus sylvestris",
    img: "/pinus-sylvestris-avatar-tiny.png",
  },
];

export const SelectionMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option>(options[0]);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const optionClickedHandler = (id: number) => {
    const foundOption = options.find((item) => item.id === id);
    setSelected(foundOption ?? options[0]);
    // setSelectedOptionId(foundOption ? foundOption.id : options[0].id);
    setIsOpen(false);
  };

  return (
    <div className={styles.Selection}>
      <button onClick={toggleSelect}>
        <div id="selected-item" className={styles.selectedItem}>
          {selected.img ? <img src={selected.img} /> : null}
          <span id="selected-name">{selected.name}</span>
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
        </div>
      </button>
      <ul tabIndex={-1} role="listbox" hidden={!isOpen}>
        {options.map((value, index) => (
          <li
            key={value.id}
            role="option"
            onClick={() => optionClickedHandler(value.id)}
          >
            <img src={value.img} />
            <span>{value.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
