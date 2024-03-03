import { Alert, Grid, Snackbar } from "@mui/material"
import { Users, AddTicketData, Activations } from "../apicaller"
import { useEffect, useState } from "react"
import { GetUserDetails } from "../tools/tools"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"

export const AddTicket = () => {
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
    const [getdataflag, setGetDataFlag] = useState(false)
    const [alertdata, setAlertData] = useState({})
    const [userdata, setUserData] = useState([])
    const [activationsdata, setActivationsData] = useState([])
    const statusdata = {
        "open": "Open",
        "resolve": "Resolve"
    }
    let { userid, token } = GetUserDetails();
    let token_ = token;
    const handleClose = () => {
        setAlertData(preState => ({
            ...preState,
            ...{
                show: false,
                message: "",
                type: "error"
            }
        }))
    }
    const location = useLocation()
    const GetActivations = () => {
        Activations(userid, token).then((response) => {
            const data = response.data.data
            if (data) {
                setActivationsData(data)
            }
        })
    }
    const statepage = location.state ? location.state : {}
    useEffect(() => {
        GetActivations()
        Users(false, userid, token_).then((response) => {
            setGetDataFlag(true)
            setUserData(response.data.data)
        })
    }, [getdataflag])
    const OnSubmitTicket = (event) => {
        event.preventDefault();
        let formdata = new FormData(event.target)
        formdata = Object.fromEntries(formdata)
        formdata.techid = Number(formdata.techid)
        if (Object.values(formdata).includes(null)) {
            return
        }
        AddTicketData(formdata).then((response) => {
            if (response.data._code == 200) {
                setAlertData(preState => ({
                    ...preState,
                    ...{
                        show: true,
                        message: "Add New Ticket Details Success Fully",
                        type: "success"
                    }
                }))
            }
        })
    }
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3>
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-book-multiple"></i>
                        </span>
                        {statepage.page ? <Link to={`/app/tickets`} style={{ color: "black", textDecoration: 'none' }}>Tickets/</Link> : ""}  Add Ticket
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
                                <form className="forms-sample" onSubmit={OnSubmitTicket}>
                                    <div className="form-group">
                                        <label for="exampleInputType"><b>Client</b></label>
                                        <select name="clientid" className="form-control" id="exampleInputType">
                                            {activationsdata.map((response) => {
                                                return <option value={response.id}>{response.comname}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputType"><b>Type</b></label>
                                        <select name="type" className="form-control" id="exampleInputType">
                                            {Object.keys(ticketstype).map((response) => {
                                                return <option value={response}>{ticketstype[response]}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="InputTechnicalPerson"><b>Technical Person</b></label>
                                        <select name="techid" className="form-control" id="InputStatus">
                                            {userdata.map((response) => {
                                                return (
                                                    <option value={response.id}>{response.username}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label for="InputStatus"><b>Status</b></label>
                                        <select name="status" className="form-control" id="InputStatus">
                                            {Object.keys(statusdata).map((response) => {
                                                return <option value={response}>{statusdata[response]}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Snackbar open={alertdata.show} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alertdata.type} sx={{ width: '100%' }}>
                        {alertdata.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}