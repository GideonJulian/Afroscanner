import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layouts from "./layouts/Layouts";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import SingleTicket from "./pages/SingleTicket";
import Events from "./pages/Events";
import ContactUs from "./pages/ContactUs";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SingleEvent from "./pages/Dashboard/SingleEvent";
import CreateEvent from "./pages/Dashboard/CreateEvent";
import CreateTicket from "./pages/Dashboard/CreateTicket";
import AuthPage from "./pages/Register";
import ProtectedRoute from "./utils/ProtectedRoute";

import { CreateEventProvider } from "./Context/CreateEventContext";
import Products from "./pages/Dashboard/Products";
import CreateProduct from "./pages/Dashboard/CreateProduct";
import SingleProduct from "./pages/Dashboard/SingleProduct";
import TicketsList from "./pages/Dashboard/TicketsList";
import PaymentStatus from "./pages/PaymentStatus";

import SalesDetails from "./components/Dashboard/SalesDetails";
import CheckLayout from "./layouts/CheckLayout";

// 🆕 dummy payment pages
import Payment from "./pages/Payment";
import ContactInfo from "./pages/ContactInfo";
import Comfirmation from "./pages/Comfirmation";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layouts />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <ContactUs /> },
      { path: "ticket/:id", element: <SingleTicket /> },
      { path: "event", element: <Events /> },
    ],
  },
  {
    path: "auth",
    element: <AuthPage />,
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "add-ticket", element: "" },
      { path: "ticket-list", element: <TicketsList /> },
      { path: "sales-details", element: <SalesDetails /> },
      {
        path: "shop",
        children: [
          { index: true, element: <Products /> },
          { path: "create-product", element: <CreateProduct /> },
          { path: "product/:id", element: <SingleProduct /> },
        ],
      },
      { path: "event/:id", element: <SingleEvent /> },
      {
        path: "create-event",
        element: (
          <CreateEventProvider>
            <CreateEvent />
          </CreateEventProvider>
        ),
      },
      {
        path: "event/:id/create-ticket",
        element: (
          <CreateEventProvider>
            <CreateTicket />
          </CreateEventProvider>
        ),
      },
    ],
  },
  {
    path: "payment/:id", // first step (payment details)
    element: <CheckLayout />,
    children: [
      { index: true, element: <Payment /> },
      { path: "contactinfo", element: <ContactInfo /> }, // next step
    ],
  },
  {
    path: "payment-status",
    element: <PaymentStatus />,
  },
  {
    path: "confirmation",
    element: <Comfirmation />,
  },

  // Cart based check out
  {
    path: "checkout",
    element: <CheckLayout />,
    children: [
      { index: true, element: <Payment /> }, // step 1
      { path: "contactinfo", element: <ContactInfo /> }, // step 2
      { path: "confirmation", element: <Comfirmation /> }, // step 3
    ],
  },
  {
    path: "payment-status",
    element: <PaymentStatus />,
  },
]);

function App() {
  return <RouterProvider router={route} />;
}

export default App;
