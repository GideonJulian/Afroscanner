// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layouts from "./layouts/Layouts";
import Events from "./pages/Events";
import SingleEvent from "./pages/SingleEvent";
import Register from './pages/Register'
import ProtectedRoute from "./utils/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layouts />
      </ProtectedRoute>
    ),
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
