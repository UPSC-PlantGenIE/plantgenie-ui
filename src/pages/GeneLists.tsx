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

  // return (
  //   <div className={styles.GeneLists}>
  //     {/* <div className={styles.tableWrapper}> */}
  //       <table>
  //         <thead>
  //           <tr>
  //             <th>id</th>
  //             <th>name</th>
  //             <th>creation date</th>
  //             <th>last updated?</th>
  //             <th>last accessed?</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {geneLists.length > 0
  //             ? geneLists.map((value, index) => (
  //                 <tr key={index}>
  //                   <td>{value.id}</td>
  //                   <td>{value.name}</td>
  //                   <td>{value.createdAt}</td>
  //                   <td>{value.updatedAt}</td>
  //                   <td>{value.lastAccessed}</td>
  //                 </tr>
  //               ))
  //             : null}
  //         </tbody>
  //       </table>
  //     {/* </div> */}
  //   </div>
  // );

  return (    <div className={styles.tableWrapper}>
    <table className={styles.tableElement}>
      <thead>      <tr>
        <th>id</th>
        <th>name</th>
        <th>creation date</th>
        <th>last updated</th>
        <th>last accessed?</th>
      </tr></thead>
      <tbody>
        <tr>
          <td>
            1
          </td>
          <td>
            my gene list
          </td>
          <td>dkfjsdklfjsdl</td>
          <td>dsfdsfdfdsfdvcnxvbncbcxvbxcnmvbcxmnbvxcmnvbxcnmvbxmnvbxcnvcbxnvbcxmnvbxcmvnbvnmcxbvmnxbvcnmvbnmvbxcm</td>
          <td>sdfdsfdsfsdf</td>
        </tr>
      </tbody>
    </table>
    </div>)
};
