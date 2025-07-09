import React from "react";
import Layout from "./layouts/Layout";
import AppRoutes from "./routes";
import ScrollToTopButton from "./components/scrollToTopButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  
  return (
    <Layout>
      <AppRoutes />
      <ToastContainer position="top-center" />
      <ScrollToTopButton />
    </Layout>
  )
}

export default App