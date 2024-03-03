import { React } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Userdetails from "./Pages/Userdetails";
import EditUser from "./Pages/EditUser";
import NewUser from "./Pages/NewUser";
import Leads, { ArchiveLeads, CloseLeads } from "./Pages/Leads";
import { LeadsToday as ToDoList } from "./Pages/Leads";
import EditLead from "./Pages/EditLead";
import NewLead from "./Pages/NewLead";
import Keywords from "./Pages/SettingsKeyWords";
import ManageLogo from "./Pages/ManageLogo";
import NewActivation from "./Pages/NewActivation";
import { ClientsLeads } from "./Pages/Clients";
import { EditActivation } from "./Pages/EditActivation";
import { AddTicket } from "./Pages/Ticket";
import { Tickets } from "./Pages/Tickets";
import { EditTicket } from "./Pages/EditTicket";

function AppRoutes() {

  return (
    <Routes>
      <Route exact path='dashboard/' element={< Dashboard />}></Route>
      <Route exact path='users/' element={< Userdetails />}></Route>
      <Route exact path='edituser/' element={< EditUser />}></Route>
      <Route exact path='adduser/' element={< NewUser />}></Route>
      <Route exact path='addticket/' element={< AddTicket />}></Route>
      <Route exact path='keywords/' element={< Keywords />}></Route>
      <Route exact path='leads/' element={< Leads />}></Route>
      <Route exact path='tickets/' element={< Tickets />}></Route>
      <Route exact path='editticket/' element={< EditTicket />}></Route>
      <Route exact path='closeleads/' element={< CloseLeads />}></Route>
      <Route exact path='archiveleads/' element={< ArchiveLeads />}></Route>
      <Route exact path='clientleads/' element={< ClientsLeads />}></Route>
      <Route exact path='createactivation/' element={< NewActivation />}></Route>
      <Route exact path="editactivation" element={< EditActivation />}></Route>
      <Route exact path='todoleads/' element={< ToDoList />}></Route>
      <Route exact path='editlead/' element={< EditLead />}></Route>
      <Route exact path='managelogo/' element={< ManageLogo />}></Route>
      <Route exact path='newlead/' element={< NewLead />}></Route>
    </Routes>
  );
}

export default AppRoutes;
