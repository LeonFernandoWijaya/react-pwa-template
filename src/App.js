import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./Pages/Index";
import Product from "./Pages/Product";
import ProductDetails from "./Pages/ProductDetails";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const router = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
];

function InactivityHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        navigate("/");
      }, 2 * 60 * 1000); // 2 menit
    };

    // Event yang dianggap aktivitas
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Set timer pertama kali

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <InactivityHandler />
      <Routes>
        {router.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
