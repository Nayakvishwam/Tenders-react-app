import React, { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { GetKeywordsPage, CreateKeyword, KeywordsName, UpdateKeyword, DeleteKeyword } from "../apicaller";
import {
    Stack, Button, Dialog,
    DialogActions,
    DialogTitle, Alert, Snackbar,
    DialogContent, TextField,
    FormControl
} from "@mui/material";


const Keywords = () => {
    // const data=
    const [keywords, setKeywords] = useState([]);
    const [keywordsname, setKeywordsName] = useState([]);
    const [getkeywords, setGetKeywords] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [createeditkeywordopen, setCreateEditKeywordOpen] = useState(false);
    const [editcreatekeywordopen, setEditCreateKeywordOpen] = useState(false);
    const [editkeyword, setEditKeyword] = useState("Create");
    const [showAlert, setShowAlert] = useState(false);
    const [typemessage, setTypeMessage] = useState('');
    const [message, setMessage] = useState(null);
    const [rowSelected, setRowSelected] = useState([]);
    const [RemoveKeyword, setRemoveKeyword] = useState(false);


    useEffect(() => {
        SetRequiredDetailsKeywords();
    }, [getkeywords])

    const SetRequiredDetailsKeywords = () => {
        GetKeywordsPage().then((response) => {
            if (response.data._code == 200) {
                KeywordsName().then((res) => {
                    if (res.data._code == 200) {
                        setKeywordsName(res.data.data)
                    }
                })
                setKeywords(response.data.data)
                setGetKeywords(true)
            }
            else {
                setGetKeywords(false)
            }
        })
    }

    const AlertSet = (message, type, alertflag = true) => {
        setTypeMessage(type)
        setMessage(message)
        setShowAlert(alertflag)
    }

    const handleClose = () => {
        setShowAlert(false)
    }

    const columns = [{
        field: 'name', headerName: 'Keywords', width: 130
    },
    {
        field: 'id', headerName: 'Actions', width: 130, renderCell: (params) => {
            return <Link to={`#`} onClick={() => {
                let geteditkeyword = keywords.filter((data) => data.id == params.value)
                setEditKeyword(geteditkeyword)
                setEditCreateKeywordOpen("Edit");
                setCreateEditKeywordOpen(true);
            }}><i className="mdi mdi-pencil"></i></Link>
        }
    }]
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-key-variant"></i>
                        </span> <Link to="/app/keywords" style={{ color: "black", textDecoration: 'none' }}>Keywords</Link>
                    </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"><button type="button" onClick={() => {
                                setEditKeyword([])
                                setEditCreateKeywordOpen("Create")
                                setCreateEditKeywordOpen(true)
                            }} className="btn btn-gradient-primary btn-fw">Create</button></li>
                        </ol>
                    </nav>
                </div>
                {getkeywords && (<div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                {rowSelected.length > 0 && (<Stack spacing={2} direction="row">
                                    <Button variant="outlined" onClick={() => {
                                        setRemoveKeyword(true);
                                    }}>Delete</Button>
                                </Stack>)}
                                <div className="table-responsive table-bordered">
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            rows={keywords}
                                            columns={columns}

                                            pageSizeOptions={[25, 75, 100]}
                                            onRowSelectionModelChange={(data) => {
                                                if (data.length > 0) {
                                                    setRowSelected(data);
                                                    return;
                                                }
                                                setRowSelected([]);
                                            }}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: Number(keywords.length ? keywords.length / 25 : 1), pageSize: 25 },
                                                }
                                            }}
                                            checkboxSelection
                                            style={{ marginTop: 20 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
            {createeditkeywordopen &&
                (<div>
                    <Dialog open={createeditkeywordopen} onClose={() => true}>
                        <DialogTitle>{editcreatekeywordopen} Keyword</DialogTitle>
                        <DialogContent>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 280 }}>
                                <label for="followupdate" className="mt-2">Name</label>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={editkeyword[0] ? editkeyword[0].name : null}
                                    onChange={({ target }) => {
                                        if (editcreatekeywordopen == "Edit") {
                                            let keywordvalue = target.value;
                                            setEditKeyword([{ "id": editkeyword[0].id, "name": keywordvalue }]);
                                        }
                                        setKeyword(target.value)
                                    }}
                                />
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setCreateEditKeywordOpen(false) }}>Cancel</Button>
                            <Button onClick={() => {
                                if (keywordsname.includes(keyword)) {
                                    setCreateEditKeywordOpen(false)
                                    AlertSet("Keyword Already Exists", "error")
                                    return
                                }
                                if (editcreatekeywordopen == "Edit") {
                                    setCreateEditKeywordOpen(false)
                                    UpdateKeyword(editkeyword[0]).then((response) => {
                                        if (response.data._code == 200) {
                                            AlertSet("Success Fully Keyword Update", "success");
                                            var keywordsnamedata = keywordsname
                                            keywordsnamedata.pop(editkeyword[0])
                                            keywordsnamedata.push(keyword)
                                            setKeywordsName(keywordsnamedata)
                                            setKeywords(response.data.data)
                                        }
                                    })
                                    return
                                }
                                CreateKeyword(keyword).then((response) => {
                                    if (response.data._code === 200) {
                                        if (keywords.length == 0) {
                                            setRowSelected([])
                                            SetRequiredDetailsKeywords();
                                            AlertSet("Success Fully Keyword Create", "success")
                                            return
                                        }
                                        AlertSet("Success Fully Keyword Create", "success")
                                        setKeywords(response.data.data)
                                        var keywordsnamedata = keywordsname
                                        keywordsnamedata.push(keyword)
                                        setKeywordsName(keywordsnamedata)
                                    }
                                })
                                setCreateEditKeywordOpen(false)
                            }}>{editcreatekeywordopen}</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                )}
            {RemoveKeyword && (
                <div>
                    <Dialog
                        open={RemoveKeyword}
                        onClose={() => setRemoveKeyword(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {`Are You Sure! Want To Remove ${rowSelected.length > 1 ? 'Keywords Details' : 'Keyword Detail'}?`}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => setRemoveKeyword(false)}>No</Button>
                            <Button onClick={() => {
                                DeleteKeyword(rowSelected).then((response) => {
                                    if (response.data._code == 200) {
                                        AlertSet("SuccessFully Keywords Details Delete", "success")
                                        let keywordsdata = response.data.data
                                        if (keywordsdata == null) {
                                            setGetKeywords(false)
                                            setKeywords([])
                                            setKeywordsName([])
                                            return;
                                        }
                                        setKeywords(keywordsdata)
                                    }
                                })
                                setRemoveKeyword(false)
                            }} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            {showAlert && (
                <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={typemessage} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
        </div>)
}
export default Keywords;