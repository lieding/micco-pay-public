import "./App.scss";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Suspense } from "react";
import { DefaultErrorBoundary } from './components'

function App() {
  return (
    <DefaultErrorBoundary>
      <Suspense fallback="Loading...">
        <RouterProvider router={router} />
      </Suspense>
    </DefaultErrorBoundary>
  );
}

export default App;
