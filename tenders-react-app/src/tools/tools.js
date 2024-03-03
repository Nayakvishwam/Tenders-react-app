import { ReactSession } from 'react-client-session';
import { useLocation, useNavigate } from 'react-router';
import { UserRes } from '../apicaller';
import { useState } from 'react';
export const PathActive = (path) => {
    let location = useLocation()
    return location.pathname === path ? true : false
}

export const ClearLocalStorage = (key) => {
    localStorage.clear(key);
}

export const LocalStorageItem = (localkey) => {
    let localitem = localStorage.getItem(localkey)
    if (localitem) {
        return localitem
    }
    return false
}

export const CheckSessionData = (sessionkey) => {
    if (ReactSession.get(sessionkey)) {
        return true
    }
    return false
}


export const RemoveSessionData = (sessionkey) => {
    if (CheckSessionData(sessionkey)) {
        ReactSession.remove(sessionkey)
        return true
    }
    else {
        console.error("Sorry Key Details Not Avalible !!")
        return false
    }
}

export const PageLoad = (flag = false) => {
    window.location.reload(flag)
}

export const PassBaseCss = (base, fistheight, sameheight, TotalLength) => {
    return (base + fistheight) + sameheight * (TotalLength - 1)
}

export const GetUserDetails = () => {
    return JSON.parse(LocalStorageItem("auth_details"))
}
export const SearchCondition = ([...params]) => {
    let query = [];
    params.map((response, index) => {
        if (response.value) {            
            query.push([response.name,
            response.type == "text" ?
                `%${response.value}%` :
                `${response.value}`,
            response.type == "text" ?
                'like' :
                '=',
            ])
        }
    })
    return query
}
export const RequestAuthenticator = ({ ...details }) => {
    const authenticationdetails = GetUserDetails()
    const [passcomponent, setPassComponent] = useState(false)
    let navigate = useNavigate()
    let { userid, token } = authenticationdetails
    if (userid && token) {
        let UserDetails = UserRes(Number(userid), token).then((res) => {
            var userdata = res.data
            if (userdata._code == 200) {
                userdata = userdata.data
                setPassComponent(true)
            }
            else {
                ClearLocalStorage("auth_details")
                navigate("/app")
            }
        });
        return passcomponent ? details.children : false
    }
    else {
        navigate("/app")

    }
}