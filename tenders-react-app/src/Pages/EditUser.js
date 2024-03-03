import React, { useEffect, useState, useReducer } from "react";
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import { Link } from "react-router-dom";
import { useLocation, Navigate, useSearchParams } from "react-router-dom";
import { UserRes, Userids, UpdateUser } from "../apicaller";
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import "../js/dashboard.js"
import "../js/todolist.js"
import {
    Alert, Grid, Snackbar
} from '@mui/material'
import {
    ImportDepartmentNames, ImportuserTypesDetails,
    UserTypesImport, ImportDepartments,
    ImportEditUserStartDetails
} from "../ImportVariables";
import { GetUserDetails } from "../tools/tools.js";


const EditUser = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const data = {
        "alertdata": { "typemessage": "", "message": "", "showAlert": false },
        "navigateuser": false,
    }
    const setMainData = (maindata, action) => {
        return { ...maindata, ...action }
    }
    const [maindata, dispatchstate] = useReducer(setMainData, data)
    const [userids, setUserIds] = useState([]);
    const [navigate, setNavigate] = useState(false);
    var [userdetails, setUserDetails] = useState(Object());
    var StartDetails = ImportEditUserStartDetails
    var departmentsnames = ImportDepartmentNames
    var usertypesdetails = ImportuserTypesDetails
    var departments = ImportDepartments
    var usertypes = UserTypesImport
    let { userid, token } = GetUserDetails();
    let token_ = token;
    useEffect(() => {
        if (location.pathname != "app" || location.pathname != "/") {
            var edituserid = searchParams.get("userid");
            if (edituserid) {
                let UsersDetails = UserRes(Number(edituserid), token_).then((responseuser) => {
                    var userdata = responseuser.data
                    if (userdata._code == 200) {
                        setUserDetails(userdata.data);
                        Object.keys(StartDetails).map((key) => {
                            if (key != "getusedetailsflag" && StartDetails[key]) {
                                dispatchstate({ [key]: userdata.data[StartDetails[key]] })
                                return
                            }
                            else if (key != "getusedetailsflag") {
                                dispatchstate({ [key]: userdata.data })
                                return
                            }
                            dispatchstate({ [key]: true })
                            return
                        })
                    }
                    else {
                        dispatchstate({ "navigateuser": true });
                    }
                })
                let getUserids = Userids(userid, token_).then((response) => {
                    var userids = response.data
                    if (userids._code = 200) {
                        setUserIds(userids.data)
                    }
                })
            }
            else {
                dispatchstate({ "navigateuser": true });
            }
        }
    }, [navigate]);
    const GetAlertData = (type, message, show) => {
        return { ...maindata.alertdata, ...{ show: show, type: type, message: message } }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatchstate({ "alertdata": GetAlertData("", "", false) });
    };
    const EditUser = () => {
        if (userdetails.userid !== maindata.currentedituserid && userids.includes(userdetails.userid)) {
            dispatchstate({ "alertdata": GetAlertData("error", "User ID Exists", true) });
            return true;
        }
        if (userdetails.username && userdetails.password && userdetails.userid) {
            UpdateUser(userdetails).then((response) => {
                if (response.data._code == 200) {
                    if ([userdetails.id].includes(userid)) {
                        let userdata = GetUserDetails()
                        userdata.username = userdetails.username
                        userdata.typeuser = userdetails.typesuser
                        localStorage.setItem("auth_details", JSON.stringify(userdata))
                    }
                    dispatchstate({ "navigateuser": true });
                }
            });
        }
        else {
            dispatchstate({ "alertdata": GetAlertData("error", "Required All USer Exists", true) });
        }
    }
    return (
        <div className="main-panel">
            {maindata.getusedetailsflag && (
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-account"></i>
                            </span> <Link to={"/app/users"} style={{ color: "black", textDecoration: 'none' }}>Users</Link>/{maindata.editusername}{"(" + userdetails.id + ")"}.
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
                                    <h4 className="card-title btn-gradient-primary" style={{ color: "white", width: 110 }}>USER DETAIL</h4>
                                    <form className="forms-sample">
                                        <div className="form-group">
                                            <label for="exampleInputName1"><b>Id: {userdetails.id}</b></label>
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputName1"><b>User Name</b></label>
                                            <input type="text" onChange={({ target }) => {
                                                setUserDetails(preState => ({
                                                    ...preState,
                                                    username: target.value
                                                }))
                                            }
                                            } value={userdetails.username} className="form-control" name="username" id="exampleInputName1" placeholder="Name" />
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputEmail3"><b>User Id</b></label>
                                            <input type="text" value={userdetails.userid} onChange={({ target }) => {
                                                setUserDetails(preState => ({
                                                    ...preState,
                                                    userid: target.value
                                                }))
                                            }
                                            } required className="form-control" id="exampleInputUserId" placeholder="User Id" />
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputPassword4"><b>Password</b></label>
                                            <input type="password" className="form-control" onChange={({ target }) => {
                                                setUserDetails(preState => ({
                                                    ...preState,
                                                    password: target.value
                                                }))
                                            }
                                            } required value={userdetails.password} id="exampleInputPassword4" placeholder="Password" />
                                            {/* <input type="checkbox" className="form-control"/> */}
                                        </div>
                                        <div className="form-group" key={""}>
                                            <label for="exampleInputDepartment"><b>Department</b></label>
                                            <select id="exampleInputDepartment" className="form-control" required onChange={({ target }) => {
                                                setUserDetails(preState => ({
                                                    ...preState,
                                                    department: target.value
                                                }))
                                            }
                                            }>
                                                {
                                                    departments.map((department) => {
                                                        if (department === maindata.department) {
                                                            return (
                                                                <option value={department} key={department} selected>{departmentsnames[department]}</option>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <option value={department} key={department}>{departmentsnames[department]}</option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputTypeUser"><b>User Type</b></label>
                                            <select id="exampleInputTypeUser" className="form-control" onChange={({ target }) => {
                                                setUserDetails(preState => ({
                                                    ...preState,
                                                    typesuser: target.value
                                                }))
                                            }
                                            } required>
                                                {
                                                    usertypes.map((usertype) => {
                                                        if (usertype === userdetails.typesuser) {
                                                            return (
                                                                <option value={usertype} key={usertype} selected>{usertypesdetails[usertype]}</option>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <option value={usertype} key={usertype}>{usertypesdetails[usertype]}</option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <button type="button" onClick={EditUser} className="btn btn-gradient-primary me-2">Submit</button>
                                        <button className="btn btn-light">Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )}
            {maindata.alertdata.showAlert && (
                <Snackbar open={maindata.alertdata.showAlert} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={maindata.alertdata.typemessage} sx={{ width: '100%' }}>
                        {maindata.alertdata.message}
                    </Alert>
                </Snackbar>
            )}

            {maindata.navigateuser && (
                <Navigate to={"/app/users"} />
            )}
        </div>
    )
}
export default EditUser;