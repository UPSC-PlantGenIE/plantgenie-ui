import { MouseEvent, MouseEventHandler } from "react";

import styles from "./GeneLists.module.css";

import { useAppStore } from "../lib/state";

export const GeneListsRoute = () => {
  const geneLists = useAppStore((state) => state.availableGeneLists);

  const handleSearchClick: MouseEventHandler = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    window.history.pushState(
      { name: "/gene-list-curator/search" },
      "",
      "/gene-list-curator/search"
    );
    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: { name: `/gene-list-curator/search` },
      })
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.tableElement}>
        <thead>
          {" "}
          <tr>
            <th>id</th>
            <th>name</th>
            <th>creation date</th>
            <th>last updated</th>
            <th>last accessed?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>my gene list</td>
            <td>dkfjsdklfjsdl</td>
            <td>
              dsfdsfdfdsfdvcnxvbncbcxvbxcnmvbcxmnbvxcmnvbxcnmvbxmnvbxcnvcbxnvbcxmnvbxcmvnbvnmcxbvmnxbvcnmvbnmvbxcm
            </td>
            <td>sdfdsfdsfsdf</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
