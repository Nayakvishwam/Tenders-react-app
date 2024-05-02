import React from "react";
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Alert, Snackbar, Grid } from '@mui/material';
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import "../js/dashboard.js"
import "../js/todolist.js"
import { Userids, AddUser } from "../apicaller";
import { useEffect, useState, useReducer } from "react";
import { useRef } from "react";
import { DefaultDataTmportNewUser, rights } from "../ImportVariables";
import { GetUserDetails } from "../tools/tools.js";


const NewUser = () => {
    const deafultdata = DefaultDataTmportNewUser
    const setDataMain = (data, action) => {
        return { ...data, ...action }
    }
    const [data, dispatchdata] = useReducer(setDataMain, deafultdata)
    const location = useLocation();
    const [useridsadd, setUserIdsAdd] = useState();
    const addusername = useRef(null);
    const adduserid = useRef(null);
    const adduserpassword = useRef(null);
    const adduserdepart = useRef(null);
    const addusertype = useRef(null);
    const navigate = useNavigate()
    let { userid, token, typeuser } = GetUserDetails()
    let token_ = token;

    useEffect(() => {
        if (!rights.user.typeuser.includes(typeuser)) {
            navigate("/app/dashboard")
        }
        if (location.pathname != "app" || location.pathname != "/") {
            let getUserids = Userids(userid, token_).then((response) => {
                var useridsdata = response.data
                if (useridsdata._code = 200) {
                    dispatchdata({ "userids": useridsdata.data })
                    setUserIdsAdd(true)
                }
            })
        }

    }, [useridsadd])
    const setAlert = (alertdata = {}) => {
        if (alertdata) {
            dispatchdata({ "alertdata": alertdata })
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(deafultdata.alertdata)
    };
    const Adduser = () => {
        if (addusername.current.value && adduserid.current.value && adduserpassword.current.value && addusertype.current.value && adduserdepart.current.value) {
            if (data.userids.includes(adduserid.current.value)) {
                setAlert({ "showAlert": true, "message": "UserId All Ready Exists", "typemessage": "error" })
            }
            else {
                const adduser = AddUser({ "name": addusername.current.value, "loginuserid": userid, "token_": token_, "userid": adduserid.current.value, "depart": adduserdepart.current.value, "password": adduserpassword.current.value, "users": addusertype.current.value }).then((response) => {
                    if (response.data._code = 200) {
                        setAlert({ "showAlert": true, "message": response.data.response, "typemessage": "success" })
                        navigate("/app/users")
                    }
                })
            }
        }
        else {
            setAlert({ "showAlert": true, "message": "Required All User Details", "typemessage": "error" })
        }
    }
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-account"></i>
                        </span> <Link to={"/app/users"} style={{ color: "black", textDecoration: 'none' }}>Users</Link>/New User
                    </h3>
                </div>
                <Grid className="row">
                    <Grid item xs={12} lg={6} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '1180px'
                    }}>
                        <div className="card" style={{ width: "576px" }}>
                            <div className="card-body">
                                <h4 className="card-title btn-gradient-primary" style={{ color: "white", width: 120 }}>CREATE USER</h4>
                                <form className="forms-sample mt-4">
                                    <div className="form-group">
                                        <label for="exampleInputName1"><b>User Name</b></label>
                                        <input type="text" className="form-control" name="username" ref={addusername} id="exampleInputName1" placeholder="Name" />
                                    </div>
                                    <div className="form-group">

                                        <label for="exampleInputEmail3"><b>User Id</b></label>
                                        <input type="text" required className="form-control" ref={adduserid} id="exampleInputUserId" placeholder="User Id" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputPassword4"><b>Password</b></label>
                                        <input type="password" className="form-control" ref={adduserpassword} id="exampleInputPassword4" placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputDepartment"><b>Department</b></label>
                                        <select id="exampleInputDepartment" className="form-control" ref={adduserdepart} required>
                                            <option value="sales">Sales</option>
                                            <option value="custcar">Customer Care</option>
                                            <option value="Techanical">Techanical</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputTypeUser"><b>User Type</b></label>
                                        <select id="exampleInputTypeUser" className="form-control" ref={addusertype} required>
                                            <option value="executive">Executive</option>
                                            <option value="teamlead">Team Leader</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>
                                    <button type="button" onClick={Adduser} className="btn btn-gradient-primary me-2">Submit</button>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            {data.alertdata.showAlert && (
                <Snackbar open={data.alertdata.showAlert} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={data.alertdata.typemessage} sx={{ width: '100%' }}>
                        {data.alertdata.message}
                    </Alert>
                </Snackbar>
            )
            }
        </div>
    )
}

export default NewUser;