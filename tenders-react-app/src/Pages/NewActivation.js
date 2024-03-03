import React, { useState, useEffect, useReducer } from "react";
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import "../js/dashboard.js"
import "../js/todolist.js"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
    Grid, Alert, Snackbar
} from "@mui/material";
import statescities from "../States_Cities.json"
import { ImportPackageActivation, NewActivationImport } from "../ImportVariables.js";
import { GetUserDetails } from "../tools/tools.js";
import { AddActivation, LeadData, Users } from "../apicaller.js";
const NewActivation = () => {
    const navigate = useNavigate()
    let unccessarydata = ["leadtype", "next_follow_date", "keywords", "client_talk_desc"]
    const [searchParams] = useSearchParams();
    const leadid = searchParams.get("leadid");
    let { userid, token } = GetUserDetails();
    let token_ = token;
    const [ActivationFlag, setActivationFlag] = useState(false)
    const setMainState = (mainstate, action) => {
        return { ...mainstate, ...action }
    }
    let alertdata = { "show": false, "type": "", "message": null }
    let setAlertDetails = (show, type, message) => {
        let alrt = alertdata
        alrt.show = show
        alrt.type = type
        alrt.message = message
        dispatchstate({ "alert": alrt })
    }
    const handleClose = () => {
        setAlertDetails(false, "", null)
    }
    const [mainstate, dispatchstate] = useReducer(setMainState, { "users": [], "alert": alertdata });
    const [newlead, setNewLead] = useState(NewActivationImport)
    const setActivationDetails = () => {
        const leadddetail = LeadData(leadid, userid, token_).then((response) => {
            if (response.data._code === 200) {
                let data = response.data.data
                data.status = "pending"
                data.loginuserid = userid
                data._token = token_
                data.bidpack = null
                data.productpack = null
                data.weburl = null
                data.package = null
                data.amountgst = null
                data.paymethod = null
                data.clienttype = null
                data.paymentdetails = null
                data.additional = null
                data.technicalperson = null
                data.expdate = null
                if (leadid) {
                    data.leadid = Number(leadid)
                }
                setNewLead(data)
            }
            else {
                navigate("/app/closeleads")
            }
        })
    }
    const location = useLocation()
    const state = location.state
    useEffect(() => {
        if (leadid) {
            setActivationDetails()
        }
        Users(false, userid, token_).then((response) => {
            dispatchstate({ "users": response.data.data })
        })
        setActivationFlag(true)
    }, [ActivationFlag])

    const states = Object.keys(statescities.meta_data);
    const status_data = {
        satisfied: "Satisfied",
        pending: "Pending",
        active: "Active",
        passive: "Passive",
        expired: "Expired",
        unsatisfied: "Unsatisfied"
    }
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-information"></i>
                        </span>{state && (state.backpath ? <Link to={`/app/clientleads`} style={{ color: "black", textDecoration: 'none' }}>Clients/</Link> : null)}New Activation
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
                                <h4 className="card-title btn-gradient-primary" style={{ color: "white", width: 115 }}>Activation</h4>
                                <form className="forms-sample">
                                    <div className="form-group">
                                        <label for="exampleInputStatus"><b>Status</b></label>
                                        <select style={{ color: "black" }} id="exampleInputStatus" className="form-control" required onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                status: target.value
                                            }))
                                        }} >
                                            {Object.keys(status_data).map((response) => {
                                                if (response == "pending") {
                                                    return <option value={response} selected>{status_data[response]}</option>
                                                }
                                                return <option value={response}>{status_data[response]}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputName1"><b>GSTIN</b></label>
                                        {leadid && (<input type="text" name="gstin" className="form-control" value={newlead.gstin} readOnly id="exampleInputName1" />)}
                                        {!leadid && (<input type="text" name="gstin" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                gstin: target.value
                                            }))
                                        }} id="exampleInputName1" />)}
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleCompanyName"><b>Company Name</b></label>
                                        {leadid && (<input type="text" name="comname" required className="form-control" value={newlead.comname} readOnly id="exampleCompanyName" />)}
                                        {!leadid && (<input type="text" name="comname" required className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                comname: target.value
                                            }))
                                        }} id="exampleCompanyName" />)}
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleContactPerson"><b>Contact Person</b></label>
                                        {leadid && (<input type="text" name="contactpers" className="form-control" value={newlead.contactpers} readOnly id="exampleContactPerson" />)}
                                        {!leadid && (<input type="text" name="contactpers" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                contactpers: target.value
                                            }))
                                        }} id="exampleContactPerson" />)}
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputState"><b>State</b></label>
                                        <select style={{ color: "black" }} id="exampleInputState" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                state: target.value
                                            }))
                                        }} className="form-control">
                                            {!newlead.state && (<option>Select state</option>)}
                                            {states.map((response) => {
                                                if (response == newlead.state) {
                                                    return <option value={response} selected>{response}</option>
                                                }
                                                return <option value={response}>{response}</option>
                                            })}
                                        </select>
                                    </div>
                                    {newlead.state && (<div className="form-group">
                                        <label for="exampleInputCity"><b>City</b></label>
                                        <select style={{ color: "black" }} id="exampleInputCity" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                city: target.value
                                            }))
                                        }}>
                                            {!newlead.city && (<option>Select City</option>)}
                                            {statescities.meta_data[newlead.state] ? statescities.meta_data[newlead.state].map((response) => {
                                                return <option value={response}>{response}</option>
                                            }) : null}
                                        </select>
                                    </div>)}
                                    <div className="form-group">
                                        <label for="exampleAddress"><b>Address</b></label>
                                        {leadid && (<input type="text" className="form-control" name="address" required readOnly value={newlead.address} id="exampleAddress" />)}
                                        {!leadid && (<input type="text" className="form-control" name="address" required onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                address: target.value
                                            }))
                                        }} id="exampleAddress" />)}
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputMobile"><b>Mobile</b></label>
                                        {leadid && (<input type="number" className="form-control" required name="mobile" readOnly value={newlead.mobile} id="exampleInputMobile" />)}
                                        {!leadid && (<input type="number" className="form-control" name="mobile" required onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                mobile: target.value
                                            }))
                                        }} id="exampleAddress" />)}
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputMobile"><b>Bid Pack</b></label>
                                        <input type="number" className="form-control" required name="mobile" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                bidpack: target.value
                                            }))
                                        }} id="examplebidPack" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputMobile"><b>Product Pack</b></label>
                                        <input type="number" className="form-control" required name="mobile" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                productpack: target.value
                                            }))
                                        }} id="exampleproductPack" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleEmail"><b>Email Id</b></label>
                                        {leadid && (<input type="text" className="form-control" required name="email" readOnly value={newlead.email} id="exampleEmail" />)}
                                        {!leadid && (<input type="text" className="form-control" required name="email" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                email: target.value
                                            }))
                                        }} id="exampleEmail" />)}
                                    </div>
                                    <div className="form-group">
                                        <label for="weburl"><b>WebSite Url</b></label>
                                        <input type="text" name="weburldetails" className="form-control" required onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                weburl: target.value
                                            }))
                                        }} id="weburl" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputPackage"><b>Package</b></label>
                                        <select className="form-control" required onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                package: target.value
                                            }))
                                        }} id="exampleInputPackage" >
                                            {!newlead.package && (<option>Select Package</option>)}
                                            {Object.keys(ImportPackageActivation).map((response) => {
                                                return <option value={response}>{ImportPackageActivation[response]}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="amount"><b>Amount (With GST)</b></label>
                                        <input type="number" name="amount" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                amountgst: target.value
                                            }))
                                        }} className="form-control" required id="amount" />
                                    </div>
                                    <div className="form-group">
                                        <label for="paymentmethod"><b>Payment Method</b></label>
                                        <select id="paymentmethod" className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                'paymethod': target.value
                                            }))
                                        }}>
                                            {!newlead.paymethod && (<option>Select Payment Method</option>)}
                                            <option value="check">Check</option>
                                            <option value="dd">Demand Draft</option>
                                            <option value="online">Online</option>
                                            <option value="cash">Cash</option>
                                            <option value="neft">NEFT</option>
                                            <option value="rtgs">RTGS</option>
                                            <option value="upi">UPI</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="clienttype"><b>Client Type</b></label>
                                        <select id="clienttype" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                clienttype: target.value
                                            }))
                                        }} className="form-control" >
                                            {!newlead.clienttype && (<option>Select Client Type</option>)}
                                            <option value="oem">OEM</option>
                                            <option value="re-salers">Re-salers</option>
                                            <option value="service">Service</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="paymentmethod"><b>Payment Details</b></label>
                                        <textarea class="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                paymentdetails: target.value
                                            }))
                                        }} cols="30" rows="10"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label for="InputADDTIONAL"><b>ADDTIONAL</b></label>
                                        <input type="text" name="weburldetails" className="form-control" required onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                additional: target.value
                                            }))
                                        }} id="InputADDTIONAL" />
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputTeleName"><b>Tele Name</b></label>
                                        <select className="form-control" required id="exampleInputTeleName" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                tele_id: target.value
                                            }))
                                        }}>
                                            {!newlead.tele_id && (<option>Select Tele Name</option>)}
                                            {mainstate.users.map((response) => {
                                                return (response.id === newlead.tele_id ?
                                                    <option value={response.id} selected>{response.username}</option> :
                                                    <option value={response.id}>{response.username}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputSalesPerson"><b>Sales Person</b></label>
                                        <select className="form-control" required id="exampleInputSalesPerson" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                sale_person_id: target.value
                                            }))
                                        }}>
                                            {!newlead.sale_person_id && (<option>Select Sales Person</option>)}
                                            {mainstate.users.map((response) => {
                                                return (response.id === newlead.sale_person_id ?
                                                    <option value={response.id} selected>{response.username}</option> :
                                                    <option value={response.id}>{response.username}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputTechnicalPerson"><b>Technical Person</b></label>
                                        <select className="form-control" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                technicalperson: target.value
                                            }))
                                        }} required id="exampleInputTechnicalPerson" >
                                            {!newlead.technicalperson && (<option>Select Technical Person</option>)}
                                            {mainstate.users.map((response) => {
                                                return (
                                                    <option value={response.id}>{response.username}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputexpireddate"><b>Expired Date</b></label>
                                        <input type="date" name="expdate" onChange={({ target }) => {
                                            setNewLead(preState => ({
                                                ...preState,
                                                expdate: target.value
                                            }))
                                        }} className="form-control" required id="exampleInputexpireddate" />
                                    </div>
                                    <button type="button" onClick={() => {
                                        let data = newlead
                                        for (let i = 0; i < unccessarydata.length; i++) {
                                            if (unccessarydata[i].includes("client_talk_desc") && data[unccessarydata[i]] == "") {
                                                delete data[unccessarydata[i]]
                                            }
                                            delete data[unccessarydata[i]];
                                        }
                                        let activationdata = Object.values(data)
                                        if (activationdata.includes(null) || activationdata.includes("")) {
                                            setAlertDetails(true, "error", "Required All Details")
                                            return
                                        }
                                        AddActivation(data).then((response) => {
                                            if (response.data._code == 200) {
                                                setAlertDetails(true, "success", "Add New Client Details Success Fully")
                                            }
                                            if (response.data._code == 500 && response.data.unique) {
                                                setAlertDetails(true, "error", response.data.message)
                                            }
                                        })
                                    }} className="btn btn-gradient-primary me-2">Submit</button>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
            {
                mainstate.alert.show && (
                    <Snackbar open={mainstate.alert.show} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={mainstate.alert.type} sx={{ width: '100%' }}>
                            {mainstate.alert.message}
                        </Alert>
                    </Snackbar>
                )
            }
        </div>
    )
}
export default NewActivation;