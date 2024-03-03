import { Grid } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ActivationDetail, ActivationHistoriesData, AddClientHistory, AddTaskClient, ChangeActivation, TasksData, Users } from "../apicaller";
import statescities from "../States_Cities.json"
import { ImportPackageActivation } from "../ImportVariables";
import { GetUserDetails } from "../tools/tools";
import {
    Alert, Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
export const EditActivation = () => {
    const [searchParams] = useSearchParams();
    const [getdetailflag, setGetDetailflag] = useState(false);
    const paymentmethods = {
        "check": "Check",
        "dd": "Demand Draft",
        "online": "Online",
        "cash": "Cash",
        "neft": "NEFT",
        "rtgs": "RTGS",
        "upi": "UPI"
    }
    const clienttype = {
        "oem": "OEM",
        "re-salers": "Re-salers",
        "service": "Service"
    }
    const [tasksdata, setTasksData] = useState([])
    const task_status = {
        "pending": "Pending",
        "complete": "Complete",
        "rejected": "Rejected",
        "process": "Process",
        "subnited": "Subnited",
        "qualified": "Qualified",
        "disqualified": "DisQualified",
        "winner": "Winner"
    }

    let columns = [
        {
            field: 'task', headerName: 'Task', width: 130, renderCell: (params) => {
                return taskdata.hasOwnProperty(params.value) ? taskdata[params.value] : params.value
            }
        },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'clientid', headerName: 'Client Id', width: 130 },
        { field: 'reffid', headerName: 'Reference Id', width: 130 },
        { field: 'category', headerName: 'Category', width: 130 },
        {
            field: 'status', headerName: 'Status', width: 130, renderCell: (params) => {
                return status_data.hasOwnProperty(params.value) ? status_data[params.value] : params.value
            }
        }
    ]

    let { userid, token } = GetUserDetails();
    let token_ = token;
    const navigate = useNavigate();
    const [getdetail, setGetDetail] = useState({})
    const [historydetail, setHistoryDetail] = useState([])
    const setMainState = (mainstate, action) => {
        return { ...mainstate, ...action }
    }
    const [mainstate, dispatchstate] = useReducer(setMainState, {
        "states": Object.keys(statescities.meta_data),
        "users": [],
        "alertdata": { "show": false, "type": "", "message": "" },
        "statusdetails": {}
    });
    const activationid = searchParams.get("activationid");
    const taskdata = {
        "profite": "Profite",
        "catelog": "Catelog",
        "bid": "Bid",
        "oem": "OEM",
        "order": "Order"
    }
    const TotalNumberDataBasedOnType = () => {
        let Bytasktypedata = { ...Object.fromEntries(Object.entries(taskdata).map(([key, value]) => { return [key, 0] })) }
        tasksdata.map((response) => {
            let key = response.task
            if (Bytasktypedata.hasOwnProperty(key)) {
                Bytasktypedata = { ...Bytasktypedata, ...{ [key]: Bytasktypedata[key] + 1 } }
            }
            return response
        })
        return (
            <div className="template-demo">
                {
                    Object.keys(Bytasktypedata).map((response) => {
                        return <h4 className="mt-2">{taskdata[response]} :- {Bytasktypedata[response]}</h4>
                    })
                }
            </div>
        )
    }
    const TaskSubmit = (event) => {
        event.preventDefault();
        let formdata = new FormData(event.target);
        formdata = Object.fromEntries(formdata)
        formdata.clientid = activationid
        formdata.client_id = getdetail.clientid
        if (Object.values(formdata).includes("")) {
            dispatchstate({ 'alertdata': SetAlertData(true, "Required All Details", "error") })
            return
        }
        AddTaskClient(formdata).then((response) => {
            if (response.data._code == 200) {
                dispatchstate({ 'alertdata': SetAlertData(true, "Add New Task SuccessFully.", "success") })
                GetTaskData()
            }
        })
    }
    let GetActivationHistoriesData = () => {
        ActivationHistoriesData(activationid).then((response) => {
            if (response.data._code === 200) {
                setHistoryDetail(response.data.data)
                setGetDetailflag(true)
            }
        })
    }
    let GetTaskData = () => {
        TasksData({ clientid: activationid }).then((response) => {
            if (response.data._code === 200) {
                setTasksData(response.data.data)
            }
        })
    }
    useEffect(() => {
        ActivationDetail(activationid).then((response) => {
            if (response.data._code === 200) {
                let data = response.data.data
                setGetDetail(data)
            }
            else {
                navigate("/app/clientleads")
            }
        })
        GetTaskData()
        Users(false, userid, token_).then((userresponse) => {
            if (userresponse.data._code === 200) {
                dispatchstate({ "users": userresponse.data.data })
            }
        })
        GetActivationHistoriesData()
    }, [getdetailflag])
    const status_data = {
        satisfied: "Satisfied",
        pending: "Pending",
        active: "Active",
        passive: "Passive",
        expired: "Expired",
        unsatisfied: "Unsatisfied"
    }
    const ActivationDetailAdd = (key, value) => {
        setGetDetail(preState => ({
            ...preState,
            [key]: value
        }))
    }
    const StatusSubmit = (event) => {
        event.preventDefault()
        var formdata = new FormData(event.target)
        formdata = Object.fromEntries(formdata)
        if (!formdata.description) {
            formdata.description = null
        }
        ActivationDetailAdd('status', formdata.status)
        ActivationDetailAdd('client_talk_desc', formdata.description)
        formdata.userid = userid
        formdata.clientid = activationid
        formdata.token = token_
        if (getdetail.client_talk_desc != formdata.description || getdetail.status != formdata.status) {
            AddClientHistory(formdata).then((response) => {
                dispatchstate({ 'alertdata': SetAlertData(true, "SuccessFully Add Clients History", "success") })
                GetActivationHistoriesData()
            })
        }

    }
    const SetAlertData = (show, message, type) => {
        return { ...mainstate.alertdata, ...{ show: show, type: type, message: message } }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatchstate({ 'alertdata': SetAlertData(false, "", "") })
    };
    return <>
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-account-multiple"></i>
                        </span>
                        <Link to={"/app/clientleads"} style={{ color: "black", textDecoration: 'none' }}>Clients</Link>/{getdetail.contactpers && (getdetail.contactpers + "(" + getdetail.clientid + ")")}
                    </h3>
                </div>
                <Grid className="row">
                    <Grid item xs={12} className={"col-md-12 grid-margin stretch-card"}>
                        <div className="card" style={{ width: "576px" }}>
                            <div className="card-body">
                                <form className="forms-sample">
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputStatus" className="col-sm-2 col-form-label"><b>Status</b></label>
                                        <div className="col-sm-4">
                                            <select style={{ color: "black" }} id="exampleInputStatus" className="form-control" onChange={({ target }) => ActivationDetailAdd('status', target.value)}>
                                                {Object.keys(status_data).map((response) => {
                                                    if (response == getdetail.status) {
                                                        return <option value={response} selected>{status_data[getdetail.status]}</option>
                                                    }
                                                    return <option value={response}>{status_data[response]}</option>
                                                })}
                                            </select>
                                        </div>
                                        <label for="exampleInputName1" className="col-sm-2 col-form-label"><b>GSTIN</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" name="gstin" value={getdetail.gstin} className="form-control" id="exampleInputName1" onChange={({ target }) => ActivationDetailAdd('gstin', target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleCompanyName" className="col-sm-2 col-form-label"><b>Company Name</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" name="comname" value={getdetail.comname} className="form-control" id="exampleCompanyName" onChange={({ target }) => ActivationDetailAdd('comname', target.value)} />
                                        </div>
                                        <label for="exampleContactPerson" className="col-sm-2 col-form-label"><b>Contact Person</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" name="contactpers" value={getdetail.contactpers} className="form-control" id="exampleContactPerson" onChange={({ target }) => ActivationDetailAdd('contactpers', target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputState" className="col-sm-2 col-form-label"><b>State</b></label>
                                        <div className="col-sm-4">
                                            <select style={{ color: "black" }} id="exampleInputState" className="form-control" onChange={({ target }) => ActivationDetailAdd('state', target.value)}>
                                                {mainstate.states.map((response) => {
                                                    return (getdetail.state === response ?
                                                        <option value={response} selected>{response}</option> :
                                                        <option value={response}>{response}</option>)
                                                })}
                                            </select>
                                        </div>
                                        <label for="exampleInputCity" className="col-sm-2 col-form-label"><b>City</b></label>
                                        <div className="col-sm-4">
                                            <select style={{ color: "black" }} id="exampleInputCity" className="form-control" onChange={({ target }) => ActivationDetailAdd('city', target.value)} >
                                                {statescities.meta_data[getdetail.state] ? statescities.meta_data[getdetail.state].map((response) => {
                                                    return (getdetail.city === response ?
                                                        <option value={response} selected>{response}</option> :
                                                        <option value={response}>{response}</option>)
                                                }) : null}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleAddress" className="col-sm-2 col-form-label"><b>Address</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" value={getdetail.address} name="address" id="exampleAddress" onChange={({ target }) => ActivationDetailAdd('address', target.value)} />
                                        </div>
                                        <label for="exampleInputMobile" className="col-sm-2 col-form-label"><b>Mobile</b></label>
                                        <div className="col-sm-4">
                                            <input type="number" className="form-control" value={getdetail.mobile} name="mobile" id="exampleAddress" onChange={({ target }) => ActivationDetailAdd('mobile', target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputMobile" className="col-sm-2 col-form-label"><b>Bid Pack</b></label>
                                        <div className="col-sm-4">
                                            <input type="number" className="form-control" name="bidpack" value={getdetail.bidpack} id="examplebidPack" onChange={({ target }) => ActivationDetailAdd('bidpack', target.value)} />
                                        </div>
                                        <label for="exampleInputMobile" className="col-sm-2 col-form-label"><b>Product Pack</b></label>
                                        <div className="col-sm-4">
                                            <input type="number" className="form-control" name="productpack" value={getdetail.productpack} id="exampleproductPack" onChange={({ target }) => ActivationDetailAdd('productpack', target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleEmail" className="col-sm-2 col-form-label"><b>Email Id</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" name="email" value={getdetail.email} onChange={({ target }) => ActivationDetailAdd('email', target.value)} id="exampleEmail" />
                                        </div>
                                        <label for="weburl" className="col-sm-2 col-form-label"><b>WebSite Url</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" name="weburldetails" className="form-control" id="weburl" value={getdetail.web_url} onChange={({ target }) => ActivationDetailAdd('web_url', target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputPackage" className="col-sm-2 col-form-label" ><b>Package</b></label>
                                        <div className="col-sm-4">
                                            <select className="form-control" id="exampleInputPackage" onChange={({ target }) => ActivationDetailAdd('package', target.value)} >
                                                {
                                                    Object.keys(ImportPackageActivation).map((response) => {
                                                        return (
                                                            response == getdetail.package ?
                                                                <option value={response} selected>{ImportPackageActivation[response]}</option>
                                                                :
                                                                <option value={response}>{ImportPackageActivation[response]}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <label for="amount" className="col-sm-2 col-form-label"><b>Amount (With GST)</b></label>
                                        <div className="col-sm-4">
                                            <input type="number" name="amount" className="form-control" value={getdetail.amount_gst} onChange={({ target }) => ActivationDetailAdd('amount_gst', target.value)} id="amount" />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="paymentmethod" className="col-sm-2 col-form-label"><b>Payment Method</b></label>
                                        <div className="col-sm-4">
                                            <select id="paymentmethod" className="form-control" onChange={({ target }) => ActivationDetailAdd('paymentmethod', target.value)}>
                                                {Object.keys(paymentmethods).map((response) => {
                                                    return (
                                                        response == getdetail.paymethod ?
                                                            <option value={response} selected>{paymentmethods[response]}</option>
                                                            :
                                                            <option value={response}>{paymentmethods[response]}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <label for="clienttype" className="col-sm-2 col-form-label"><b>Client Type</b></label>
                                        <div className="col-sm-4">
                                            <select id="clienttype" className="form-control" onChange={({ target }) => ActivationDetailAdd('clienttype', target.value)}>
                                                {Object.keys(clienttype).map((response) => {
                                                    return (
                                                        response == getdetail.clienttype ?
                                                            <option value={response} selected>{clienttype[response]}</option>
                                                            :
                                                            <option value={response}>{clienttype[response]}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputTeleName" className="col-sm-2 col-form-label"><b>Tele Name</b></label>
                                        <div className="col-sm-4">
                                            <select className="form-control" id="exampleInputTeleName" onChange={({ target }) => ActivationDetailAdd('tele_id', target.value)}>
                                                {mainstate.users.map((response) => {
                                                    return (
                                                        response.id === getdetail.tele_id ? <option value={response.id} selected>{response.username}</option> :
                                                            <option value={response.id}>{response.username}</option>)
                                                })}
                                            </select>
                                        </div>
                                        <label for="exampleInputSalesPerson" className="col-sm-2 col-form-label"><b>Sales Person</b></label>
                                        <div className="col-sm-4">
                                            <select className="form-control" id="exampleInputSalesPerson" onChange={({ target }) => ActivationDetailAdd('sale_person_id', target.value)}>
                                                {mainstate.users.map((response) => {
                                                    return (
                                                        response.id === getdetail.sale_person_id ? <option value={response.id} selected>{response.username}</option> :
                                                            <option value={response.id}>{response.username}</option>)
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputTechnicalPerson" className="col-sm-2 col-form-label"><b>Technical Person</b></label>
                                        <div className="col-sm-4">
                                            <select className="form-control" id="exampleInputTechnicalPerson" onChange={({ target }) => ActivationDetailAdd('tech_id', target.value)}>
                                                {mainstate.users.map((response) => {
                                                    return (
                                                        response.id === getdetail.tech_id ? <option value={response.id} selected>{response.username}</option> :
                                                            <option value={response.id}>{response.username}</option>)
                                                })}
                                            </select>
                                        </div>
                                        <label for="exampleInputexpireddate" className="col-sm-2 col-form-label"><b>Expired Date</b></label>
                                        <div className="col-sm-4">
                                            <input type="date" name="expdate" className="form-control" value={getdetail.expdate} onChange={({ target }) => ActivationDetailAdd('expdate', target.value)} id="exampleInputexpireddate" />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="paymentmethod" className="col-sm-2 col-form-label"><b>Payment Details</b></label>
                                        <div className="col-sm-4">
                                            <textarea className="form-control" cols="30" rows="5" value={getdetail.paymentdetails} onChange={({ target }) => ActivationDetailAdd('paymentdetails', target.value)}></textarea>
                                        </div>
                                        <label for="InputADDTIONAL" className="col-sm-2 col-form-label"><b>ADDTIONAL</b></label>
                                        <div className="col-sm-4">
                                            <input type="text" name="weburldetails" className="form-control" value={getdetail.additional} onChange={({ target }) => ActivationDetailAdd('additional', target.value)} id="InputADDTIONAL" />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <div className="col-sm-4">
                                            <button type="button" className="btn btn-gradient-primary me-2" onClick={() => {
                                                ChangeActivation(getdetail).then((response) => {
                                                    let GetDetail = response.data
                                                    if (GetDetail._code == 200) {
                                                        dispatchstate({ 'alertdata': SetAlertData(true, "SuccessFully Change Client's Details", "success") })
                                                    }
                                                })
                                            }}>Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div className="row mt-4">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Activation Status</h4>
                                <form onSubmit={StatusSubmit}>
                                    <div className="form-group">
                                        <label for="exampleInputStatus">Status</label>
                                        <select name="status" style={{ color: "black" }} id="exampleInputStatus" className="form-control" onChange={({ target }) => {
                                            dispatchstate({ 'statusdetails': target.value })
                                        }
                                        }>
                                            {Object.keys(status_data).map((response) => {
                                                if (response == getdetail.status) {
                                                    return <option value={response} selected>{status_data[getdetail.status]}</option>
                                                }
                                                return <option value={response}>{status_data[response]}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="description">Description</label>
                                        <textarea id="description" value={getdetail.client_talk_desc} onChange={({ target }) => ActivationDetailAdd('client_talk_desc', target.value)} name="description" className="form-control"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label for="NextDate">Next Follow-Up Date</label>
                                        <input type="date" id="NextDate" value={getdetail.next_follow_date} onChange={({ target }) => ActivationDetailAdd('next_follow_date', target.value)} name="nextdate" className="form-control form-control-sm" />
                                    </div>
                                    <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin ">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Status History</h4>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th> Status </th>
                                                <th> Description </th>
                                                <th> Last Change Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historydetail && (
                                                historydetail.map((response) => {
                                                    const d = new Date(response.update_date_time);
                                                    let updatedate = d.toDateString()
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <label className="badge badge-gradient-success">{status_data[response.statusclient]}</label>
                                                            </td>
                                                            <td>{response.client_next_talk_desc}</td>
                                                            <td>{updatedate}</td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Task</h4>
                                <form onSubmit={TaskSubmit} className="forms-sample">
                                    {/* <div className="form-group"> */}
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="task" className="col-sm-3 col-form-label">Task</label>
                                        <div className="col-sm-9">
                                            <select name="task" className="form-control">
                                                {Object.keys(taskdata).map((response) => {
                                                    return <option value={response}>{taskdata[response]}</option>
                                                })}
                                            </select>
                                        </div>
                                        {/* <input type="text" className="form-control" name="task" id="task" placeholder="Task" /> */}
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="reffid" className="col-sm-3 col-form-label">Reference Id</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" name="reffid" id="reffid" placeholder="Reference Id" />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="category" className="col-sm-3 col-form-label">Category</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" name="category" id="category" placeholder="Category" />
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="tech_person" className="col-sm-3 col-form-label">Technical Person</label>
                                        <div className="col-sm-9">
                                            <select name="tech_person" className="form-control" id="tech_person">
                                                {mainstate.users.map((response) => {
                                                    return (
                                                        <option value={response.id}>{response.username}</option>)
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row" style={{ marginBottom: 2, marginLeft: 2 }}>
                                        <label for="exampleInputStatus" className="col-sm-3 col-form-label">Status</label>
                                        <div className="col-sm-9">
                                            <select name="status" className="form-control" id="exampleInputStatus">
                                                {Object.keys(task_status).map((response) => {
                                                    return <option value={response}>{task_status[response]}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                    <button type="submit" className="btn btn-gradient-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Group By Task Type</h4>
                                <TotalNumberDataBasedOnType />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4>Tasks</h4>
                                <DataGrid
                                    rows={tasksdata}
                                    columns={columns}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                mainstate.alertdata.show && (
                    <Snackbar open={mainstate.alertdata.show} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={mainstate.alertdata.type} sx={{ width: '100%' }}>
                            {mainstate.alertdata.message}
                        </Alert>
                    </Snackbar>
                )
            }
        </div>
    </>
}