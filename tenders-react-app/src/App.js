import { React } from "react";
import AppRoutes from "./AppRouters";
import Navbar from "./Components/Navbar";
import SideNavbar from "./Components/SideNavbar";
function App() {
  return (
    <div>
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <SideNavbar />
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}

export default App;
