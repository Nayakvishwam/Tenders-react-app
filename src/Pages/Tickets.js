import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router";
import { GetTickets, RemoveTicketsData } from "../apicaller";
import { Link } from "react-router-dom";

export const Tickets = () => {
    const navigate = useNavigate();
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
    const setDataFunc = (maincontent, action) => {
        return { ...maincontent, ...action }
    }
    const [content, dispatch] = useReducer(setDataFunc, {
        "status": { field: "status", operator: 'contains', value: null },
        ids: [],
        openremovedialog: false
    })
    const [getdataflag, setGetDataFlag] = useState(false)
    const [rows, setRows] = useState([])
    const columns = [
        {
            field: 'type', headerName: 'Type', width: 130, renderCell: (params) => {
                return ticketstype[params.value]
            }
        },
        {
            field: 'status', headerName: 'Status', width: 130, renderCell: (params) => {
                return statusdata[params.value]
            }
        },
        {
            field: 'date', headerName: 'Date', width: 130
        },
        {
            field: 'id', headerName: 'Actions', width: 130, renderCell: (params) => {
                return <Link to={`/app/editticket?ticketid=${params.value}`}><i className="mdi mdi-pencil"></i></Link>
            }
        }
    ]
    useEffect(() => {
        GetTickets().then((response) => {
            if (response.data._code == 200) {
                if (response.data.data) {
                    setRows(response.data.data)
                }
            }
        })
        setGetDataFlag(true)
    }, [getdataflag])
    const setFilter = ({ ...params }) => {
        dispatch({ status: { field: params.field, operator: 'contains', value: params.value } })
    }
    const FilterStatusButtons = () => {
        return (<>
            {content.status.value && (<Button variant="all" className="bg-gradient-primary" style={{ marginBottom: 12 }} onClick={() => {
                setFilter({ field: 'status', value: null })
            }}>All</Button>)}
            {Object.keys(statusdata).map((response) => {
                return (
                    <>
                        {![content.status.value].includes(response) && (
                            <Button variant={response}
                                className="bg-gradient-primary"
                                style={{ marginLeft: 12, marginBottom: 12 }}
                                onClick={() => {
                                    setFilter({ field: 'status', value: response })
                                }}>
                                {statusdata[response]}
                            </Button>)}
                    </>
                )
            })}
        </>)
    }
    const handleClose = (remove = false) => {
        if (remove) {
            RemoveTicketsData(content.ids).then((response) => {
                if (response.data._code == 200) {
                    if (response.data.data) {
                        setRows(response.data.data)
                    }
                    if(response.data.data==null){
                        setRows([])
                    }
                }
            })
        }
        dispatch({ ids: [] })
        dispatch({ openremovedialog: false })
    }
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3>
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-book-multiple"></i>
                        </span>
                        Tickets
                    </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page">{(<button type="button" onClick={() => {
                                navigate("/app/addticket", { state: { "page": "tickets" } });
                            }} className="btn btn-gradient-primary btn-fw">Create</button>)}</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title" style={{ marginTop: 20 }}>
                                    Tickets
                                </h4>
                                {content.ids?.length > 0 && (<Button variant="outlined" style={{ marginBottom: 20 }} onClick={() => {
                                    dispatch({ openremovedialog: true })
                                }}>Delete</Button>)}
                                <div className="table-responsive table-bordered">
                                    <FilterStatusButtons />
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            filterModel={{ items: content.status.value ? [content.status] : [] }}
                                            checkboxSelection
                                            onRowSelectionModelChange={(data) => {
                                                if (data.length) {
                                                    dispatch({ ids: data })
                                                    return
                                                }
                                                dispatch({ ids: [] })
                                            }}
                                        >
                                        </DataGrid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {content.ids.length && (
                    <div>
                        <Dialog
                            open={content.openremovedialog}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {`Are You Sure! Want To Remove ${content.ids.length > 1 ? 'Leads Details' : 'Lead Detail'}?`}
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
            </div>
        </div>
    )
}