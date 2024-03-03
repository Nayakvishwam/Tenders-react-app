import { Grid, Snackbar, Alert } from "@mui/material"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Activations, GetTicket, UpdateTicket, Users } from "../apicaller"
import { useEffect, useState } from "react"
import { GetUserDetails } from "../tools/tools"

export const EditTicket = () => {
    const ticketstype = {
        "misstender": "Miss Tender",
        "callbook": "Call Book",
        "junktender": "Junk Tender",
        "invoice": "InVoice",
        "freshalert": "Fesh Alert",
        "addproduct": "Add Product",
        "tenderbid": "Tender Bid",
        "livecatelog": "Live Catelog",
        "order": "Order",
        "refind": "Refind",
        "other": "Other"
    }
    const statusdata = {
        "open": "Open",
        "resolve": "Resolve"
    }
    let { userid, token } = GetUserDetails();
    const navigate = useNavigate()
    const [getdataflag, setGetDataFlag] = useState(false)
    const [searchParams] = useSearchParams();
    const ticketid = searchParams.get("ticketid");
    const [getdata, setGetData] = useState({
        "ticketdata": {
            id: ticketid
        },
        "userdata": [],
        "alertdata": {},
        "activations": []
    })
    const GetActivations = () => {
        Activations(userid, token).then((response) => {
            const data = response.data.data
            if (data) {
                setGetData(preState => ({
                    ...preState,
                    ["activations"]: data,
                }))
            }
        })
    }
    useEffect(() => {
        if (ticketid) {
            GetActivations()
            Users(false, userid, token).then((response) => {
                setGetDataFlag(true)
                setGetData(preState => ({
                    ...preState,
                    ["userdata"]: response.data.data,
                }))
            })
            GetTicket(ticketid).then((response) => {
                if (response.data._code == 200) {
                    setGetData(preState => ({
                        ...preState,
                        ["ticketdata"]: response.data.data,
                    }))
                }
            })
        }
        else {
            navigate("/app/editticket")
            setGetDataFlag(true)
        }
    }, [getdataflag])
    const TicketDataSet = (event) => {
        setGetData(preState => ({
            ...preState,
            ticketdata: { ...getdata.ticketdata, [event.target.name]: event.target.value }
        }))
    }
    const SubmitTicket = () => {
        console.log(getdata.ticketdata)
        UpdateTicket(getdata.ticketdata).then((response) => {
            if (response.data._code == 200) {
                setGetData(preState => ({
                    ...preState,
                    ["alertdata"]: {
                        "type": "success",
                        "message": response.data.message,
                        "show": true
                    },
                }))
            }
        })
    }
    const handleClose = () => {
        setGetData(preState => ({
            ...preState,
            ["alertdata"]: {
                "type": "",
                "message": null,
                "show": null
            },
        }))
    }
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3>
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-book-multiple"></i>
                        </span>
                        <Link to={`/app/tickets`} style={{ color: "black", textDecoration: 'none' }}>Tickets/</Link>
                        Edit Ticket
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
                                <form className="forms-sample">
                                    <div className="form-group">
                                        <label for="exampleInputType"><b>Client</b></label>
                                        <select name="clientid" className="form-control" id="exampleInputType" onChange={TicketDataSet}>
                                            {getdata.activations.map((response) => {
                                                return (
                                                    [getdata.ticketdata.clientid].includes(response.id) ? <option value={response.id} selected>{response.comname}</option>
                                                        : <option value={response.id}>{response.comname}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputType"><b>Type</b></label>
                                        <select name="type" className="form-control" id="exampleInputType" onChange={TicketDataSet}>
                                            {Object.keys(ticketstype).map((response) => {
                                                return (
                                                    [getdata.ticketdata.type].includes(response) ? <option value={response} selected>{ticketstype[response]}</option>
                                                        : <option value={response}>{ticketstype[response]}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="InputTechnicalPerson"><b>Technical Person</b></label>
                                        <select name="techid" className="form-control" id="InputStatus" onChange={TicketDataSet}>
                                            {getdata.userdata.map((response) => {
                                                return (
                                                    [getdata.ticketdata.techid].includes(response.id) ? <option value={response.id} selected>{response.username}</option>
                                                        : <option value={response.id}>{response.username}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="InputStatus"><b>Status</b></label>
                                        <select name="status" className="form-control" id="InputStatus" onChange={TicketDataSet}>
                                            {Object.keys(statusdata).map((response) => {
                                                return ([getdata.ticketdata.status].includes(response) ?
                                                    <option value={response} selected>{statusdata[response]}</option>
                                                    : <option value={response}>{statusdata[response]}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <button type="button" onClick={SubmitTicket} className="btn btn-gradient-primary me-2">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Snackbar open={getdata.alertdata.show} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={getdata.alertdata.type} sx={{ width: '100%' }}>
                        {getdata.alertdata.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>)
}