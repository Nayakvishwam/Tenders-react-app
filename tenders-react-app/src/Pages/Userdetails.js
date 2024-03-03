import React, { useEffect, useState } from "react";
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import { Link } from "react-router-dom";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from '@mui/material'
import { Users, RemoveUsers } from "../apicaller";
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import "../js/dashboard.js"
import "../js/todolist.js"
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle
} from "@mui/material";
import { GetUserDetails, PageLoad } from "../tools/tools";




const Userdetails = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const [removeuser, SetRemoveUser] = useState(false);
    const [removeuserid, SetRemoveUserId] = useState(0);
    const [adduser, setAddUser] = useState(false);
    const [edituser, SetEditUser] = useState(false);
    const [edituserid, SetEditUserId] = useState(0);
    const [usedetailsflag, setUserFlag] = useState(false);
    const [userdetails, setUserDetails] = useState([]);
    const [showData, setShowData] = useState({});
    const [conditionlogin, setConditionLogin] = useState(false);

    var usertypesdetails = {
        "executive": "Executive",
        "teamlead": "Team Leader",
        "manager": "Manager"
    }


    var departmentsnames = {
        "sales": "Sales",
        "custcar": "Customer Care",
        "Techanical": "Techanical"
    }


    useEffect(() => {
        let {userid,token}=GetUserDetails()
        let token_ = token
        if (userid) {
            setConditionLogin(true)
            if (location.pathname != "app" || location.pathname != "/") {
                let UsersDetails = Users(false, userid, token_).then((responseuser) => {
                    var userdata = responseuser.data
                    if (userdata._code == 200) {
                        setUserDetails(userdata.data)
                        setUserFlag(true)
                    }
                })
            }
        }
        else {
            setConditionLogin(true);
        }
    }, [usedetailsflag])
    const RemoveUser = (id) => {
        SetRemoveUser(true)
        SetRemoveUserId(id)
    }
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowData({ "show": false, "type": "", "message": "" })
    };
    const handleClose = (remove = false) => {
        if (remove === true) {
            var RemoveuserDetails = RemoveUsers(removeuserid).then((response) => {
                if (response.data._code == 200) {
                    let logged_user_id = localStorage.getItem("userid")
                    var updateusersdetails = userdetails.filter((response) => response.id != removeuserid)
                    if (Number(logged_user_id) === removeuserid) {
                        localStorage.clear();
                        PageLoad(true)
                    }
                    setUserDetails(updateusersdetails);
                    setShowData({ "show": true, "type": "success", "message": "Remove users details" })
                }
                if (response.data.unique) {
                    setShowData({ "show": true, "type": "error", "message": "This user already assign to other leads" })
                }
            })
        }
        SetRemoveUser(false);
    };
    const EditUser = (id) => {
        SetEditUserId(id);
        SetEditUser(true);
    }
    const CreateUser = () => {
        setAddUser(true);
    }
    return (
        <div className="main-panel">
            {conditionlogin && (<div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-account"></i>
                        </span> Users
                    </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"><button type="button" onClick={CreateUser} className="btn btn-gradient-primary btn-fw">Create</button></li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Recent Tickets</h4>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th> User Name </th>
                                                <th> User Id  </th>
                                                <th> Password </th>
                                                <th> Department </th>
                                                <th> Type User </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usedetailsflag && (userdetails.map(((response) => {
                                                return (<tr key={response.userid}>
                                                    <td>
                                                        {response.username}
                                                    </td>
                                                    <td>{response.userid}</td>
                                                    <td>
                                                        <label className="badge badge-gradient-success">{response.password}</label>
                                                    </td>
                                                    <td> {departmentsnames[response.department]}</td>
                                                    <td> {usertypesdetails[response.typesuser]} </td>
                                                    <th><Link onClick={() => EditUser(response.id)}><i className="mdi mdi-pencil"></i></Link>&nbsp;&nbsp;&nbsp;
                                                        <Link onClick={() => { RemoveUser(response.id) }}><i className="mdi mdi-delete"></i></Link></th>
                                                </tr>)
                                            })))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
            {removeuser && (
                <div>
                    <Dialog
                        open={RemoveUser}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are You Sure! Want To Remove This User Detail?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={handleClose}>No</Button>
                            <Button onClick={() => handleClose(true)} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            {showData.show && (
                <Snackbar open={showData.show} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity={showData.type} sx={{ width: '100%' }}>
                        {showData.message}
                    </Alert>
                </Snackbar>
            )}
            {adduser && (
                <Navigate to={"/app/adduser"} />
            )}
            {edituser && (
                <Navigate to={`/app/edituser?userid=${edituserid}`} />
            )}
        </div>

    )
}
export default Userdetails;