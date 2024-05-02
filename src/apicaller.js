import axios from "axios";
import { GetUserDetails } from "./tools/tools";

export const Authenticate = async (getuserid, getpassword) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + "login", { userid: getuserid, password: getpassword }).then((response) => {
        responseget = response
    })
    return responseget
}

export const UserRes = async (getuserid, token) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.post(REACT_APP_API_ + "resuser", { userid: getuserid, loginuserid: userid, token: token_ }).then((response) => {
        responseget = response
    })
    return responseget
}

export const ActivationDetail = async (activationid) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "activationdetail", { params: { activationid: activationid, userid: userid, token: token_ } }).then((response) => {
        responseget = response
    })
    return responseget
}

export const Logout = async (userid) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.post(REACT_APP_API_ + "logout", { userdata: { "userid": userid, "token": token_ } }).then((response) => {
        responseget = response
    })
    return responseget
}

export const GetKeywordsPage = async () => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "pagekeywords" + "?userid=" + userid + "&token=" + token_).then((response) => {
        responseget = response
    })
    return responseget
}


export const GetKeywords = async () => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "keywords/" + "?userid=" + userid + "&token=" + token_).then((response) => {
        responseget = response
    })
    return responseget
}

export const GetKeywordsOfLead = async (leadid) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.post(REACT_APP_API_ + "getkeywordsoflead", { "leadid": leadid, "userid": userid, "token": token_ }).then((response) => {
        responseget = response
    })
    return responseget
}

export const KeywordsName = async () => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.get(REACT_APP_API_ + "keywordsname").then((response) => {
        responseget = response
    })
    return responseget
}


export const UpdateKeyword = async (keyworddata) => {
    var { userid, token } = GetUserDetails()
    var token_ = token
    keyworddata["userid"] = userid
    keyworddata["token"] = token_
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.put(REACT_APP_API_ + "updatekeyword", keyworddata).then((response) => {
        responseget = response
    })
    return responseget
}

export const UpdateTicket = async (ticketdata) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.put(REACT_APP_API_ + "changeticket", { ticketdata: ticketdata, userid: userid, token: token_ }).then((response) => {
        responseget = response
    })
    return responseget
}

export const DeleteKeyword = async (keyworddata) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.delete(REACT_APP_API_ + "deletekeyword", { params: { userid: userid, token: token_ }, data: keyworddata }).then((response) => {
        responseget = response
    })
    return responseget
}

export const CreateKeyword = async (keyword) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.post(REACT_APP_API_ + "createkeyword", { keyword: keyword, userid: userid, token: token_ }).then((response) => {
        responseget = response
    })
    return responseget
}

export const ChangeActivation = async (getActivationDetail = Object) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    getActivationDetail.userid = userid
    getActivationDetail.token = token_
    const res = await axios.post(REACT_APP_API_ + "changeactivation", getActivationDetail).then((response) => {
        responseget = response
    })
    return responseget
}

export const Users = async (format_change = false, userid, token) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.post(REACT_APP_API_ + "Users", { change: format_change, loginuserid: Number(userid), token_: token }).then((response) => {
        responseget = response
    })
    return responseget
}

export const RemoveUsers = async (getuserid) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.delete(REACT_APP_API_ + `remuser/${getuserid}`, { params: { loginuserid: userid, token: token_ } }).then((response) => {
        responseget = response
    })
    return responseget
}

export const Userids = async (userid, token) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var path = `userids/?loginuserid=` + userid + `&token_=` + token
    const res = await axios.get(REACT_APP_API_ + path).then((response) => {
        responseget = response
    })
    return responseget
}

export const UpdateUser = async (Userdetail) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    Userdetail.loginuserid = Number(userid)
    Userdetail.token = token_
    const res = await axios.put(REACT_APP_API_ + "updateuser", Userdetail).then((response) => {
        responseget = response
    })
    return responseget
}

export const Activations = async () => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "activations", { params: { loginuserid: userid, token_: token_ } }).then((response) => {
        responseget = response
    })
    return responseget
}

export const GetTickets = async () => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "tickets", { params: { userid: userid, token: token_ } }).then((response) => {
        responseget = response
    })
    return responseget
}

export const GetTicket = async (id) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "getticket", { params: { userid: userid, token: token_, ticketid: id } }).then((response) => {
        responseget = response
    })
    return responseget
}

export const AddTaskClient = async (Taskdata) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    Taskdata.token = token_
    Taskdata.userid = userid
    const res = await axios.post(REACT_APP_API_ + "addclienttask", { "taskdata": Taskdata }).then((response) => {
        responseget = response
    })
    return responseget
}

export const AddTicketData = async (Ticketdata) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    Ticketdata.token = token_
    Ticketdata.userid = userid
    const res = await axios.post(REACT_APP_API_ + "addticket", Ticketdata).then((response) => {
        responseget = response
    })
    return responseget
}

export const TasksData = async (tasksdata) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    tasksdata.token = token_
    tasksdata.userid = userid
    const res = await axios.post(REACT_APP_API_ + "tasksdata", tasksdata).then((response) => {
        responseget = response
    })
    return responseget
}

export const AddUser = async (Userdetail) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + "adduser", Userdetail).then((response) => {
        responseget = response
    })
    return responseget
}

export const UpdateClientStatus = async (data) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + "updateclientstatus", data).then((response) => {
        responseget = response
    })
    return responseget
}

export const LeadsData = async (todaylist = 0, archive = 0, client = 0, close = 0, userid, token) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.get(REACT_APP_API_ + "leads?todolist=" + String(todaylist) + "&archive=" + String(archive) + "&close=" + String(close) + "&client=" + String(client) + "&userid=" + String(userid) + "&token=" + String(token)).then((response) => {
        responseget = response
    })
    return responseget
}
export const ActivationHistoriesData = async (activationid) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.get(REACT_APP_API_ + "clientshistorydata?activation_id=" + String(activationid) + "&userid=" + String(userid) + "&token=" + String(token_)).then((response) => {
        responseget = response
    })
    return responseget
}
export const AddActivation = async (activationdata) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + `newactivation`, { "activation": activationdata }).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const RemoveLeadsData = async (leadsids) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.delete(REACT_APP_API_ + "removeleads", { params: { userid: userid, token: token_ }, data: leadsids }).then((response) => {
        responseget = response
    })
    return responseget
}

export const RemoveTicketsData = async (ticketsids) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.delete(REACT_APP_API_ + "removetickets", { params: { userid: userid, token: token_ }, data: ticketsids }).then((response) => {
        responseget = response
    })
    return responseget
}

export const RemoveClientsData = async (clientsids) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.delete(REACT_APP_API_ + "removeclients", { params: { userid: userid, token: token_ }, data: clientsids }).then((response) => {
        responseget = response
    })
    return responseget
}

export const UnArchiveLeadsData = async (leadsids) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.put(REACT_APP_API_ + "unarchiverecords", { ids: leadsids, userid: userid, token: token_ }).then((response) => {
        responseget = response
    })
    return responseget
}

export const LeadData = async (leadid, userid, token) => {
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    const res = await axios.post(REACT_APP_API_ + "leaddata", { "leadid": leadid, loginuserid: userid, token_: token }).then((response) => {
        responseget = response
    })
    return responseget
}

export const CheckEmailMobileNumberExists = async (data) => {
    var { userid, token } = GetUserDetails()
    var token_ = token
    data["userid"] = userid
    data["token"] = token_
    var responseget = Object()
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + "checkuniqueemailmobilelead", data).then((response) => {
        responseget = response
    })
    return responseget
}

export const LeadHistoryStatus = async (leadid, userid, token) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + `historyleadstatus`, { "leadid": leadid, loginuserid: Number(userid), token_: token }).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const ModifyLead = async (leaddata) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    leaddata["userid"] = userid
    leaddata["token"] = token_
    const res = await axios.put(REACT_APP_API_ + `leadchange`, { "lead": leaddata }).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const SearchMaster = async (searchdata) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    var { userid, token } = GetUserDetails()
    var token_ = token
    searchdata["userid"] = userid
    searchdata["token"] = token_
    const res = await axios.post(REACT_APP_API_ + `searchmaster`, searchdata).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const ClientsDataByExcel = async (data) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + `exportclients`, data).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const LeadsDataByExcel = async (data) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + `exportdataleads`, data).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const AddDataByExcel = async (data) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + `insertbyexcel`, data).then((response) => {
        responseget = response;
    })
    return responseget;
}

export const AddLead = async (leaddata) => {
    var responseget = Object();
    const REACT_APP_API_ = process.env.REACT_APP_API_URL;
    const res = await axios.post(REACT_APP_API_ + `addlead`, leaddata).then((response) => {
        responseget = response;
    })
    return responseget;
}