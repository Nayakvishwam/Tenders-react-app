import React from "react";
import User from "../images/faces/User.png"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography, Fade } from "@mui/material";
import { Logout } from "../apicaller";
import { ClearLocalStorage, GetUserDetails } from "../tools/tools";
const settings = ['Profile', 'Logout', "Ticket"];


const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();
    const location = useLocation()
    let { userid } = GetUserDetails();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const OpenLead = (leadtype) => {
        navigate("/app/leads", { state: { typelead: leadtype } })
        setAnchorEl(null)
    }
    const ToggleUp = (setting) => {
        if (setting == "Ticket") {
            navigate("/app/addticket")
            return
        }
        else if (setting == "Profile") {
            navigate(`/app/edituser?userid=${userid}`)
        }
        else {
            Logout(userid).then((response) => {
                if (response.data.status_code == 200) {
                    ClearLocalStorage("userid")
                    ClearLocalStorage("auth_token")
                    navigate("/app")
                }
            })
        }
    };

    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <a className="navbar-brand brand-logo" href="#"><img src="assets/images/logo.svg" alt="logo" /></a>
                <a className="navbar-brand brand-logo-mini" href="#"><img src="assets/images/logo-mini.svg" alt="logo" /></a>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={() => {
                    document.body.classList.toggle('sidebar-icon-only')
                }}>
                    <span className="mdi mdi-menu"></span>
                </button>
                {/* <div className="search-field d-none d-md-block">
                </div> */}
                <ul className="navbar-nav navbar-nav-right">
                    {location.pathname != "/app/leads" && location.pathname != "/app/newlead" && (
                        <li className="nav-item nav-logout">
                            <Link className="nav-link count-indicator" to="/app/newlead" data-bs-toggle="dropdown"><i className="mdi mdi-plus-circle menu-icon" style={{ color: "rgb(154, 85, 255)" }}></i></Link>
                        </li>
                    )
                    }
                    {location.pathname != "/app/leads" && location.pathname != "/app/todoleads" && (<li className="nav-item dropdown" style={{ marginRight: 20 }}>
                        <a className="nav-link count-indicator" id="leads" aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick} href="#" data-bs-toggle="dropdown">
                            <i className="mdi mdi-information menu-icon" style={{ color: "rgb(154, 85, 255)" }}></i>
                        </a>
                    </li>)}
                    <li className="nav-item nav-profile dropdown">
                        <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'leads',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            <MenuItem onClick={() => OpenLead('wait')}>Lead</MenuItem>
                            <MenuItem onClick={() => OpenLead('hot')}>Hot</MenuItem>
                            <MenuItem onClick={() => OpenLead('cold')}>Cold</MenuItem>
                            <MenuItem onClick={() => OpenLead('prospect')}>Po</MenuItem>
                        </Menu>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src={User} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" onClick={() => ToggleUp(setting)}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </li>
                    <li className="nav-item d-none d-lg-block full-screen-link">
                        <a className="nav-link">
                            <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
                        </a>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={() => {
                    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
                }}>
                    <span className="mdi mdi-menu"></span>
                </button>
            </div>
        </nav>
    )
}
export default Navbar;