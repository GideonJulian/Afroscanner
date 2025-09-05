import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layouts from "./layouts/Layouts";
import Events from "./pages/Events";
import SingleEvent from "./pages/SingleEvent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layouts />,
    children: [
      { index: true, element: <Events /> },
      { path: "ticket/:id", element: <SingleEvent /> },
      { path: "scan/:id", element: <SingleEvent /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
