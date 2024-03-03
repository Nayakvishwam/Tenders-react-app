import { React, useState } from 'react'
import "../vendors/mdi/css/materialdesignicons.min.css"
import "../vendors/css/vendor.bundle.base.css"
import "../css/style.css"
import { Authenticate } from '../apicaller'
import "../js/off-canvas.js"
import "../js/hoverable-collapse.js"
import "../js/misc.js"
import { Alert, Snackbar } from '@mui/material'
import { useNavigate } from "react-router";
import { GetUserDetails } from '../tools/tools'

const Login = () => {
    const [getuserid, setId] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    let { userid } = GetUserDetails();
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [getpassword, setPassword] = useState(null);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowAlert(false);
    };
    const SetUserData = async ({ ...params }) => {
        localStorage.setItem("auth_details", JSON.stringify(params))
        return
    }
    const AuthenticateUser = async () => {
        var response = await Authenticate(getuserid, getpassword)
        if (response.data.status_code == 200) {
            await SetUserData({
                userid: response.data.id,
                token: response.data._token,
                username: response.data.otherdetails.username,
                typeuser: response.data.otherdetails.typeuser
            })
            navigate('/app/dashboard')
        }
        else {
            setShowAlert(true);
            setMessage(response.data.message)
        }
    }
    return (
        <div className="content-wrapper d-flex align-items-center auth">
            {!userid && (
                <div className="row flex-grow">
                    <div className="col-lg-4 mx-auto">
                        <div className="auth-form-light text-left p-5">
                            <div className="brand-logo">
                                {/* <img src={Logo} alt='Not Load Image' /> */}
                            </div>
                            <h6 className="font-weight-light">Sign in to continue.</h6>
                            <form className="pt-3">
                                <div className="form-group">
                                    <input type="text" onChange={({ target }) => {
                                        setId(target.value)
                                    }} required className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Userid" />
                                </div>
                                <div className="form-group">
                                    <input type="password" onChange={({ target }) => {
                                        setPassword(target.value);
                                    }} required className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password" />
                                </div>
                                <div className="mt-3">
                                    {showAlert && (
                                        <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleClose}>
                                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                                {message}
                                            </Alert>
                                        </Snackbar>
                                    )}
                                    <button type='button' className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" onClick={AuthenticateUser}>SIGN IN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Login;