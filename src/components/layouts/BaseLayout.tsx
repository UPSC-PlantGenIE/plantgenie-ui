import { ReactNode, useEffect } from "react";
import { SelectionMenu } from "../general/Selection";

import styles from "./BaseLayout.module.css";
import { Divider } from "../general/Divider";
import { Link } from "../routing/Link";
import { PairedLeaves, Octocat } from "../../assets/icons";
import { Header } from "./Header";
import { useAppStore } from "../../lib/state";
import {
  EXAMPLE_LISTS,
  GENE_LIST_PREFIX,
  NUMERIC_ID_TO_JBROWSE,
} from "../../lib/constants";
import { GeneList } from "../../lib/api";

interface BaseLayoutProps {
  children?: ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const selectedSpeciesId = useAppStore((state) => state.speciesId);
  const addGeneList = useAppStore((state) => state.addGeneList);

  useEffect(() => {
    EXAMPLE_LISTS.forEach((value) => {
      const exampleListToDelete = localStorage.getItem(
        `${GENE_LIST_PREFIX}-${value.id}`
      );

      if (exampleListToDelete !== null) return;

      const now = new Date().toUTCString();
      const exampleList: GeneList = {
        ...value,
        createdAt: now,
        updatedAt: now,
        lastAccessed: now,
      };
      addGeneList(exampleList);
    });
  });

  return (
    <>
      <Header />
      <div id="nav" role="navigation" className={styles.nav}>
        <div style={{ position: "sticky", top: 0, width: "100%" }}>
          <div className={styles.navMain}>
            <div className={styles.navSelectContainer}>
              <label className={styles.selectLabel}>Selected Species</label>
              <SelectionMenu />
            </div>
            <div className={styles.linkContainer}>
              <Divider />
              <h2 className={styles.linkContainerHeader}>Genomics Tools</h2>
              <Divider />
              <Link
                to="/gene-lists"
                className={styles.links}
                activeClassName={styles.linksActive}
              >
                Gene Lists
              </Link>
              <Link
                to="/exheatmap"
                className={styles.links}
                activeClassName={styles.linksActive}
              >
                Expression Heatmap
              </Link>
              <Link
                to="/blast"
                className={styles.links}
                activeClassName={styles.linksActive}
              >
                BLAST
              </Link>
            </div>
            <div className={styles.linkContainer}>
              <Divider />
              <h2 className={styles.linkContainerHeader}>External Tools</h2>
              <Divider />
              <a
                target="_blank"
                className={styles.links}
                style={{ cursor: "pointer" }}
                href={NUMERIC_ID_TO_JBROWSE[selectedSpeciesId]}
              >
                JBrowse
              </a>
              <a
                target="_blank"
                className={styles.links}
                style={{ cursor: "pointer" }}
                href="https://ortholog-seeker.nbiswebapp.bioshu.se/"
              >
                OrthoSeeker
              </a>
              <a
                target="_blank"
                className={styles.links}
                style={{ cursor: "pointer" }}
                href="https://population-genomics.nbiswebapp.bioshu.se/"
              >
                Spruce SNP Analyzer
              </a>
            </div>
          </div>
          <div className={styles.navFooter}>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                borderBottom: "1px solid var(--color)",
                borderTop: "1px solid var(--color)",
                padding: "0.5em",
              }}
            >
              <div className={styles.navFooterVersionLabel}>
                development version
              </div>
              <div className={styles.navFooterVersionInfo}>
                PlantGenIE version:{" "}
                <span className={styles.versionValue}>
                  {import.meta.env.VITE_APP_VERSION}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="main" className={styles.main}>
        {children ? children : "Main Content"}
      </div>
      <div id="footer" className={styles.footer}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.7em" }}>
            PlantGenIE - UPSC Genome Resources
          </span>
          <span style={{ fontSize: "0.5em" }}>
            ©2025 - Umeå Plant Science Centre
          </span>
        </div>
        <div
          style={{
            display: "flex",
            columnGap: "0.25em",
            color: "var(--color)",
          }}
        >
          <a href="https://github.com/UPSC-PlantGenIE">
            <Octocat fill="var(--color)" height={25} width={25} />
          </a>
          <a href="https://www.upsc.se">
            <PairedLeaves fill="var(--color)" height={25} width={25} />
          </a>
        </div>
      </div>
    </>
  );
};
