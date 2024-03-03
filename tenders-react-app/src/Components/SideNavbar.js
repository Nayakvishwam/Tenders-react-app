import React, { useState } from "react";
import User from "../images/faces/User.png"
import { Link } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { GetUserDetails, PathActive } from "../tools/tools";
import { ImportuserTypesDetails } from "../ImportVariables";

const SideNavbar = () => {
    let { username,
        typeuser } = GetUserDetails()
    const [OpenChildMenu, setOpenChildMenu] = useState({})
    username = username.length > 20 ? username.slice(0, 17) + "..." : username;

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item nav-profile">
                    <Link href="#" className="nav-link">
                        <div className="nav-profile-image">
                            <img src={User} alt="profile" />
                            <span className="login-status online"></span>
                        </div>
                        <div className="nav-profile-text d-flex flex-column">
                            <span className="font-weight-bold mb-2">{username}</span>
                            <span className="text-secondary text-small">{ImportuserTypesDetails[typeuser]}</span>
                        </div>
                        <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
                    </Link>
                </li>
                <li className={PathActive("/app/dashboard") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/app/dashboard">
                        <span className="menu-title" style={{ color: "#9a55ff" }}>Dashboard</span>
                        <i className="mdi mdi-home menu-icon" style={{ color: "#9a55ff" }}></i>
                    </Link>
                </li>
                <li className={PathActive("/app/users") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/app/users">
                        <span className="menu-title" style={{ color: "#9a55ff" }}>Manage Users</span>
                        <i className="mdi mdi-account menu-icon" style={{ color: "#9a55ff" }}></i>
                    </Link>
                </li>
                <li className={PathActive("/app/leads") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/app/leads">
                        <span className="menu-title" data-bs-toggle="collapse" style={{ color: "#9a55ff" }}>Leads</span>
                        <i className="mdi mdi-information menu-icon" style={{ color: "#9a55ff" }}></i>
                    </Link>
                </li>
                <li className={PathActive("/app/todoleads") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/app/todoleads" state={{ "page": "todolist" }}>
                        <span className="menu-title" data-bs-toggle="collapse" style={{ color: "#9a55ff" }}>
                            MyToDoList
                        </span>
                        <i className="mdi mdi-ticket-account menu-icon" style={{ color: "#9a55ff" }}></i>
                    </Link>
                </li>
                <li className={"nav-item"}>
                    <div className={OpenChildMenu.activation ? "nav-link menu-expanded" : "nav-link"} data-toggle="collapse">
                        <span className="menu-title" data-bs-toggle="collapse" style={{ color: "#9a55ff" }} onClick={() => {
                            setOpenChildMenu(prestate => ({
                                ...prestate,
                                activation: OpenChildMenu.activation ? false : true
                            }))
                        }}>
                            Technical
                        </span>
                        <i className="menu-arrow"></i>
                        <i className="mdi mdi-account-switch menu-icon" style={{ color: "#9a55ff" }}></i>
                    </div>
                    <Collapse in={OpenChildMenu.activation} className="nav-item">
                        <ul className={"nav flex-column sub-menu"}>
                            <li className="nav-item">
                                <Link className={PathActive("/app/closeleads") ? "nav-link active" : "nav-link"} to="/app/closeleads">
                                    Close
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={PathActive("/app/clientleads") ? "nav-link active" : "nav-link"} to="/app/clientleads">
                                    Clients
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={PathActive("/app/createactivation") ? "nav-link active" : "nav-link"} to="/app/createactivation">
                                    Activation
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={PathActive("/app/tickets") ? "nav-link active" : "nav-link"} to="/app/tickets">
                                    Tickets
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>
                <li className={OpenChildMenu.Settings ? "nav-item active" : "nav-item"}>
                    <div className={OpenChildMenu.Settings ? "nav-link menu-expanded" : "nav-link"} data-toggle="collapse">
                        <span className="menu-title" style={{ color: "#9a55ff" }} onClick={() => {
                            setOpenChildMenu(prestate => ({
                                ...prestate,
                                Settings: OpenChildMenu.Settings ? false : true
                            }))
                        }}>Settings</span>
                        <i className="menu-arrow"></i>
                        <i className="mdi mdi-settings menu-icon" style={{ color: "#9a55ff" }}></i>
                    </div>
                    <Collapse in={OpenChildMenu.Settings} className="nav-item">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                <Link className={PathActive("/app/keywords") ? "nav-link active" : "nav-link"} to="/app/keywords">
                                    Keywords
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={PathActive("/app/managelogo") ? "nav-link active" : "nav-link"} to="/app/managelogo">
                                    Manage Website
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={PathActive("/app/archiveleads") ? "nav-link active" : "nav-link"} to="/app/archiveleads">
                                    Archive Leads
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>
            </ul>
        </nav>)
}
export default SideNavbar