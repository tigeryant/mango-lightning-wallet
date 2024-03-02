import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store, persistor } from "./redux/app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
