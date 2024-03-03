import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useReducer, useState } from "react"
import { GetUserDetails } from "../tools/tools"
import { Activations, RemoveClientsData, AddClientHistory, AddDataByExcel } from "../apicaller"
import { useLocation, useNavigate } from "react-router"
import { Link } from "react-router-dom"
import {
    Button, Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    FormControl,
    TextField,
    Select,
    MenuItem
} from "@mui/material";
import { DownloadExcel, FileUpload } from "../Components/Button"

export const ClientsLeads = () => {
    const status_data = {
        satisfied: "Satisfied",
        pending: "Pending",
        active: "Active",
        passive: "Passive",
        expired: "Expired",
        unsatisfied: "Unsatisfied"
    }
    const setMainState = (mainstate, action) => {
        return { ...mainstate, ...action }
    }
    const [mainstate, dispatchstate] = useReducer(setMainState, {
        "removeClients": [], "removedelete": false, "editstatus": {}, "editstatus": false, "editstatusdata": {},
        "statusdata": Object.keys(status_data), "status": {}
    });
    const setFilter = ({ ...params }) => {
        dispatchstate({ status: { field: params.field, operator: 'contains', value: params.value } })
    }
    const FilterButtons = () => {
        return (
            <>
                {mainstate.status.value && (<Button variant="all" className="bg-gradient-primary" onClick={() => setFilter({})} style={{ marginLeft: 20, marginTop: 20 }}>All</Button>)}
                {mainstate.statusdata.map((element, index) => {
                    let filterobj = { field: 'status', key: 'staus', value: element }
                    return (
                        <>
                            {![element].includes(mainstate.status.value) && (<Button variant={element}
                                className="bg-gradient-primary"
                                onClick={() => setFilter(filterobj)}
                                style={{ marginLeft: 20, marginTop: 20 }}>
                                {status_data[element]}
                            </Button>)}
                            {(index + 1) % 4 == 0 && (<br />)}
                        </>
                    )
                })}
            </>

        )
    }
    const columns = [
        { field: 'comname', headerName: 'Company Name', width: 130 },
        { field: 'contactpers', headerName: 'Contact Person', width: 130 },
        { field: 'mobile', headerName: 'Mobile', width: 130 },
        { field: 'state', headerName: 'State', width: 130 },
        {
            field: 'status', headerName: 'Status', width: 130, renderCell: (params) => {
                let status_value = params.value
                return status_data[status_value]
            }
        },
        {
            field: 'id', headerName: "Action", width: 130, renderCell: (params) => {
                let SelectItem = (params) => {
                    dispatchstate({ editstatus: true, editstatusdata: { clientid: params.id, desc: params.client_talk_desc, _statusdata: params.status, next_follow_date: params.next_follow_date } })
                }
                return (
                    <>
                        <Link to={`/app/editactivation?activationid=${params.value}`} key={"editactivation" + params.id}><i className="mdi mdi-pencil"></i></Link>
                        <Link to={`#`} style={{ marginLeft: 6 }} key={"status" + params.id} onMouseEnter={() => {
                            SelectItem(params.row)
                        }}><i className="mdi mdi-comment-account-outline"></i></Link>
                    </>
                )
            }
        },

    ]
    const handleStatusChange = (event) => {
        dispatchstate({ editstatusdata: { ...mainstate.editstatusdata, [event.target.name]: event.target.value } })
    }
    const handleClose = ({ ...params }) => {
        let interfacedata = params.statusdata
        if (params.submit) {
            let arraydata = Object.values(interfacedata)
            if (!arraydata.includes(null) && !arraydata.includes("")) {
                let data = {
                    status: interfacedata._statusdata,
                    clientid: interfacedata.clientid,
                    description: interfacedata.desc,
                    nextdate: interfacedata.next_follow_date,
                    userid: userid,
                    token: token
                }
                AddClientHistory(data).then((response) => {
                    if (response.data._code == 200) {
                        GetActivations()
                    }
                })
            }
        }
        dispatchstate({ editstatus: false })
    }
    const excelcolumns = [
        "email", "gstin", "mobile", "contactpers",
        "comname", "address", "pincode", "city",
        "state", "package", "status", "client_talk_desc",
        "next_follow_date", "leadtype", "bidpack", "productpack",
        "web_url", "amount_gst", "paymethod", "clienttype",
        "paymentdetails", "additional", "expdate"
    ]
    const [rows, setRows] = useState([])
    const [getactivations, setGetActivations] = useState(false);
    const { userid, token } = GetUserDetails()
    const navigate = useNavigate();
    const location = useLocation()
    const GetActivations = () => {
        Activations(userid, token).then((response) => {
            const data = response.data.data
            if (data) {
                setRows(response.data.data)
                setGetActivations(true)
            }
        })
    }
    useEffect(() => {
        GetActivations()
    }, [getactivations])
    const SaveDataExcel = (data) => {
        const response = {
            userid: userid,
            token: token,
            data: data,
            table_name: "clientsmaster",
            columns: Object.keys(data[0])
        }
        AddDataByExcel(response).then((response) => {
            if (response._code == 200) {
                GetActivations()
            }
        })
        return
    }

    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-account-multiple"></i>
                        </span>
                        Clients
                    </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"><button type="button"
                                onClick={() => {
                                    navigate("/app/createactivation", { state: { backpath: location.pathname } })
                                }} className="btn btn-gradient-primary btn-fw">Create</button></li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                {mainstate.removeClients.length > 0 && (
                                    <>
                                        <Button variant="outlined" onClick={() => {
                                            dispatchstate({ "removedelete": true })
                                        }}>Delete</Button>
                                        <DownloadExcel name="Export"
                                            columns={excelcolumns}
                                            excelname="Clients.xls"
                                            utilities={{
                                                ids: mainstate.removeClients,
                                                userid: userid,
                                                token: token
                                            }}
                                            style={{ marginLeft: 20 }}
                                            ExportFunction="ClientsDataByExcel"
                                        />
                                    </>
                                )
                                }
                                <br />
                                <FileUpload name="Import"
                                    columns={excelcolumns}
                                    passdatafunc={SaveDataExcel}
                                    style={{ marginTop: 20 }}
                                    applystyle={true}
                                    typefile=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />

                                <DownloadExcel name="Excel Structure"
                                    columns={excelcolumns}
                                    excelname="ClientsFormate.xls"
                                    style={{ marginLeft: 20, marginTop: 20 }}
                                    static={true} />
                                <div className="table-responsive table-bordered">
                                    <FilterButtons />
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            filterModel={{ items: mainstate.status.value ? [mainstate.status] : [] }}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: Number(rows.length / 25 ? rows : 0), pageSize: 25 },
                                                }
                                            }}
                                            onRowSelectionModelChange={(data) => {
                                                dispatchstate({ "removeClients": data })
                                            }}
                                            pageSizeOptions={[25, 75, 100]}
                                            checkboxSelection
                                            style={{ marginTop: 20 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {mainstate.editstatus && (
                    <div>
                        <Dialog open={mainstate.editstatus} onClose={handleClose}>
                            <DialogTitle>{"Update Status"}</DialogTitle>
                            <DialogContent>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 280 }}>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="Description"
                                        type="text"
                                        name="desc"
                                        fullWidth
                                        variant="standard"
                                        onChange={handleStatusChange}
                                        value={mainstate.editstatusdata.desc}
                                    />
                                    <label for="Status" className="mt-2">Status</label>
                                    <Select
                                        id="Status"
                                        variant="standard"
                                        style={{ marginTop: 2 }}
                                        name="_statusdata"
                                        value={mainstate.editstatusdata._statusdata}
                                        onChange={handleStatusChange}
                                    >
                                        {mainstate.statusdata.map((response) => {
                                            return (
                                                <MenuItem value={response}>{status_data[response]}</MenuItem>)
                                        })}
                                    </Select>
                                    <label for="followupdate" className="mt-2">Next Follow-Up Date</label>
                                    <TextField
                                        margin="dense"
                                        id="followupdate"
                                        name="next_follow_date"
                                        type="date"
                                        fullWidth
                                        value={mainstate.editstatusdata.next_follow_date}
                                        onChange={handleStatusChange}
                                        variant="standard"
                                    />
                                </FormControl>
                                <DialogActions>
                                    {<Button onClick={handleClose}>Close</Button>}
                                    {<Button onClick={() => handleClose({ submit: true, statusdata: mainstate.editstatusdata })}>Change Status</Button>}
                                </DialogActions>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
                <div>
                    <Dialog
                        open={mainstate.removedelete}
                        onClose={() => {
                            dispatchstate({ "removeClients": [] })
                            dispatchstate({ "removedelete": false })
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {`Are You Sure! Want To Remove ${mainstate.removeClients.length > 1 ? 'Client Details' : 'Client Detail'}?`}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => {
                                dispatchstate({ "removeClients": [] })
                                dispatchstate({ "removedelete": false })
                            }}>No</Button>
                            <Button onClick={() => {
                                RemoveClientsData(mainstate.removeClients).then((response) => {
                                    let getresponse = response.data;
                                    if (getresponse._code == 200) {
                                        setRows(getresponse.data)
                                        dispatchstate({ "removedelete": false })
                                    }
                                })
                            }} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>)
}