import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import styles from "./GeneSearchResults.module.css";

import { useAppStore } from "../../../lib/state";
import { Form } from "../../../components/routing/Form";

export const GeneSearchResultsRoute = () => {
  const searchResults = useAppStore((state) => state.searchResults);
  const addGeneList = useAppStore((state) => state.addGeneList);
  const updateGeneList = useAppStore((state) => state.updateGeneList);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);

  const [selectedGeneListId, setSelectedGeneListId] = useState<
    string | undefined
  >(availableGeneLists[0].id ?? undefined);
  const [geneListName, setGeneListName] = useState<string>("");

  const [selectedRows, setSelectedRows] = useState<boolean[]>(
    new Array(searchResults.length).fill(true)
  );

  // Tracks whether the "select all" checkbox should be checked
  const [selectAll, setSelectAll] = useState(true);

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const allSelected = selectedRows.every((isSelected) => isSelected);
    const someSelected = selectedRows.some((isSelected) => isSelected);

    setSelectAll(allSelected);

    // Indeterminate state logic
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = !allSelected && someSelected;
    }
  }, [selectedRows]);

  const handleRowCheckboxChange = (index: number) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);
  };

  const handleHeaderCheckboxChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedRows(new Array(searchResults.length).fill(newSelectAll));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("blah");
    const formData = new FormData(event.currentTarget);
    const newGeneListName = formData.get("new-gene-list-name");
    console.log(newGeneListName);
  };

  return (
    <div id="container" className={styles.searchResultsViewer}>
      <div className={styles.tableWrapper}>
        <Form action="/" handleSubmit={handleSubmit}>
          <div className={styles.tableElement}>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleHeaderCheckboxChange}
                      ref={headerCheckboxRef}
                    />
                  </th>
                  <th>Chromosome ID</th>
                  <th>Gene ID</th>
                  {/* <th>Alias</th> */}
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0
                  ? searchResults.map((value, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows[index]}
                            onChange={() => handleRowCheckboxChange(index)}
                          />
                        </td>
                        <td>{value.chromosomeId}</td>
                        <td>{value.geneId}</td>
                        {/* <td><input /></td> */}
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
            <div>{searchResults.length} genes</div>
            <label>
              New Gene List Name:{" "}
              <input
                name="new-gene-list-name"
                value={geneListName}
                placeholder="Enter new name..."
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setGeneListName(event.target.value)
                }
              />
            </label>
            <label>
              Or Update Gene List:{" "}
              <select
                onChange={(event) => {
                  setSelectedGeneListId(event.target.value);
                  console.log(event.target.value);
                }}
                value={selectedGeneListId}
                disabled={availableGeneLists.length === 0}
              >
                {availableGeneLists.length !== 0 ? (
                  availableGeneLists.map((value, index) => (
                    <option key={index} value={value.id}>
                      {value.name}
                    </option>
                  ))
                ) : (
                  <option value={undefined}>No gene lists available</option>
                )}
              </select>
            </label>
            <button type="submit">submit</button>
          </div>
        </Form>
      </div>
    </div>
  );
};
