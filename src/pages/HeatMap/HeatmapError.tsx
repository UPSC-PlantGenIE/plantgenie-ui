export const NoGeneListsErrorComponent = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: "bold" }}>
        There are no gene lists available to present a heatmap.
      </p>
      <p>Please create one from the Gene Lists menu option to the left.</p>
    </div>
  );
};
