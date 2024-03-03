import React, { useState, useEffect, useReducer } from "react";
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import "../css/search.css"
import { DataGrid } from "@mui/x-data-grid";
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import "../js/dashboard.js"
import "../js/todolist.js"
import "../css/kanban.css"
import {
    Stack, Button, Dialog,
    DialogActions,
    DialogTitle, Alert, Snackbar,
    DialogContent, TextField,
    FormControl, MenuItem, Select, Popover, Typography, Pagination
} from "@mui/material";
import {
    LeadData, ModifyLead, LeadsData,
    RemoveLeadsData, GetKeywordsOfLead, UnArchiveLeadsData,
    AddDataByExcel,
    SearchMaster,
    Users
} from "../apicaller";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { GetUserDetails, PathActive } from "../tools/tools";
import {
    ImportFilterCoulmnsPaths, ImportNameByPath,
    ImportLeadsChiefData, ImportForLeadsDialogBox,
    BlankDs,
    DomainSearchViews
} from "../ImportVariables";
import { DownloadExcel, FileUpload } from "../Components/Button.js";
import { Search } from "../Components/Search.js";
import $ from "jquery"

const Leads = () => {
    const FilterCoulmnsPaths = ImportFilterCoulmnsPaths
    const [rows, setRows] = useState(BlankDs);
    const NameByPath = ImportNameByPath
    const FilterShows = () => {
        return FilterCoulmnsPaths.includes(location.pathname) ? true : false
    }
    const [leadsgroupbystatus, setLeadsGroupByStatus] = useState({
        "data": []
    })
    const [showdata, setShowData] = useState(false);
    const [Open, setOpen] = useState('');
    const chiefdata = ImportLeadsChiefData
    const ChiefDetails = (chiefdetails, action) => {
        return { ...chiefdetails, ...action }
    }
    const [searchdata, setSearchData] = useState({})
    const [chiefdetails, dispatchChiefDetails] = useReducer(ChiefDetails, chiefdata);
    const navigate = useNavigate();
    let status = '';
    let { userid, token } = GetUserDetails();
    let token_ = token;
    const [leaddata, setLeadData] = useState('');
    const StatusFilter = (filterstatus, action) => {
        return action
    }
    const [filterstatus, dispatch] = useReducer(StatusFilter, { 'status': null })
    const location = useLocation()
    const state = location.state
    const status_data = {
        "wait": "Lead",
        "cold": "Cold",
        "hot": "Hot",
        "prospect": "Prospect",
        "dead": "Dead",
        "close": "Close"
    }
    const AlertApply = (AlertData, action) => {
        return {
            "type": action.type,
            "message": action.message
        }
    }
    const setView = ({ ...params }) => {
        dispatchChiefDetails({
            view: {
                "table": false,
                "kanban": false,
                ...params
            }
        })
    }
    const [AlertData, dispatchalert] = useReducer(AlertApply, { "message": null, "type": null })
    let todaylist = 0;
    let archive = PathActive("/app/archiveleads") ? 1 : 0;
    let client = PathActive("/app/clientleads") ? 1 : 0;
    let close = PathActive("/app/closeleads") ? 1 : 0;
    const handleClickOpenStatusBox = (id, show) => {
        DefaultLayoutCard()
        const leaddata = LeadData(id, userid, token_).then((response) => {
            setLeadData(response.data.data)
            if (show) {
                setOpen('show')
                return
            }
            setOpen('update')
        })
    };

    const UpdateLeadFunc = () => {
        var leadsdata = LeadsData(todaylist, archive, client, close, userid, token_).then((res) => {
            if (res.data._code = 200 || res.data._code == 404) {
                if (res.data.data) {
                    setRows(res.data.data)
                    return
                }
                setRows([])
            }
            else {
                setShowData(false)
            }
        })
    }
    const UpdateLeadStatus = (leadinfo) => {
        ModifyLead(leadinfo).then((response) => {
            let data = response.data
            if (data._code === 200) {
                dispatchalert({ type: "success", message: "Update Status Details Success Fully!" })
                dispatchChiefDetails({ "showAlert": true })
                UpdateLeadFunc()
            }
        })
    }
    const LeadStatusError = () => {
        dispatchalert({ type: "error", message: "Required All Status Details" })
        dispatchChiefDetails({ "showAlert": true })
    }
    const handleCloseStatusBox = (cancle_flag = false) => {
        if (cancle_flag === false) {
            let leadinfo = leaddata;
            leadinfo["userid"] = userid;
            if (leadinfo.status == "dead" || leadinfo.status == "close") {
                leadinfo["next_follow_date"] = null
            }
            if (["close", "dead"].includes(leadinfo.status)) {
                UpdateLeadStatus(leadinfo)
                setOpen(false)
                return;
            }
            leadinfo.status && leadinfo.client_talk_desc && leadinfo.next_follow_date ?
                UpdateLeadStatus(leadinfo)
                : LeadStatusError()

        }
        setOpen(false)
    };
    const GetDetails = () => {
        return { users: Users }
    }
    useEffect(() => {
        if (userid) {
            if (state) {
                if (state.page == "todolist") {
                    todaylist = 1
                }
            }
            dispatchChiefDetails({ "conditionlogin": true })
            UpdateLeadFunc()
            if (state) {
                if (state.typelead) {
                    dispatch({ 'status': state.typelead })
                }
            }
        }
        else {
            dispatchChiefDetails({ "conditionlogin": false })
        }
    }, [showdata])

    const handlePopoverOpen = (id, event) => {
        let target = event.currentTarget
        GetKeywordsOfLead(id).then((response) => {
            if (response.data._code == 200) {
                let keywords = response.data.data
                if (keywords) {
                    dispatchChiefDetails({ "popkeywords": { "anchorEl": target, "keywords": keywords, "open": true } })
                }
            }
        })
    };

    const handlePopoverClose = () => {
        dispatchChiefDetails({ "popkeywords": { "keywords": BlankDs, "open": false } })
        dispatchChiefDetails({ "anchorEl": null })
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatchChiefDetails({ "showAlert": false })
    };

    const handleClose = (remove = false, unarchive = false) => {
        if (unarchive === true) {
            let leadsdata = UnArchiveLeadsData(chiefdetails.rowSelected).then((response) => {
                let showleads = response.data;
                if (showleads._code == 200) {
                    if (showleads.data) {
                        setRows(showleads.data)
                    }
                    else {
                        setRows(BlankDs)
                    }
                }
                else {
                    dispatchalert({ "type": "error", "message": showleads.message })
                    dispatchChiefDetails({ "showAlert": true })
                }
                dispatchChiefDetails({ "UnArchiveLead": false })
                return;
            })
            return
        }
        if (remove === true) {
            let leadsdata = RemoveLeadsData(chiefdetails.rowSelected).then((response) => {
                let showleads = response.data;
                if (showleads._code == 200) {
                    if (showleads.data._code === 200) {
                        if (showleads.data.data) {
                            setRows(showleads.data.data);
                            dispatchalert({ "type": "success", "message": "Remove Details Success Fully !" })
                            dispatchChiefDetails({ "showAlert": true })
                        }
                        else {
                            setRows(BlankDs);
                        }
                    }
                    else if (showleads.data._code == 404) {
                        setRows(BlankDs);
                    }
                }
                dispatchChiefDetails({ "RemoveLead": false })
                return;
            })
        }
        dispatchChiefDetails({ "UnArchiveLead": false })
        dispatchChiefDetails({ "RemoveLead": false })
    }
    const FilterStatusButtons = (index = null) => {
        if (index.index === 'firstthree') {
            return (
                <>
                    {filterstatus.status && (<Button variant="all" className="bg-gradient-primary" onClick={() => dispatch({ "status": null })}>All</Button>)}
                    {filterstatus.status != "wait" && (<Button variant="wait" className="bg-gradient-primary" onClick={() => dispatch({ "status": "wait" })}>Lead</Button>)}
                    {filterstatus.status != "hot" && (<Button variant="hot" className="bg-gradient-primary" onClick={() => dispatch({ "status": "hot" })}>Hot</Button>)}
                    {filterstatus.status != "cold" && (<Button variant="cold" className="bg-gradient-primary" onClick={() => dispatch({ "status": "cold" })}>Cold</Button>)}
                    {filterstatus.status != "prospect" && (<Button variant="prospect" className="bg-gradient-primary" onClick={() => dispatch({ "status": "prospect" })}>Po</Button>)}
                </>
            )
        }
    }
    const ColumnsProvide = (getcolumns) => {
        let actions = {
            field: 'id', headerName: 'Actions', width: 130, renderCell: (params) => {
                return (
                    <>
                        <Link to={`/app/editlead?leadid=${params.value}`} state={{ "backpath": location.pathname, name: NameByPath[location.pathname] }}><i className="mdi mdi-pencil"></i></Link>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to={"#"} onMouseEnter={() => chiefdetails.NoOpenStatusBox == false ? handleClickOpenStatusBox(params.value) : false}><i className="mdi mdi-comment-account-outline"></i></Link>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to={"#"} onMouseEnter={() => chiefdetails.NoOpenStatusBox == false ? handleClickOpenStatusBox(params.value, true) : false}><i className="mdi mdi-eye"></i></Link>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography style={{ color: "blue" }}
                            aria-owns={chiefdetails.popkeywords.open ? `mouse-over-popover${params.value}` : undefined}
                            aria-haspopup={`${params.value}`}
                            onMouseEnter={(ev) => handlePopoverOpen(params.value, ev)}
                            onMouseLeave={handlePopoverClose}>
                            <i className="mdi mdi-key"></i>
                        </Typography>
                        <Popover
                            id={`mouse-over-popover${params.value}`}
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={chiefdetails.popkeywords.open}
                            anchorEl={chiefdetails.popkeywords.anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <KeywordsPopUp />
                        </Popover>
                    </>
                )
            }
        }
        getcolumns.push(actions)
        return getcolumns
    }
    const KeywordsPopUp = () => {
        let keywords = ""
        chiefdetails.popkeywords.keywords.map((response) => {
            keywords += response.label + ";\n"
        })
        return <Typography sx={{ p: 1 }}>
            {keywords}
        </Typography>
    }
    const columns = [
        { field: 'comname', headerName: 'Company Name', width: 130 },
        { field: 'contactpers', headerName: 'Contact Person', width: 130 },
        { field: 'mobile', headerName: 'Mobile', width: 130 },
        { field: 'state', headerName: 'State', width: 130 },
        {
            field: 'status', headerName: 'Status', width: 130, renderCell: (params) => {
                let status_value = params.value
                status += status_value;
                if (Object.keys(status_data).includes(status_value)) {
                    status_value = status_data[status_value]
                }
                return (
                    status_value
                )
            }
        },
    ]
    const excelcolumns = ["email", "gstin", "mobile", "contactpers",
        "comname", "address", "pincode", "city",
        "state", "package", "status", "client_talk_desc",
        "next_follow_date", "leadtype"]
    const FilterSet = () => {
        if (filterstatus.status) {
            return [{ field: 'status', operator: 'contains', value: filterstatus.status }]
        }
        return BlankDs
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
            if (!["downarrow", "myPopover"].includes(target.id)) {
                DefaultLayoutCard()
            }
        });
    }, []);
    const SaveDataExcel = (data) => {
        const response = {
            userid: userid,
            token: token,
            data: data,
            table_name: "leadsmaster",
            columns: Object.keys(data[0])
        }
        AddDataByExcel(response).then((response) => {
            if (response._code == 200) {
                UpdateLeadFunc()
                dispatchalert({ type: "success", message: "Add Leads Details Success Fully!" })
                dispatchChiefDetails({ "showAlert": true })
            }
        })
        return
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
    const getSearchData = (params) => {
        const body = {
            table_name: 'leadsmaster',
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

    const passSearchedData = () => {
        return searchdata.searchinfo
    }

    return (
        <div className="main-panel">
            {chiefdetails.conditionlogin && (<div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-information"></i>
                        </span> {NameByPath[location.pathname]}
                    </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page">{FilterShows() && !PathActive("/app/closeleads") && (<button type="button" onClick={() => {
                                navigate("/app/newlead");
                            }} className="btn btn-gradient-primary btn-fw">Create</button>)}</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <Search getsearchdata={passSearchedData} FieldsData={GetDetails} view={DomainSearchViews[location.pathname]} clearstate={UpdateLeadFunc} passsearchdata={getSearchData} setsearchdata={SearchChange} />
                                <ul style={{ display: "flex", border: "1px", listStyleType: "none", justifyContent: "right", alignItems: "right" }}>
                                    <li>
                                        <Link onClick={() => {
                                            setView({ table: true })
                                        }}>
                                            <i className="mdi mdi-apps-box"></i>
                                        </Link>
                                    </li>
                                    <li style={{ marginLeft: 8 }}>
                                        <Link>
                                            <i className="mdi mdi-lan" onClick={() => {
                                                setView({ kanban: true })
                                            }}></i>
                                        </Link>
                                    </li>
                                </ul>
                                <h4 className="card-title" style={{ marginTop: 20 }}> {PathActive("/app/closeleads") ? "Close" : filterstatus.status ? status_data[filterstatus.status] : "Leads"}</h4>
                                {chiefdetails.rowSelected.length > 0 && chiefdetails.NotValidField.field != "id" && (<Stack spacing={2} direction="row">
                                    {!PathActive("/app/archiveleads") && (
                                        <>
                                            <Button variant="outlined" onClick={() => {
                                                dispatchChiefDetails({ "RemoveLead": true })
                                            }}>Delete</Button>
                                            <DownloadExcel name="Export"
                                                columns={excelcolumns}
                                                excelname="Leads.xls"
                                                utilities={{
                                                    ids: chiefdetails.rowSelected,
                                                    userid: userid,
                                                    token: token,
                                                    table_name: 'leadsmaster',
                                                    base_dependency: 'id'
                                                }}
                                                style={{ marginLeft: 20 }}
                                                ExportFunction="LeadsDataByExcel"
                                            />
                                        </>
                                    )
                                    }
                                    {PathActive("/app/archiveleads") && chiefdetails.NotValidField.field != "id" && (<Button variant="outlined" onClick={() => {
                                        dispatchChiefDetails({ "UnArchiveLead": true })
                                    }}>UnArchive</Button>)}
                                </Stack>)}
                                <Stack direction="row" style={{ marginTop: 20 }}>
                                    <FileUpload name="Import" columns={excelcolumns} passdatafunc={SaveDataExcel}
                                        typefile=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    />
                                    <DownloadExcel name="Excel Structure"
                                        columns={excelcolumns}
                                        excelname="LeadsFormate.xls"
                                        style={{ marginLeft: 20 }}
                                        static={true} />
                                </Stack>
                                <div className="table-responsive table-bordered">
                                    {!PathActive("/app/closeleads") && chiefdetails.view.table ? <Stack spacing={1} direction="row" style={{ justifyContent: "left", marginTop: 8 }}>
                                        <FilterStatusButtons index={'firstthree'} />
                                    </Stack> : null}
                                    <div style={{ height: 400, width: '100%' }}>
                                        {chiefdetails.view.table && (<DataGrid
                                            rows={rows}
                                            columns={FilterShows() ? ColumnsProvide(columns) : columns}
                                            filterModel={{
                                                items: filterstatus.status ? FilterSet() : []
                                            }}
                                            disableColumnMenu
                                            onCellClick={(params) => {
                                                if (params.field == "comname" && location.pathname != "/app/archiveleads") {
                                                    navigate(`/app/editlead?leadid=${params.id}`, { state: { backpath: location.pathname, name: NameByPath[location.pathname] } })
                                                    return
                                                }
                                                if (params.field == "id") {
                                                    dispatchChiefDetails({ "NoOpenStatusBox": chiefdetails.rowSelected.length > 0 ? false : true })
                                                    dispatchChiefDetails({ "NotValidField": params })
                                                }
                                            }}
                                            onRowSelectionModelChange={(data) => {
                                                if (data.length > 0 && chiefdetails.NotValidField.field == "id") {
                                                    dispatchChiefDetails({ "rowSelected": data })
                                                    return
                                                }
                                                if (!data && chiefdetails.NotValidField.field == "id") {
                                                    dispatchChiefDetails({ "rowSelected": BlankDs })
                                                    return
                                                }
                                                if (data.length > 0 && chiefdetails.NotValidField.field != "id") {
                                                    dispatchChiefDetails({ "rowSelected": data })
                                                    return
                                                }
                                                else {
                                                    dispatchChiefDetails({ "NotValidField": {} })
                                                    dispatchChiefDetails({ "rowSelected": BlankDs })
                                                    return
                                                }
                                            }}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: Number(rows.length / 25 ? rows : 0), pageSize: 25 },
                                                }
                                            }}
                                            pageSizeOptions={[25, 75, 100]}
                                            checkboxSelection
                                            style={{ marginTop: 20 }}
                                        />)}
                                        {chiefdetails.view.kanban && (
                                            <>
                                                <div className="lanes">
                                                    {
                                                        Object.keys(status_data).map((response) => {
                                                            return <div className="swim-lane bg-gradient-primary" id="todo-lane">
                                                                <h3 className="heading">{status_data[response]}</h3>
                                                                <div className="task" draggable="true">
                                                                    <p>Get groceries</p>
                                                                </div>
                                                                <div className="task" draggable="true">
                                                                    <p>Get groceries</p>
                                                                </div>
                                                                <div className="task" draggable="true">
                                                                    <p>Get groceries</p>
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                                <Stack spacing={2} style={{ position: "absolute", right: 0, bottom: 20 }}>
                                                    <Pagination count={10} />
                                                </Stack>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {chiefdetails.RemoveLead && (
                                    <div>
                                        <Dialog
                                            open={chiefdetails.RemoveLead}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {`Are You Sure! Want To Remove ${chiefdetails.rowSelected.length > 1 ? 'Leads Details' : 'Lead Detail'}?`}
                                            </DialogTitle>
                                            <DialogActions>
                                                <Button onClick={handleClose}>No</Button>
                                                <Button onClick={() => handleClose(true, false)} autoFocus>
                                                    Yes
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                )}
                                {chiefdetails.UnArchiveLead && (
                                    <div>
                                        <Dialog
                                            open={chiefdetails.UnArchiveLead}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {`Are You Sure! Want To UnArchive ${chiefdetails.rowSelected.length > 1 ? 'Leads Details' : 'Lead Detail'}?`}
                                            </DialogTitle>
                                            <DialogActions>
                                                <Button onClick={handleClose}>No</Button>
                                                <Button onClick={() => handleClose(false, true)} autoFocus>
                                                    Yes
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
            }
            {
                chiefdetails.showAlert && (
                    <Snackbar open={chiefdetails.showAlert} autoHideDuration={6000} onClose={() => handleCloseAlert()}>
                        <Alert onClose={() => handleCloseAlert()} severity={AlertData.type} sx={{ width: '100%' }}>
                            {AlertData.message}
                        </Alert>
                    </Snackbar>
                )
            }
            {
                ImportForLeadsDialogBox.includes(Open) &&
                (<div>
                    <Dialog open={ImportForLeadsDialogBox.includes(Open)} onClose={() => handleCloseStatusBox(true)}>
                        <DialogTitle>{(Open != "show" ? "Update" : "") + "Status"}</DialogTitle>
                        <DialogContent>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 280 }}>
                                <TextField
                                    value={leaddata.client_talk_desc}
                                    inputProps={{ readOnly: Open == "show" ? true : false }}
                                    margin="dense"
                                    id="name"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={({ target }) => {
                                        setLeadData((data) => ({
                                            ...data,
                                            client_talk_desc: target.value
                                        }))
                                    }}
                                />
                                <label for="Status" className="mt-2">Status</label>
                                <Select
                                    value={leaddata.status}
                                    inputProps={{ readOnly: Open == "show" ? true : false }}
                                    onChange={({ target }) => {
                                        setLeadData((data) => ({
                                            ...data,
                                            status: target.value
                                        }))
                                    }}
                                    id="Status"
                                    variant="standard"
                                    style={{ marginTop: 2 }}
                                >
                                    {Object.keys(status_data).map((response) => {
                                        return <MenuItem value={response}>{status_data[response]}</MenuItem>
                                    })}
                                </Select>
                                {leaddata.status != "dead" && leaddata.status != "close" && (
                                    <>
                                        <label for="followupdate" className="mt-2">Next Follow-Up Date</label>
                                        <TextField
                                            value={leaddata.next_follow_date}
                                            inputProps={{ readOnly: Open == "show" ? true : false }}
                                            autoFocus
                                            margin="dense"
                                            id="followupdate"
                                            type="date"
                                            fullWidth
                                            variant="standard"
                                            onChange={({ target }) => {
                                                setLeadData(preState => ({
                                                    ...preState,
                                                    next_follow_date: target.value
                                                }))
                                            }}
                                        />
                                    </>
                                )}
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseStatusBox(true)}>{Open == "update" ? "Cancel" : "Close"}</Button>
                            {Open == "update" && <Button onClick={() => handleCloseStatusBox()}>Change Status</Button>}
                        </DialogActions>
                    </Dialog>
                </div>
                )
            }
        </div>
    )
}
export default Leads;

export const LeadsToday = () => { return Leads() }
export const ArchiveLeads = () => { return Leads() }
export const CloseLeads = () => { return Leads() }