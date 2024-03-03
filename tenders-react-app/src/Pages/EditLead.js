import { React, useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
    LeadData, ModifyLead, Users,
    GetKeywords, GetKeywordsOfLead,
    KeywordsName, LeadHistoryStatus, CheckEmailMobileNumberExists
} from "../apicaller";
import {
    Grid, Alert, Snackbar
} from "@mui/material";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import statescities from "../States_Cities.json"
import { GetUserDetails, PassBaseCss } from "../tools/tools";
import {
    ImportLeadType, ImportEditLeadChiefData,
    ImportPackage, ImportStatusData,
    BlankDs, ImportTagsBasedStatusEditLead
} from "../ImportVariables"
const animatedComponents = makeAnimated();

const EditLead = () => {
    let location = useLocation()
    let maindata = ImportEditLeadChiefData
    const leadtype = ImportLeadType
    let packages = ImportPackage
    const setMainState = (mainstate, action) => {
        return { ...mainstate, ...action }
    }
    const [mainstate, dispatchstate] = useReducer(setMainState, maindata);
    const [keywords, setKeywords] = useState(BlankDs)
    const [selectedkeywords, setSelectedKeywords] = useState(BlankDs)
    const [historiesdetails, setHistoriesDetails] = useState(BlankDs)
    const [showeditpage, setShowEditPage] = useState(false)
    const [leaddata, setLeadData] = useState(Object());
    const [searchParams] = useSearchParams();
    const leadid = searchParams.get("leadid");
    const navigate = useNavigate();
    const status_data = ImportStatusData
    const getheight = PassBaseCss(400, 158, 46, historiesdetails.length);
    let { userid, token } = GetUserDetails();
    let token_ = token;
    const [states, setStates] = useState(BlankDs);
    const SetHistoryDetails = (leadid, userid, token) => {
        LeadHistoryStatus(leadid, userid, token).then((response) => {
            if (response.data._code === 200) {
                setHistoriesDetails(response.data.data)
            }
        })
    }
    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    const ConditionalRenderForm = () => {
        return (
            <>
                <form className="forms-sample">{location.state.backpath != "/app/closeleads" ? (
                    <>
                        <div className="form-group row" style={{ marginBottom: -1 }}>
                            <label for="exampleInputName1" className="col-sm-5 col-form-label"><b>GSTIN</b></label>
                            <div class="col-sm-7">
                                <input type="text" value={leaddata.gstin} onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        gstin: target.value
                                    }))
                                }} className="form-control" id="exampleInputName1" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -1 }}>
                            <label for="exampleCompanyName" className="col-sm-5 col-form-label"><b>Company Name</b></label>
                            <div class="col-sm-7">
                                <input type="text" value={leaddata.comname} onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        comname: target.value
                                    }))
                                }} required className="form-control" id="exampleCompanyName" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -1 }}>
                            <label for="exampleContactPerson" className="col-sm-5 col-form-label"><b>Contact Person</b></label>
                            <div class="col-sm-7">
                                <input type="text" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        contactpers: target.value
                                    }))
                                }} required value={leaddata.contactpers} id="exampleContactPerson" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -1 }}>
                            <label for="exampleInputMobile" className="col-sm-5 col-form-label"><b>Mobile</b></label>
                            <div class="col-sm-7">
                                <input type="number" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        mobile: target.value
                                    }))
                                }} required value={leaddata.mobile} id="exampleInputMobile" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -1 }} >
                            <label for="exampleEmail" className="col-sm-5 col-form-label"><b>Email Id</b></label>
                            <div class="col-sm-7">
                                <input type="text" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        email: target.value
                                    }))
                                }} required value={leaddata.email} id="exampleEmail" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -1 }}>
                            <label for="exampleAddress" className="col-sm-5 col-form-label"><b>Address</b></label>
                            <div class="col-sm-7">
                                <input type="text" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        address: target.value
                                    }))
                                }} required value={leaddata.address} id="exampleAddress" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -1 }}>
                            <label for="exampleInputPinCode" className="col-sm-5 col-form-label"><b>Pincode</b></label>
                            <div class="col-sm-7">
                                <input type="number" className="form-control" onChange={({ target }) => {
                                    let _pincode = Number(target.value);
                                    setLeadData(preState => ({
                                        ...preState,
                                        pincode: _pincode
                                    }))
                                }} required value={leaddata.pincode} id="exampleInputPinCode" />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -20 }}>
                            <label for="exampleInputState" className="col-sm-5 col-form-label"><b>State</b></label>
                            <div class="col-sm-7">
                                <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        state: target.value
                                    }))
                                }}>
                                    {states.map((response) => {
                                        return (leaddata.state === response ?
                                            <option value={response} selected>{response}</option> :
                                            <option value={response}>{response}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -20 }}>
                            <label for="exampleInputCity" className="col-sm-5 col-form-label"><b>City</b></label>
                            <div class="col-sm-7">
                                <select id="exampleInputCity" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        city: target.value
                                    }))
                                }} className="form-control">
                                    {statescities.meta_data[leaddata.state] ? statescities.meta_data[leaddata.state].map((response) => {
                                        return (leaddata.city === response ?
                                            <option value={response} selected>{response}</option> :
                                            <option value={response}>{response}</option>)
                                    }) : null}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="multiple-keywords-label" className="col-sm-5 col-form-label"><b>Keywords</b></label>
                            <div class="col-sm-7">
                                <Select options={keywords} id="multiple-keywords-label" onChange={(e) => { setSelectedKeywords(e) }} defaultValue={selectedkeywords} isMulti components={animatedComponents} />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -20 }}>
                            <label for="exampleInputStatus" className="col-sm-5 col-form-label"><b>Status</b></label>
                            <div class="col-sm-7">
                                <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        status: target.value
                                    }))
                                }} required > {
                                        Object.keys(status_data).map((response) => {
                                            return (response === leaddata.status ?
                                                <option value={response} selected>{status_data[response]}</option> :
                                                <option value={response}>{status_data[response]}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -20 }}>
                            <label for="exampleLeadType" className="col-sm-5 col-form-label"><b>Lead Type</b></label>
                            <div class="col-sm-7">
                                <select id="exampleLeadType" className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        leadtype: target.value
                                    }))
                                }} required > {
                                        Object.keys(leadtype).map((response) => {
                                            return (response === leaddata.leadtype ?
                                                <option value={response} selected>{leadtype[response]}</option> :
                                                <option value={response}>{leadtype[response]}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -20 }}>
                            <label for="exampleInputTeleName" className="col-sm-5 col-form-label"><b>Tele Name</b></label>
                            <div class="col-sm-7">
                                <select className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        tele_id: target.value
                                    }))

                                }} required id="exampleInputTeleName" >
                                    {mainstate.users.map((response) => {
                                        return (response.id === leaddata.tele_id ?
                                            <option value={response.id} selected>{response.username}</option> :
                                            <option value={response.id}>{response.username}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginBottom: -20 }}>
                            <label for="exampleInputSalesPerson" className="col-sm-5 col-form-label"><b>Sales Person</b></label>
                            <div class="col-sm-7">
                                <select className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        sale_person_id: target.value
                                    }))

                                }} required id="exampleInputSalesPerson" >
                                    {mainstate.users.map((response) => {
                                        return (response.id === leaddata.sale_person_id ?
                                            <option value={response.id} selected>{response.username}</option> :
                                            <option value={response.id}>{response.username}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="exampleInputPackage" className="col-sm-5 col-form-label"><b>Package</b></label>
                            <div class="col-sm-7">
                                <select className="form-control" onChange={({ target }) => {
                                    setLeadData(preState => ({
                                        ...preState,
                                        package: target.value
                                    }))
                                }} required id="exampleInputPackage">
                                    {Object.keys(packages).map((response) => {
                                        if (response == leaddata.package) {
                                            return (
                                                <option value={response} selected>{packages[response]}</option>
                                            )
                                        }
                                        return (
                                            <option value={response}>{packages[response]}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <button type="button" style={{ marginBottom: 7 }} onClick={() => {
                            let lead = leaddata;
                            if (!ValidateEmail(lead.email)) {
                                dispatchstate({ "alertdata": GetAlertData("error", "Invalid Email", true) })
                                return
                            }
                            let keywords_ids = selectedkeywords.map((response) => { return response.value })
                            lead["keywords_ids"] = keywords_ids
                            CheckEmailMobileNumberExists({ "email": lead.email, "mobile": lead.mobile, "leadid": leadid, "gstin": lead.gstin }).then((responsedata) => {
                                let check_exists_data = responsedata.data
                                if (check_exists_data._code == 200 && !check_exists_data.exists) {
                                    ModifyLead(lead).then((response) => {
                                        let data = response.data
                                        if (data._code === 200) {
                                            dispatchstate({ "alertdata": GetAlertData("success", "Update Lead Detail SuccessFully", true) })
                                        }
                                        else {
                                            dispatchstate({ "alertdata": GetAlertData("error", data.message, true) })
                                        }
                                    })
                                }
                                else {
                                    dispatchstate({ "alertdata": GetAlertData("error", "Email OR Mobile Number OR GSTIN Already Exists!", true) })
                                }
                            })
                        }} className="btn btn-gradient-primary me-2">Submit</button>
                        <button className="btn btn-light" style={{ marginBottom: 7 }} onClick={() => {
                            navigate(location.state ? location.state.backpath : "/app/leads")
                        }}>Cancel</button>
                    </>
                ) : (<>
                    <div className="form-group row" style={{ marginBottom: -1 }}>
                        <label for="exampleInputName1" className="col-sm-2 col-form-label"><b>GSTIN</b></label>
                        <div class="col-sm-4">
                            <input type="text" value={leaddata.gstin} onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    gstin: target.value
                                }))
                            }} className="form-control" id="exampleInputName1" />
                        </div>
                        <label for="exampleCompanyName" className="col-sm-2 col-form-label"><b>Company Name</b></label>
                        <div class="col-sm-4">
                            <input type="text" value={leaddata.comname} onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    comname: target.value
                                }))
                            }} required className="form-control" id="exampleCompanyName" />
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -1 }}>
                        <label for="exampleContactPerson" className="col-sm-2 col-form-label"><b>Contact Person</b></label>
                        <div class="col-sm-4">
                            <input type="text" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    contactpers: target.value
                                }))
                            }} required value={leaddata.contactpers} id="exampleContactPerson" />
                        </div>
                        <label for="exampleInputMobile" className="col-sm-2 col-form-label"><b>Mobile</b></label>
                        <div class="col-sm-4">
                            <input type="number" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    mobile: target.value
                                }))
                            }} required value={leaddata.mobile} id="exampleInputMobile" />
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -1 }} >
                        <label for="exampleEmail" className="col-sm-2 col-form-label"><b>Email Id</b></label>
                        <div class="col-sm-4">
                            <input type="text" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    email: target.value
                                }))
                            }} required value={leaddata.email} id="exampleEmail" />
                        </div>
                        <label for="exampleAddress" className="col-sm-2 col-form-label"><b>Address</b></label>
                        <div class="col-sm-4">
                            <input type="text" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    address: target.value
                                }))
                            }} required value={leaddata.address} id="exampleAddress" />
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -1 }}>
                        <label for="exampleInputPinCode" className="col-sm-2 col-form-label"><b>Pincode</b></label>
                        <div class="col-sm-4">
                            <input type="number" className="form-control" onChange={({ target }) => {
                                let _pincode = Number(target.value);
                                setLeadData(preState => ({
                                    ...preState,
                                    pincode: _pincode
                                }))
                            }} required value={leaddata.pincode} id="exampleInputPinCode" />
                        </div>
                        <label for="exampleInputState" className="col-sm-2 col-form-label"><b>State</b></label>
                        <div class="col-sm-4">
                            <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    state: target.value
                                }))
                            }}>
                                {states.map((response) => {
                                    return (leaddata.state === response ?
                                        <option value={response} selected>{response}</option> :
                                        <option value={response}>{response}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -20 }}>
                        <label for="exampleInputStatus" className="col-sm-2 col-form-label"><b>Status</b></label>
                        <div class="col-sm-4">
                            <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    status: target.value
                                }))
                            }} required > {
                                    Object.keys(status_data).map((response) => {
                                        return (response === leaddata.status ?
                                            <option value={response} selected>{status_data[response]}</option> :
                                            <option value={response}>{status_data[response]}</option>)
                                    })
                                }
                            </select>
                        </div>
                        <label for="exampleLeadType" className="col-sm-2 col-form-label"><b>Lead Type</b></label>
                        <div class="col-sm-4">
                            <select id="exampleLeadType" className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    leadtype: target.value
                                }))
                            }} required > {
                                    Object.keys(leadtype).map((response) => {
                                        return (response === leaddata.leadtype ?
                                            <option value={response} selected>{leadtype[response]}</option> :
                                            <option value={response}>{leadtype[response]}</option>)
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -20 }}>
                        <label for="exampleInputTeleName" className="col-sm-2 col-form-label"><b>Tele Name</b></label>
                        <div class="col-sm-4">
                            <select className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    tele_id: target.value
                                }))

                            }} required id="exampleInputTeleName" >
                                {mainstate.users.map((response) => {
                                    return (response.id === leaddata.tele_id ?
                                        <option value={response.id} selected>{response.username}</option> :
                                        <option value={response.id}>{response.username}</option>)
                                })}
                            </select>
                        </div>
                        <label for="exampleInputSalesPerson" className="col-sm-2 col-form-label"><b>Sales Person</b></label>
                        <div class="col-sm-4">
                            <select className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    sale_person_id: target.value
                                }))

                            }} required id="exampleInputSalesPerson" >
                                {mainstate.users.map((response) => {
                                    return (response.id === leaddata.sale_person_id ?
                                        <option value={response.id} selected>{response.username}</option> :
                                        <option value={response.id}>{response.username}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -20 }}>
                        <label for="exampleInputPackage" className="col-sm-2 col-form-label"><b>Package</b></label>
                        <div class="col-sm-4">
                            <select className="form-control" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    package: target.value
                                }))
                            }} required id="exampleInputPackage">
                                {Object.keys(packages).map((response) => {
                                    if (response == leaddata.package) {
                                        return (
                                            <option value={response} selected>{packages[response]}</option>
                                        )
                                    }
                                    return (
                                        <option value={response}>{packages[response]}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <label for="exampleInputCity" className="col-sm-2 col-form-label"><b>City</b></label>
                        <div class="col-sm-4">
                            <select id="exampleInputCity" onChange={({ target }) => {
                                setLeadData(preState => ({
                                    ...preState,
                                    city: target.value
                                }))
                            }} className="form-control">
                                {statescities.meta_data[leaddata.state] ? statescities.meta_data[leaddata.state].map((response) => {
                                    return (leaddata.city === response ?
                                        <option value={response} selected>{response}</option> :
                                        <option value={response}>{response}</option>)
                                }) : null}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginBottom: -20 }}>
                        <label for="multiple-keywords-label" className="col-sm-2 col-form-label"><b>Keywords</b></label>
                        <div class="col-sm-4">
                            <Select options={keywords} id="multiple-keywords-label" onChange={(e) => { setSelectedKeywords(e) }}
                                defaultValue={selectedkeywords}
                                isMulti components={animatedComponents} />
                        </div>
                    </div>
                    <button type="button" style={{ marginBottom: 4 }} onClick={() => {
                        navigate("/app/createactivation?leadid=" + leadid)
                    }} className="btn btn-gradient-primary mt-3">Active</button>
                    <button className="btn btn-light mt-3" style={{ marginLeft: 7, marginBottom: 4 }} onClick={() => {
                        navigate(location.state ? location.state.backpath : "/app/leads")
                    }}>Cancel</button>
                </>)}
                </form>
            </>
        )
    }
    useEffect(() => {
        setStates(Object.keys(statescities.meta_data))
        if (leadid) {
            if (!location.state) {
                navigate('/app/dashboard')
            }
            const leadddetail = LeadData(leadid, userid, token_).then((response) => {
                if (response.data._code === 200) {
                    setLeadData(response.data.data)
                }
                else {
                    navigate("/app/leads")
                }
            })
            Users(false, userid, token_).then((response) => {
                dispatchstate({ "users": response.data.data })
            })
            KeywordsName().then((res) => {
                if (res.data._code == 200) {
                    dispatchstate({ 'keywordsname': res.data.data })
                }
            })
            GetKeywords().then((response) => {
                if (response.data._code === 200) {
                    setKeywords(response.data.data)
                }
            })
            GetKeywordsOfLead(leadid).then((response) => {
                if (response.data._code === 200 || response.data._code === 404) {
                    setSelectedKeywords(response.data.data)
                    setShowEditPage(true)
                }
            })
            SetHistoryDetails(leadid, userid, token_)
        }
        else {
            navigate(location.state ? location.state.backpath : "/app/leads")
        }
    }, [showeditpage])
    const GetAlertData = (type, message, show) => {
        return { ...mainstate.alertdata, ...{ show: show, type: type, message: message } }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        let alertinfo = mainstate.alertdata;
        alertinfo["show"] = false
        dispatchstate({ 'alertdata': GetAlertData("", "", false) })
    };

    return (
        <div className="main-panel">
            {showeditpage && (
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-information"></i>
                            </span> <Link to={location.state ? location.state.backpath : "/app/leads"} style={{ color: "black", textDecoration: 'none' }}>{location.state ? location.state.name : "Leads"}</Link>/{leaddata.contactpers}
                        </h3>
                    </div>
                    <Grid className="row">
                        <Grid item xs={12} className={location.state.backpath != "/app/closeleads" ? "col-md-7 grid-margin stretch-card" : "col-md-12 grid-margin stretch-card"}>
                            <div className="card" style={{ width: "576px" }}>
                                <div className="card-body">
                                    {location.state.backpath != "/app/closeleads" ? (<h4 className="card-title btn-gradient-primary" style={{ color: "white", width: 115 }}>LEAD DETAIL</h4>) : null}
                                    <ConditionalRenderForm />
                                </div>
                            </div>
                        </Grid>
                        {location.state.backpath == "/app/closeleads" ? false : <Grid item className="col-md-4 grid-margin stretch-card mt-2">
                            <div className="card" style={{ height: historiesdetails.length == 0 ? 400 : getheight }}>
                                <div className="card-body">
                                    <h4 className="card-title btn-gradient-primary" style={{ color: "white", width: 115 }}>LEAD STATUS</h4>
                                    {!mainstate.Editleadstatusfalg && (<p onClick={() => {
                                        dispatchstate({ "Editleadstatusfalg": true })
                                    }} style={{ color: "blue" }}><i className="mdi mdi-tooltip-edit" style={{ marginLeft: 160 }}>
                                        </i></p>)}
                                    {mainstate.Editleadstatusfalg && (<form className="forms-sample">
                                        <div className="form-group">
                                            <label for="exampleInputStatus"><b>Status</b></label>
                                            <select id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                                setLeadData(preState => ({
                                                    ...preState,
                                                    status: target.value
                                                }))
                                            }} required > {
                                                    Object.keys(status_data).map((response) => {
                                                        return (response === leaddata.status ?
                                                            <option value={response} selected>{status_data[response]}</option> :
                                                            <option value={response}>{status_data[response]}</option>)
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label for="description"><b>Description</b></label>
                                            <textarea id="description" onChange={({ target }) => {
                                                setLeadData(preState => ({
                                                    ...preState,
                                                    client_talk_desc: target.value
                                                }))
                                            }} value={leaddata.client_talk_desc} className="form-control"></textarea>
                                        </div>
                                        {!ImportTagsBasedStatusEditLead.includes(leaddata.status) && (<div className="form-group">
                                            <label for="NextDate"><b>Next Follow-Up Date</b></label>
                                            <input type="date" className="form-control" value={leaddata.next_follow_date} onChange={({ target }) => {
                                                setLeadData(preState => ({
                                                    ...preState,
                                                    next_follow_date: target.value
                                                }))
                                            }} id="NextDate" />
                                        </div>)}
                                        <button type="button" onClick={() => {
                                            let lead = leaddata;
                                            if (userid) {
                                                lead["userid"] = userid
                                            }
                                            if (ImportTagsBasedStatusEditLead.includes(lead.status)) {
                                                lead["next_follow_date"] = null
                                            }
                                            CheckEmailMobileNumberExists({ "email": lead.email, "mobile": lead.mobile, "leadid": leadid, "gstin": lead.gstin }).then((response) => {
                                                let check_exists_data = response.data
                                                if (check_exists_data._code == 200 && !check_exists_data.exists) {
                                                    ModifyLead(lead).then((response) => {
                                                        let data = response.data
                                                        if (data._code === 200) {
                                                            SetHistoryDetails(leadid, userid, token_)
                                                            dispatchstate({ "alertdata": GetAlertData("success", "Update Status Detail SuccessFully", true) })
                                                        }
                                                        else {
                                                            dispatchstate({ "alertdata": GetAlertData("success", data.message, true) })
                                                        }
                                                    })
                                                }
                                                else {
                                                    dispatchstate({ "alertdata": GetAlertData("error", "Email OR Mobile Number OR GSTIN Already Exists!", true) })
                                                }
                                            })
                                        }} className="btn btn-gradient-primary me-2">Submit</button>
                                    </form>)}
                                    {historiesdetails.length > 0 && (<><hr />
                                        <h4 className="card-title">History Status</h4>
                                        <div className="table-responsive">
                                            <div class="template-demo">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Description</th>
                                                            <th> Status </th>
                                                            <th> User </th>
                                                            <th> Date / Time </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            historiesdetails.map((response) => {
                                                                return (
                                                                    <tr>
                                                                        <td>  {response["client_next_talk_desc"]}</td>
                                                                        <td>  {status_data[response["statuslead"]]}</td>
                                                                        <td> {response["username"]} </td>
                                                                        <td> {response["change_time"]} / {response["update_time"]} </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>)}
                                </div>
                            </div>
                        </Grid>}

                    </Grid >
                </div >)
            }
            {
                mainstate.alertdata.show && (
                    <Snackbar open={mainstate.alertdata.show} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={mainstate.alertdata.type} sx={{ width: '100%' }}>
                            {mainstate.alertdata.message}
                        </Alert>
                    </Snackbar>
                )
            }
        </div >
    )
}
export default EditLead;