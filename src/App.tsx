import "./App.css";

import { BaseLayout } from "./components/layouts/BaseLayout";
import { ApplicationRouter } from "./components/routing/AppRouter";

function App() {
  return (
    <BaseLayout>
      <ApplicationRouter />
    </BaseLayout>
  );
}

export default App;
