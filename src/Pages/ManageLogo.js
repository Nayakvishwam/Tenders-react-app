import { Button, Link, Stack } from "@mui/material";
import React from "react";

const ManageLogo = () => {
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                        <i className="mdi mdi-web"></i>
                    </span> <Link to={"#"} style={{ color: "black", textDecoration: 'none' }}>Manage Website</Link>
                </h3>
                <div className="row mt-2">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Manage Website</h4>
                                <form className="forms-sample">
                                    <div className="form-group">
                                        <label for="pagetitle">Page Title</label>
                                        <input type="text" className="form-control" id="pagetitle" placeholder="Page Title" />
                                    </div>
                                    <div className="form-group">
                                        <label for="weblogo">Website Logo</label>
                                        <Stack direction="row" alignItems="center" id="weblogo" spacing={2}>
                                            <Button variant="contained" component="label" className="btn btn-gradient-primary">
                                                Upload
                                                <input hidden accept="image/*" multiple type="file" />
                                            </Button>
                                        </Stack>
                                    </div>
                                    <button type="button" className="btn btn-gradient-primary me-2">Submit</button>
                                    <button className="btn btn-light">Cancel</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}
export default ManageLogo