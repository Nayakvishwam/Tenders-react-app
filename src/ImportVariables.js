import { GetUserDetails } from "./tools/tools"
import statescities from "./States_Cities.json"
export const BlankDs = []

export const ImportFilterCoulmnsPaths = ['/app/leads', '/app/todoleads', '/app/clients', '/app/closeleads']

export const ImportNameByPath = {
    "/app/leads": "Leads",
    "/app/clients": "Activation",
    "/app/archiveleads": "Archive Leads",
    "/app/todoleads": "MyToDoList",
    "/app/closeleads": "Close"
}

export const ImportStates = Object.keys(statescities.meta_data)
export const ImportCities = statescities.meta_data
export const DomainSearchViews = {
    "/app/leads": "leads",
    "/app/todoleads": "todoleads",
    "/app/closeleads": "closeleads",
    "/app/archiveleads": "archiveleads",
    "/app/clients": "clients",
}

export const ImportLeadsChiefData = {
    "rowSelected": BlankDs,
    "keywords": BlankDs,
    "searchpassdata": {
        "users": null
    },
    "RemoveLead": false,
    "UnArchiveLead": false,
    "showAlert": false,
    "conditionlogin": false,
    "anchorEl": null,
    "popkeywords": {
        "keywords": BlankDs,
        "open": false
    },
    "NotValidField": {},
    "NoOpenStatusBox": false,
    "view": {
        "table": true,
        "kanban": false
    }
}

export const ImportStatusData = {
    "wait": "Lead",
    "cold": "Cold",
    "hot": "Hot",
    "prospect": "Prospect",
    "close": "Close",
    "dead": "Dead"
}

export const ImportForLeadsDialogBox = ['show', 'update']

export const ImportEditLeadChiefData = {
    "keywordsname": BlankDs,
    "alertdata": {},
    "users": BlankDs,
    "CreateKeywordData": "",
    "CreatekeywordFlag": false,
    "Editleadstatusfalg": false
}

export const ImportLeadType = {
    "online": "Online",
    "meeting": "Meeting"
}
export const ImportPackageActivation = {
    "tenderalert": "Tender Alert",
    "bidding": "Bidding",
    "productlisting": "Product Listing",
    "gembid": "Gem Bid",
    "directorder": "Direct order",
    "OEMPanel": "OEM Panel",
    "MSME": "MSME",
    "DSC": "DSC",
    "ISO": "ISO",
    "trademark": "Trademark",
    "NSIC": "NSIC",
    "BIS": "BIS",
    "training": "Training"
}
export const ImportPackage = {
    "Tenderinfo": "Tender Information",
    "gemregestration": "Gem Regestration",
    "biding": "Biding",
    "productlisting": "Product Listing",
    "reseller": "Reseller",
    "oem": "Oem",
    "iso": "Iso",
    "teadmark": "Tread Mark",
    "dsc": "Dsc"
}


export const ImportTagsBasedStatusEditLead = ["close", "dead"]

export const ImportEditUserStartDetails = {
    "getusedetailsflag": true,
    "currentedituserid": "userid",
    "editusername": "username",
    "department": "department",
    "usertypeinfo": "department"
}

export const ImportDepartmentNames = {
    "sales": "Sales",
    "custcar": "Customer Care",
    "Techanical": "Techanical"
}

export const ImportuserTypesDetails = {
    "executive": "Executive",
    "teamlead": "Team Leader",
    "manager": "Manager"
}
export const UserTypesImport = ["executive", "teamlead", "manager"]

export const ImportDepartments = ["sales", "custcar", "Techanical"]
export const rights = {
    taskclient: {
        department: [
            "sales"
        ],
        typeuser: [
            "admin",
            "executive",
            "teamlead",
            "manager"
        ]
    },
    user: {
        typeuser: [
            'admin'
        ]
    },
    viewleads: {
        "executive": ["sales"],
        "manager": ["sales"],
    },
    importexport: {
        "admin": ["sales",
            "custcar",
            "Techanical"],
        "manager": ["sales"]
    },
    deletelead: {
        "executive": [
            "sales",
        ],
        "manager": ["sales"]
    },
    addlead: {
        "executive": [
            "sales",
        ],
        "manager": ["sales"]
    },
    updatelead: {
        "executive": [
            "sales",
        ],
        "manager": ["sales"]
    },
    viewclients: {
        "executive": ["sales"],
    },
    changeclientstatus: {
        "executive": ["Techanical", "custcar"],
        "manager": ["custcar", "Techanical"],
    },
    deleteclients: {
        "manager": ["sales", "Techanical"]
    }
}

let { userid, token } = GetUserDetails()
let token_ = token

export const NewLeadObjectImport = {
    "gstin": null,
    "comName": null,
    "contactpers": null,
    "mobile": null,
    "email": null,
    "address": null,
    "pincode": null,
    "keyword_ids": BlankDs,
    "city": null,
    "state": null,
    "tele_id": null,
    "sale_person_id": null,
    "loginuserid": Number(userid),
    "token_": token_,
    "selectedpackages": BlankDs,
    "leadtype": null,
    "package": {
        "Tenderinfo": "Tender Information",
        "gemregestration": "Gem Regestration",
        "biding": "Biding",
        "productlisting": "Product Listing",
        "reseller": "Reseller",
        "oem": "Oem",
        "iso": "Iso",
        "teadmark": "Tread Mark",
        "dsc": "Dsc"
    }
}

export const NewActivationImport = {
    "gstin": null,
    "comname": null,
    "contactpers": null,
    "mobile": null,
    "email": null,
    "address": null,
    "city": null,
    "state": null,
    "status": "pending",
    "bidpack": null,
    "productpack": null,
    "weburl": null,
    "tele_id": null,
    "sale_person_id": null,
    "loginuserid": Number(userid),
    "_token": token_,
    "package": null,
    "paymethod": null,
    "clienttype": null,
    "paymentdetails": null,
    "additional": null,
    "technicalperson": null,
    "expdate": null,
    "amountgst": null
}
export const DefaultDataTmportNewUser = {
    "userids": BlankDs,
    "alertdata": {
        "showAlert": false,
        "typemessage": null,
        "message": null
    }
}