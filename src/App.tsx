// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

import { BaseLayout } from "./components/layouts/BaseLayout";
import { ApplicationRouter } from "./components/routing/AppRouter";
// import { useAppStore } from "./lib/state";

function App() {
  return (
    <BaseLayout>
      <ApplicationRouter />
    </BaseLayout>
  );
}

export default App;
