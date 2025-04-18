import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import styles from "./GeneSearchResults.module.css";

import { useAppStore } from "../../../lib/state";
import { Form } from "../../../components/routing/Form";
import { GeneList } from "../../../lib/api";

const genUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

export const GeneSearchResultsRoute = () => {
  const speciesId = useAppStore((state) => state.speciesId);
  const searchResults = useAppStore((state) => state.searchResults);
  const addGeneList = useAppStore((state) => state.addGeneList);
  const updateGeneList = useAppStore((state) => state.updateGeneList);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);

  const [selectedGeneListId, setSelectedGeneListId] = useState<
    string | undefined
  >(availableGeneLists.length !== 0 ? availableGeneLists[0].id : undefined);
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
    const formData = new FormData(event.currentTarget);
    const newGeneListName = formData.get("new-gene-list-name")?.toString();

    const selectedGenes = [
      ...new Set(searchResults.filter((_, index) => selectedRows[index])),
    ];

    const now = new Date().toUTCString();

    if (newGeneListName !== undefined && newGeneListName !== "") {
      const newGeneList: GeneList = {
        id: genUniqueId(),
        speciesId: speciesId,
        name: newGeneListName,
        createdAt: now,
        updatedAt: now,
        lastAccessed: now,
        geneIds: selectedGenes.map(
          (value) => `${value.chromosomeId}_${value.geneId}`
        ),
      };

      addGeneList(newGeneList);

      window.history.pushState(
        { name: `/gene-lists/${newGeneList.id}` },
        "",
        `/gene-lists/${newGeneList.id}`
      );

      window.dispatchEvent(
        new PopStateEvent("popstate", {
          state: { name: `/gene-lists/${newGeneList.id}` },
        })
      );
      return;
    } else if (selectedGeneListId !== undefined) {
      const selectedGeneList = availableGeneLists.filter(
        (value) => value.id === selectedGeneListId
      )[0];

      // need to de-duplicate in case gene list already contains search result
      const uniqueGenes = [
        ...new Set([
          ...selectedGeneList.geneIds,
          ...selectedGenes.map(
            (value) => `${value.chromosomeId}_${value.geneId}`
          ),
        ]),
      ];

      updateGeneList({
        ...selectedGeneList,
        updatedAt: now,
        geneIds: uniqueGenes,
      });

      window.history.pushState(
        { name: `/gene-lists/${selectedGeneList.id}` },
        "",
        `/gene-lists/${selectedGeneList.id}`
      );

      window.dispatchEvent(
        new PopStateEvent("popstate", {
          state: { name: `/gene-lists/${selectedGeneList.id}` },
        })
      );
      return;
    }
  };

  return (
    <div id="container" className={styles.searchResultsViewer}>
      <Form
        action="/"
        handleSubmit={handleSubmit}
        className={styles.geneSearchResultDisplay}
      >
        <div className={styles.geneSearchSubmission}>
          <label
            style={{
              fontStyle: "var(--inter)",
              display: "flex",
              flexDirection: "column",
              fontSize: "0.6rem",
              fontWeight: "bold",
              alignItems: "flex-start",
            }}
          >
            New Gene List Name
            <input
              name="new-gene-list-name"
              value={geneListName}
              placeholder="Enter new name..."
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setGeneListName(event.target.value)
              }
              style={{ backgroundColor: "#080808", color: "var(--color)" }}
            />
          </label>
          <label
            style={{
              fontStyle: "var(--inter)",
              display: "flex",
              flexDirection: "column",
              fontSize: "0.6rem",
              fontWeight: "bold",
              alignItems: "flex-start",
            }}
          >
            Or Update Gene List
            <select
              style={{
                paddingRight: "1em",
                textAlign: "left",
                backgroundColor: "var(--background)",
                color: "var(--color)",
                border: "1px solid var(--color)",
                borderRadius: "var(--radius)",
              }}
              onChange={(event) => {
                setSelectedGeneListId(event.target.value);
              }}
              value={selectedGeneListId}
              disabled={availableGeneLists.length === 0}
            >
              {availableGeneLists.filter(
                (value) => value.speciesId === speciesId
              ).length !== 0 ? (
                availableGeneLists
                  .filter((value) => value.speciesId === speciesId)
                  .map((value, index) => (
                    <option key={index} value={value.id}>
                      {value.name}
                    </option>
                  ))
              ) : (
                <option value={undefined}>No gene lists available</option>
              )}
            </select>
          </label>
          <button className={styles.submitButton} type="submit">
            Save
          </button>
        </div>
        <div style={{ width: "100%", overflowX: "auto", display: "grid" }}>
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
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
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
                      <td>{`${value.chromosomeId}_${value.geneId}`}</td>
                      <td>{value.preferredName}</td>
                      <td>{value.description}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
          <div className={styles.searchResultsTableFooter}>
            <span style={{ fontSize: "0.7em" }}>
              {searchResults.length} genes found!
            </span>
          </div>
        </div>
      </Form>
    </div>
  );
};
