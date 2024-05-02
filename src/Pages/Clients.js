import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useReducer, useState } from "react"
import { GetUserDetails, PathActive } from "../tools/tools"
import { Activations, RemoveClientsData, UpdateClientStatus, AddDataByExcel, Users, SearchMaster } from "../apicaller"
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
    MenuItem,
    Snackbar,
    Alert,
    Stack
} from "@mui/material";
import { DownloadExcel, FileUpload } from "../Components/Button"
import { Search } from "../Components/Search"
import { DomainSearchViews, rights } from "../ImportVariables"
import $ from "jquery"
import "../css/styles.css"
import "../css/font.scss"

export const ClientsLeads = () => {
    const status_data = {
        satisfied: "Satisfied",
        pending: "Pending",
        active: "Active",
        passive: "Passive",
        expired: "Expired",
        unsatisfied: "Unsatisfied"
    }
    const [searchdata, setSearchData] = useState({})
    const setMainState = (mainstate, action) => {
        return { ...mainstate, ...action }
    }
    let alertdata = {
        "show": false,
        "type": "",
        "message": ""
    }
    const [mainstate, dispatchstate] = useReducer(setMainState, {
        "removeClients": [], "removedelete": false, "editstatus": {}, "editstatus": false, "editstatusdata": {},
        "statusdata": Object.keys(status_data), "status": {},
        "alert": alertdata
    });
    const passSearchedData = () => {
        return searchdata.searchinfo
    }
    const GetDetails = () => {
        return { users: Users }
    }
    const SearchChange = ({ target }) => {
        var cardbody = $(".card-body")
        setSearchData(preState => ({
            ...preState,
            ['searchinfo']: target.value
        }))
        const display = popover.css("display")
        if (display == "none") {
            popover.fadeTo(200, 1)
            cardbody.css("z-index", 9999)
        }
        if (!target.value) {
            popover.css("display", "none")
            cardbody.css("z-index", 0)

        }
    }
    const setAlert = ({ ...params }) => {
        dispatchstate({ status: params })
    }
    const setFilter = ({ ...params }) => {
        dispatchstate({ status: { field: params.field, operator: 'contains', value: params.value } })
    }
    const FilterOptions = () => {
        return (
            <>
                {mainstate.status.value && (<Link variant="all" onClick={() => setFilter({})}>All</Link>)}
                {mainstate.statusdata.map((element, index) => {
                    let filterobj = { field: 'status', key: 'staus', value: element }
                    return (
                        <>
                            {![element].includes(mainstate.status.value) && (<Link variant={element}
                                onClick={() => setFilter(filterobj)}
                            >
                                {status_data[element]}
                            </Link>)}
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
                    dispatchstate({
                        editstatus: true,
                        editstatusdata: {
                            clientid: params.id,
                            desc: params.client_talk_desc,
                            _statusdata: params.status,
                            next_follow_date: params.next_follow_date
                        }
                    })
                }
                return (
                    <>
                        {(rights.changeclientstatus[typeuser]?.includes(department) || typeuser == "admin") &&
                            (<Link to={`/app/editactivation?activationid=${params.value}`} key={"editactivation" + params.id}><i className="mdi mdi-pencil"></i></Link>)}
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
            let data = {
                status: interfacedata._statusdata,
                clientid: interfacedata.clientid,
                description: interfacedata.desc,
                nextdate: interfacedata.next_follow_date,
                userid: userid,
                token: token
            }
            UpdateClientStatus(data).then((response) => {
                if (response.data._code == 200) {
                    GetActivations()
                    dispatchstate({ alert: { show: true, message: response.data.message, type: "success" } })
                }
                else {
                    dispatchstate({ alert: { show: true, message: response.data.message, type: "errpr" } })
                }
            })
        }
        dispatchstate({ editstatus: false })
    }
    const getSearchData = (params) => {
        const body = {
            table_name: 'a3Jpc2huYXByYWJodQ==',
            ...params
        }
        SearchMaster(body).then((response) => {
            if (response.data._code == 200) {
                setRows(response.data.data)
            }
            else if (response.data._code == 404) {
                setRows([])
            }
        })
    }
    const excelcolumns = [
        "email", "gstin", "mobile", "contactpers",
        "comname", "address", "pincode", "city",
        "state", "package", "status", "saleuser",
        "teleuser", "bidpack", "productpack",
        "web_url", "amount_gst", "paymethod", "clienttype",
        "paymentdetails", "additional", "expdate"
    ]
    const [rows, setRows] = useState([])
    const [getactivations, setGetActivations] = useState(false);
    const { userid, token, typeuser, department } = GetUserDetails()
    const navigate = useNavigate();
    const location = useLocation()
    const GetActivations = () => {
        Activations(userid, token).then((response) => {
            const data = response.data.data
            if (data) {
                setRows(data ? data : [])
                setGetActivations(true)
            }
        })
    }
    var popover = $("#myPopover");
    const DefaultLayoutCard = () => {
        var cardbody = document.getElementsByClassName("card-body")
        if (cardbody[0]) {
            cardbody[0].style.zIndex = 0
        }
        var popover = document.getElementById("myPopover")
        if (popover) {
            popover.style.display = "none"
        }
    }
    useEffect(() => {
        document.body.addEventListener('click', (event) => {
            const target = event.target
            if (!["downarrow", "myPopover", " css-qbdosj-Input"].includes(target.id || target.className)) {
                DefaultLayoutCard()
            }
        });
    }, []);
    useEffect(() => {
        GetActivations()
    }, [getactivations])
    const SaveDataExcel = (data) => {
        const response = {
            userid: userid,
            token: token,
            data: data,
            table_name: "a3Jpc2huYXByYWJodQ==",
            columns: Object.keys(data[0])
        }
        AddDataByExcel(response).then((response) => {
            let data = response.data
            if (data._code == 200) {
                GetActivations()
                dispatchstate({ alert: { show: true, message: data.message, type: "success" } })
            }
            else {
                dispatchstate({ alert: { show: true, message: data.message, type: "error" } })
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
                <Snackbar open={mainstate.alert.show} autoHideDuration={6000} onClose={() => {
                    dispatchstate({ alert: alertdata })
                }}>
                    <Alert onClose={() => {
                        dispatchstate({ alert: alertdata })
                    }} severity={mainstate.alert.type} sx={{ width: '100%' }}>
                        {mainstate.alert.message}
                    </Alert>
                </Snackbar>
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <Search getsearchdata={passSearchedData} FieldsData={GetDetails} view={DomainSearchViews[location.pathname]} clearstate={GetActivations} passsearchdata={getSearchData} setsearchdata={SearchChange} />
                                <Stack spacing={2} direction="row">
                                    <div className="dropdown" style={{ marginTop: 12 }}>
                                        <button id="dropdownBtn" style={{ height: 40, width: 110 }} className="dropbtn"><i className="fa fa-filter"></i> Filters</button>
                                        <div className="dropdown-content" id="dropdownContent">
                                            <FilterOptions index={'firstthree'} />
                                        </div>
                                    </div>
                                    {mainstate.removeClients.length > 0 && (
                                        ((((rights.importexport[typeuser]?.includes(department) ||
                                            (rights.deleteclients[typeuser]?.includes(department))))) || typeuser == "admin") &&
                                        (
                                            <div className="dropdown" style={{ marginTop: 12 }}>
                                                <button id="dropdownBtn" style={{ height: 40, width: 110 }} className="dropbtn"><i className="fa fa-cog"></i> Actions</button>
                                                <div className="dropdown-content" id="dropdownContent">
                                                    {!PathActive("/app/archiveleads") && (
                                                        <>
                                                            <Link onClick={() => {
                                                                dispatchstate({ "removedelete": true })
                                                            }}>Delete</Link>
                                                            <DownloadExcel name="Export"
                                                                columns={excelcolumns}
                                                                excelname="Clients.xls"
                                                                utilities={{
                                                                    ids: mainstate.removeClients,
                                                                    userid: userid,
                                                                    token: token
                                                                }}
                                                                ExportFunction="ClientsDataByExcel"
                                                            />
                                                        </>
                                                    )
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    {((rights.importexport[typeuser]?.includes(department)) || (typeuser == "admin")) && (<div className="dropdownContent" style={{ marginTop: 12 }}>
                                        <Link className="defaultActions" style={{ position: "absolute", right: 15, marginTop: 6 }}><i style={{ marginTop: 5 }} class="fa fa-cog"></i></Link>
                                        <div className="dropDownAction" style={{ position: "absolute", right: 15, marginTop: 40 }}>
                                            <FileUpload name="Import"
                                                columns={excelcolumns}
                                                passdatafunc={SaveDataExcel}
                                                applystyle={true}
                                                style={{ marginLeft: 20, color: "black" }}
                                                typefile=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />

                                            <DownloadExcel name="Excel Structure"
                                                columns={excelcolumns}
                                                excelname="ClientsFormate.xls"
                                                style={{ marginLeft: 20 }}
                                                static={true} />
                                        </div>
                                    </div>)}
                                </Stack>
                                <div className="table-responsive table-bordered">
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
                                        setRows(getresponse.data ? getresponse.data : [])
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