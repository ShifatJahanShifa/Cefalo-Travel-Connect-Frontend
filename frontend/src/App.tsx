import React from "react";
import Layout from "./layouts/Layout";
import AppRoutes from "./routes";

const App = () => {
  
  return (
    // <div>
    //   <div className="bg-amber-200">
    //     <h1> Hello Cefalo Travel connect</h1>
    //   </div>
    // </div> 
    <Layout>
      <AppRoutes />
    </Layout>
  )
}

export default App