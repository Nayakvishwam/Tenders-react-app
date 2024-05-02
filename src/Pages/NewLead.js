import React, { useState, useEffect, useReducer } from "react";
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import "../js/dashboard.js"
import "../js/todolist.js"
import { Link, useNavigate } from "react-router-dom";
import {
    Grid, Alert, Snackbar, Select as select,
    FormControl
} from "@mui/material";
import makeAnimated from 'react-select/animated';
import {
    AddLead, GetKeywords,
    Users, CheckEmailMobileNumberExists
} from "../apicaller";
import statescities from "../States_Cities.json"
import Select from "react-select";
import { ImportLeadType, ImportStatusData, NewLeadObjectImport, BlankDs, rights } from "../ImportVariables";
import { GetUserDetails } from "../tools/tools.js";
const animatedComponents = makeAnimated();

const NewLead = () => {
    let navigate = useNavigate()
    const [users, setUsers] = useState(BlankDs);
    const [selectedkeywords, setSelectedKeywords] = useState(BlankDs);
    const [AddFlag, setAddFlag] = useState(false);
    let { userid, token, typeuser, department } = GetUserDetails();
    let token_ = token;
    const otherdata = {
        "alertdata": Object(),
        "showAlert": false
    }
    const setOtherData = (othermaindata, action) => {
        return { ...othermaindata, ...action }
    }
    const [othermaindata, dispatchotherdata] = useReducer(setOtherData, otherdata)
    const [newlead, setNewLead] = useState(NewLeadObjectImport)
    const leadtype = ImportLeadType
    const [states, setStates] = useState(Object.keys(statescities.meta_data));
    const [keywords, setKeywords] = useState(BlankDs);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const GetSelectedPkg = (value) => {
        let selectedpkg = []
        selectedpkg.push(value)
        return selectedpkg
    }
    const status_data = ImportStatusData
    const AlertApply = (type, message) => {
        dispatchotherdata({ 'alertdata': { type: type, message: message } })
        dispatchotherdata({ 'showAlert': true })
    }
    useEffect(() => {
        if (!rights.addlead[typeuser]?.includes(department) && typeuser != "admin") {
            navigate("/app/dashboard")
            setAddFlag(false)
            return
        } else {
            Users(false, userid, token_).then((response) => {
                setUsers(response.data.data);
            })
            GetKeywords().then((response) => {
                if (response.data._code === 200) {
                    setKeywords(response.data.data)
                }
            })
            setAddFlag(true)
        }
    }, [AddFlag])
    const SaveLeadData = () => {
        var newleadinfo = newlead;
        if (!ValidateEmail(newleadinfo.email)) {
            AlertApply("error", "Invalid Email");
            return
        }
        let keywords_ids = selectedkeywords.map((response) => { return response.value })
        newleadinfo["keyword_ids"] = keywords_ids
        let newleaddata = Object.values(newlead);
        if (newleaddata.includes(null) || newleaddata.includes("")) {
            AlertApply("error", "Required All Details");
            return;
        }
        CheckEmailMobileNumberExists({ "email": newleadinfo.email, "mobile": newleadinfo.mobile, "leadid": null, "gstin": newleadinfo.gstin }).then((responsedata) => {
            let check_exists_data = responsedata.data
            if (check_exists_data._code == 200 && !check_exists_data.exists) {
                AddLead(newleadinfo).then((response) => {
                    if (response.data._code == 200) {
                        AlertApply("success", "SuccesFully Add New Lead Details");
                        return;
                    }
                    else {
                        AlertApply("error", "No Add New Lead Details")
                        return;
                    }
                });
            }
            else {
                AlertApply("error", "Email Id , Mobile Number Or GstNumber Must Be Unique");
                return;
            }
        })
    }
    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatchotherdata({ 'showAlert': false })

    };
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-information"></i>
                        </span><Link to={"/app/leads"} style={{ color: "black", textDecoration: 'none' }}> Leads</Link>/New Lead
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
                                <h4 className="card-title btn-gradient-primary" style={{ color: "white", width: 115 }}>LEAD DETAIL</h4>
                                <form className="forms-sample">
                                    <div className="form-group">
                                        <label for="exampleInputName1"><b>GSTIN</b></label>
                                        <input type="text" name="gstin" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                gstin: target.value
                                            }))
                                        }} className="form-control" id="exampleInputName1" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleCompanyName"><b>Company Name</b></label>
                                        <input type="text" name="comname" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                comName: target.value
                                            }))
                                        }} required className="form-control" id="exampleCompanyName" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleContactPerson"><b>Contact Person</b></label>
                                        <input type="text" name="contactpers" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                contactpers: target.value
                                            }))
                                        }} className="form-control" id="exampleContactPerson" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputMobile"><b>Mobile</b></label>
                                        <input type="number" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                mobile: Number(target.value)
                                            }))
                                        }} required name="mobile" id="exampleInputMobile" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleEmail"><b>Email Id</b></label>
                                        <input type="text" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                email: target.value
                                            }))
                                        }} className="form-control" required name="email" id="exampleEmail" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleAddress"><b>Address</b></label>
                                        <input type="text" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                address: target.value
                                            }))
                                        }} className="form-control" name="address" required id="exampleAddress" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputPinCode"><b>Pincode</b></label>
                                        <input type="number" name="pincode" onChange={({ target }) => {
                                            let _pincode = target.value;
                                            setNewLead(preState => ({
                                                ...preState,
                                                pincode: Number(_pincode)
                                            }))
                                        }} className="form-control" required id="exampleInputPinCode" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputState"><b>State</b></label>
                                        <select id="exampleInputState" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                state: target.value,
                                                city: null
                                            }))
                                        }}>
                                            {!newlead.state && (<option>---- Select State ----</option>)}
                                            {states.map((response) => {
                                                return (newlead.state === response ?
                                                    <option value={response} selected>{response}</option> :
                                                    <option value={response}>{response}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputCity"><b>City</b></label>
                                        <select id="exampleInputCity" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                city: target.value
                                            }))
                                        }}>
                                            {!newlead.city && (<option >---- Select City ----</option>)}
                                            {statescities.meta_data[newlead.state] ?
                                                statescities.meta_data[newlead.state].map(
                                                    (response) => {
                                                        return (newlead.city === response ?
                                                            <option value={response} selected>{response}</option> :
                                                            <option value={response}>{response}</option>)
                                                    }) :
                                                null
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <FormControl sx={{ m: 1, width: 490 }}>
                                            <label for="exampleInputKeyWords"><b>Keywords</b></label>
                                            <Select options={keywords} id="multiple-keywords-label" onChange={(e) => { setSelectedKeywords(e) }} isMulti components={animatedComponents} />
                                        </FormControl>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputStatus"><b>Lead Type</b></label>
                                        <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                leadtype: target.value
                                            }))
                                        }} required >
                                            {!newlead.leadtype && (<option >---- Select Lead Type ----</option>)}
                                            {
                                                Object.keys(leadtype).map((response) => {
                                                    return (response === newlead.status ?
                                                        <option value={response} selected>{leadtype[response]}</option> :
                                                        <option value={response}>{leadtype[response]}</option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputStatus"><b>Status</b></label>
                                        <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                status: target.value
                                            }))
                                        }} required >
                                            {!newlead.status && (<option >---- Select Status ----</option>)}
                                            {
                                                Object.keys(status_data).map((response) => {
                                                    return (response === newlead.status ?
                                                        <option value={response} selected>{status_data[response]}</option> :
                                                        <option value={response}>{status_data[response]}</option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputTeleName"><b>Tele Name</b></label>
                                        <select className="form-control" onChange={({ target }) => {
                                            if (!isNaN(target.value)) {
                                                setNewLead(preState => ({
                                                    ...preState,
                                                    tele_id: target.value
                                                }))
                                                return
                                            }
                                        }} required id="exampleInputTeleName">
                                            {!newlead.tele_id && (<option>---- Select Tele Name ----</option>)}
                                            {
                                                users.map((response) => {
                                                    if (response.typesuser == "executive") {
                                                        return (
                                                            <option value={response.id}>{response.username}</option>)
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputSalesPerson"><b>Sales Person</b></label>
                                        <select className="form-control" onChange={({ target }) => {
                                            if (!isNaN(target.value)) {
                                                setNewLead(preState => ({
                                                    ...preState,
                                                    sale_person_id: target.value
                                                }))
                                                return
                                            }
                                        }} required id="exampleInputSalesPerson" >
                                            {!newlead.sale_person_id && (<option>---- Select Sales Person ----</option>)}
                                            {users.map((response) => {
                                                if (response.department == "sales") {
                                                    return (
                                                        <option value={response.id}>{response.username}</option>
                                                    )
                                                }
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputPackage"><b>Package</b></label>
                                        <select className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                selectedpackages: GetSelectedPkg(target.value)
                                            }))
                                        }} required id="exampleInputPackage" >
                                            {newlead.selectedpackages.length == 0 && (<option>---- Select Packages ----</option>)}
                                            {Object.keys(newlead.package).map((response) => {
                                                return (
                                                    <option value={response}>{newlead.package[response]}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <button type="button" className="btn btn-gradient-primary me-2" onClick={SaveLeadData}>Submit</button>
                                    <button className="btn btn-light" onClick={() => {
                                        navigate("/app/leads")
                                    }}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
            {othermaindata.showAlert && (
                <Snackbar open={othermaindata.showAlert} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={othermaindata.alertdata.type} sx={{ width: '100%' }}>
                        {othermaindata.alertdata.message}
                    </Alert>
                </Snackbar>
            )}
        </div>
    )
}
export default NewLead;