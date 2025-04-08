import styles from "./Root.module.css";

export const Root = () => {
  return (
    <div id="container" className={styles.Root}>
      <h2>Welcome to the PlantGenIE!</h2>
      <div className="border-t border-gray-500"></div>
      <p className="text-center text-lg">
        The PlantGenIE (
        <span className={styles.plantgenieMention}>
          Plant Genome Integrative Explorer
        </span>
        ) is an open source, online platform designed to support genomics and
        transcriptomics research in the plant sciences. It is actively developed
        at the{" "}
        <a
          target="_blank"
          href="https://www.upsc.se"
          className="text-purple-300 visited:text-purple-600 hover:underline hover:text-purple-200"
        >
          Umeå Plant Science Centre
        </a>{" "}
        in Umeå, Sweden. The tools available here allow visualization and
        analysis of genomic data for the following species:
      </p>
      <ul className={styles.speciesList}>
        <li>
          <a target="_blank" href="https://en.wikipedia.org/wiki/Picea_abies">
            <em>Picea abies</em>
            <br />
            (Norway Spruce)
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://en.wikipedia.org/wiki/Pinus_sylvestris"
          >
            <em>Pinus sylvestris</em>
            <br />
            (Scots Pine)
          </a>
        </li>
        <li>
          {/* <li className="p-4 text-center text-lg rounded-sm text-lime-500 ring-2 ring-purple-500 hover:text-lime-600 hover:ring-purple-800 dark:ring-purple-500 dark:hover:ring-purple-300 dark:hover:text-lime-300"> */}
          <a
            target="_blank"
            href="https://en.wikipedia.org/wiki/Populus_tremula"
          >
            <em>Populus tremula</em>
            <br />
            (Common Aspen)
          </a>
        </li>
      </ul>
      <p>
        This application includes both the frontend for user interaction and a
        backend REST API, which can also be queried directly for certain types
        of genomic resources, such as gene annotations, gene expression data and
        sequence data. You can find more information about the available
        endpoints in the{" "}
        <a href="https://plantgenie.upsc.se/api/docs">Swagger UI</a>{" "}
        documentation.
      </p>
      <h3
        style={{
          textAlign: "center",
          color: "var(--color-red-500)",
          paddingTop: "0.5em",
          // textDecoration: "underline"
        }}
      >
        Privacy and Data Collection
      </h3>
      <p>
        This application stores some data (the gene lists you create) locally in
        your browser (using the{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API">
          Web Storage API
        </a>
        ) to help maintain your work session. This data is not stored on our web
        servers, shared, tracked, or linked to any identity, and you can delete
        it at any time via your browser settings.
      </p>
    </div>
  );
};
