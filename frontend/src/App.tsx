import React from "react";
import Layout from "./layouts/Layout";
import AppRoutes from "./routes";
import ScrollToTopButton from "./components/scrollToTopButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertWindow from "./pages/alert";

const App = () => {
  
  return (
    <>
    <Layout>
      <AppRoutes />
      <ScrollToTopButton />
    </Layout>
    <ToastContainer position="top-center" autoClose={1500} />
    </>
  )
}

export default App;