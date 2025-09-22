import { useState } from "react";
import styles from "./Selection.module.css";
import { AvailableSpecies, useAppStore } from "../../lib/state";
import { Divider } from "./Divider";

interface Option {
  id: number;
  name: string;
  img: string;
}

const mainSpecies: Array<Option> = [
  { id: 1, name: "Picea abies", img: "/picea-abies-avatar-tiny.png" },
  {
    id: 2,
    name: "Pinus sylvestris",
    img: "/pinus-sylvestris-avatar-tiny.png",
  },
  {
    id: 3,
    name: "Populus tremula",
    img: "/populus-tremula-avatar-tiny.png",
  },
];

const supplementalSpecies: Array<Option> = [
  {
    id: 5,
    name: "Prunus avium",
    img: "/prunus-avium-avatar-tiny.png",
  },
  {
    id: 6,
    name: "Betula pendula",
    img: "/betula-pendula-avatar-tiny.png",
  },
  {
    id: 7,
    name: "Pinus contorta",
    img: "/pinus-contorta-avatar-tiny.png",
  },
];

const options: Array<Option> = [
  { id: 1, name: "Picea abies", img: "/picea-abies-avatar-tiny.png" },
  {
    id: 2,
    name: "Pinus sylvestris",
    img: "/pinus-sylvestris-avatar-tiny.png",
  },
  {
    id: 3,
    name: "Populus tremula",
    img: "/populus-tremula-avatar-tiny.png",
  },
  {
    id: 5,
    name: "Prunus avium",
    img: "/prunus-avium-avatar-tiny.png",
  },
  {
    id: 6,
    name: "Betula pendula",
    img: "/betula-pendula-avatar-tiny.png",
  },
  {
    id: 7,
    name: "Pinus contorta",
    img: "/pinus-contorta-avatar-tiny.png",
  },
];

export const SelectionMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const selectedSpeciesId = useAppStore((state) => state.speciesId);
  const [selected, setSelected] = useState<Option>(options[0]);
  // const [selected, setSelected] = useState<Option>(options.filter((value) => value.id == selectedSpeciesId)[0] ?? options[0]);

  const setSelectedSpeciesId = useAppStore((state) => state.setSpeciesId);
  const setSelectedSpecies = useAppStore((state) => state.setSpecies);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const optionClickedHandler = (id: number) => {
    const foundOption = options.find((item) => item.id === id);
    setSelected(foundOption ?? options[0]);
    // setSelectedOptionId(foundOption ? foundOption.id : options[0].id);
    setSelectedSpecies(
      (foundOption?.name ?? options[0].name) as AvailableSpecies
    );
    setActiveGeneList(undefined);

    setSelectedSpeciesId(foundOption?.id ?? options[0].id);
    setIsOpen(false);
  };

  return (
    <div className={styles.selection}>
      <button onClick={toggleSelect}>
        {/* <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6"> */}
        <span className={styles.selectedItem}>
          {selected.img ? (
            <img
              src={selected.img}
              alt={`${selected.name} avatar`}
              // className="size-5 shrink-0 rounded-full border border-white"
              className={styles.selectedAvatar}
            />
          ) : null}
          <span className="block truncate">{selected.name}</span>
        </span>
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
      <ul tabIndex={-1} role="listbox" hidden={!isOpen}>
        {mainSpecies.map((value) => (
          <li
            key={value.id}
            role="option"
            onClick={() => optionClickedHandler(value.id)}
          >
            <div className={styles.option}>
              <img src={value.img} className={styles.optionAvatar} />
              <span className={styles.optionName}>{value.name}</span>
            </div>
          </li>
        ))}
        <Divider />
        <p className={styles.otherSpeciesLabel}>Other Species</p>
        {supplementalSpecies.map((value) => (
          <li
            key={value.id}
            role="option"
            onClick={() => optionClickedHandler(value.id)}
          >
            <div className={styles.option}>
              <img src={value.img} className={styles.optionAvatar} />
              <span className={styles.optionName}>{value.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
