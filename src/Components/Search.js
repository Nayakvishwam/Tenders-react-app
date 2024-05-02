import $ from "jquery"
import { useState, useEffect } from "react";
import { SearchCondition } from "../tools/tools";
import { GetKeywords } from "../apicaller";
import Select from 'react-select'
const variables = await import("../ImportVariables")

{/* <field name="keywordid" type="number" dropdown="yes" relationtypes="yes" dependsstateflag="keywords" reactselect="yes" multiple="yes" isfilter="yes">
    Keywords
</field>    */}
{/* <field name="keywordid" type="number" dropdown="yes" relationtypes="yes" dependsstateflag="keywords" reactselect="yes" multiple="yes" isfilter="yes">
    Keywords
</field>    */}
{/* <field name="keywordid" type="text" relationtypes="yes" dropdown="yes" dependsstateflag="keywords" reactselect="yes" multiple="yes" isfilter="yes">
    Keywords
</field>     */}
export const ReadXml = ({ ...params }) => {
    let today = new Date().toISOString().slice(0, 10)
    var xmlString = `
    <search>
        <view name="leads">
            <fields>
                <field name="comname" type="text">
                    Company Name
                </field>
                <field name="mobile" type="number">
                    Phone Number
                </field>
                <field name="contactpers" type="text">
                    Contact Person
                </field>
                <field name="create_user_id" type="number" dropdown="yes" dependsstateapi="users" filterfield="typesuser" filtervalue="executive" value="id" showdata="username" isfilter="yes">
                    Executive User
                </field>
                <field name="email" type="text">
                    Email
                </field>
                <field name="state" type="text" dropdown="yes" importname="ImportStates" anydepends="yes" isfilter="yes">
                    State
                </field>
                <field name="city" type="text" dropdown="yes" importname="ImportCities" dependsstate="state" isfilter="yes">
                    City
                </field>
            </fields>
        </view>
        <view name="clients">
            <fields>
                <field name="comname" type="text">
                    Company Name
                </field>
                <field name="mobile" type="number">
                    Phone Number
                </field>
                <field name="contactpers" type="text">
                    Contact Person
                </field>
                <field name="create_user_id" type="number" dropdown="yes" dependsstateapi="users" filterfield="typesuser" filtervalue="executive" value="id" showdata="username" isfilter="yes">
                    Executive User
                </field>
                <field name="email" type="text">
                    Email
                </field>
                <field name="state" type="text" dropdown="yes" importname="ImportStates" anydepends="yes" isfilter="yes">
                    State
                </field>
                <field name="city" type="text" dropdown="yes" importname="ImportCities" dependsstate="state" isfilter="yes">
                    City
                </field>
            </fields>
        </view>
        <view name="todoleads">
            <fields>
                <field name="comname" type="text">
                    Company Name
                </field>
                <field name="mobile" type="number">
                    Phone Number
                </field>
                <field name="contactpers" type="text">
                    Contact Person
                </field>
                <field name="create_user_id" type="number" dropdown="yes" dependsstateapi="users" value="id" filterfield="typesuser" filtervalue="executive" showdata="username" isfilter="yes">
                    Executive User
                </field>
                <field name="email" type="text">
                    Email
                </field>
                <field name="state" type="text" dropdown="yes" importname="ImportStates" anydepends="yes" isfilter="yes">
                    State
                </field>
                <field name="city" type="text" dropdown="yes" importname="ImportCities" dependsstate="state" isfilter="yes">
                    City
                </field>
            </fields>
        </view>
        <view name="closeleads">
            <fields>
                <field name="comname" type="text">
                    Company Name
                </field>
                <field name="mobile" type="number">
                    Phone Number
                </field>
                <field name="contactpers" type="text">
                    Contact Person
                </field>
                <field name="keywordid" type="number" dropdown="yes" relationtypes="yes" dependsstateflag="keywords" reactselect="yes" multiple="yes" isfilter="yes">
                    Keywords
                </field>   
                <field name="create_user_id" type="number" dropdown="yes" dependsstateapi="users" value="id" filterfield="typesuser" filtervalue="executive" showdata="username" isfilter="yes">
                    Executive User
                </field>
                <field name="email" type="text">
                    Email
                </field>
                <field name="state" type="text" dropdown="yes" importname="ImportStates" anydepends="yes" isfilter="yes">
                    State
                </field>
                <field name="city" type="text" dropdown="yes" importname="ImportCities" dependsstate="state" isfilter="yes">
                    City
                </field>
            </fields>
        </view>
        <view name="archiveleads">
            <fields>
                <field name="comname" type="text">
                    Company Name
                </field>
                <field name="mobile" type="number">
                    Phone Number
                </field>
                <field name="contactpers" type="text">
                    Contact Person
                </field>
                <field name="create_user_id" type="number" dropdown="yes" dependsstateapi="users" value="id" filterfield="typesuser" filtervalue="executive" showdata="username" isfilter="yes">
                    Executive User
                </field>
                <field name="email" type="text">
                    Email
                </field>
                <field name="state" type="text" dropdown="yes" importname="ImportStates" anydepends="yes" isfilter="yes">
                    State
                </field>
                <field name="city" type="text" dropdown="yes" importname="ImportCities" dependsstate="state" isfilter="yes">
                    City
                </field>
            </fields>
        </view>
        <context name="leads">{}</context>
        <context name="todoleads">{}</context>
        <context name="closeleads">{}</context>
        <context name="archiveleads">{}</context>
        <context name="clients">{}</context>
        <domain name="clients">[['active',false,'=']]</domain>
        <domain name="leads">[['active',false,'='],['status','close','!='],['confirm_client',true,'is not']]</domain>
        <domain name="todoleads">[['active',false,'='],['status','close','!='],['confirm_client',true,'is not'],['next_follow_date','${today}','=']]</domain>
        <domain name="closeleads">[['active',false,'='],['status','close','='],['confirm_client',true,'is not']]</domain>
        <domain name="archiveleads">[['active',true,'='],['status','close','!='],['confirm_client',true,'is not']]</domain>
    </search>
    `
    var view_fields_domain = {
        fields: [],
        domain: [],
        context: {}
    }
    var xmlDoc = $.parseXML(xmlString);
    const view = $(xmlDoc).find(`view[name='${params.view}']`)
    view.find('fields').each(function () {
        const fields = $(this).children();
        fields.each(function () {
            var field = $(this);
            view_fields_domain.fields.push({
                text: field.text().trim(),
                type: field.eq(0).attr('type'),
                name: field.eq(0).attr('name'),
                dropdown: field.eq(0).attr('dropdown') == "yes" ? true : false,
                isfilter: field.eq(0).attr('isfilter') == "yes" ? true : false,
                reactselect: field.eq(0).attr('reactselect') == "yes" ? true : false,
                multiple: field.eq(0).attr('multiple') == "yes" ? true : false,
                importname: field.eq(0).attr('importname'),
                depends: field.eq(0).attr('dependsstate') ? field.eq(0).attr('dependsstate') : false,
                anydepends: field.eq(0).attr('anydepends') ? true : false,
                dependsstateflag: field.eq(0).attr('dependsstateflag') ? field.eq(0).attr('dependsstateflag') : false,
                dependsstateapi: field.eq(0).attr('dependsstateapi') ? field.eq(0).attr('dependsstateapi') : false,
                value: field.eq(0).attr('value') ? field.eq(0).attr('value') : false,
                showdata: field.eq(0).attr('showdata') ? field.eq(0).attr('showdata') : false,
                filterfield: field.eq(0).attr('filterfield') ? field.eq(0).attr('filterfield') : false,
                filtervalue: field.eq(0).attr('filtervalue') ? field.eq(0).attr('filtervalue') : false
            })
        })
    })
    view_fields_domain.domain.push(JSON.parse($(xmlDoc).find(`domain[name='${params.view}']`).text().trim().replace(/'/g, '"')))
    view_fields_domain.context = { ...{}, ...JSON.parse($(xmlDoc).find(`context[name='${params.view}']`).text().trim().replace(/'/g, '"')) }
    return view_fields_domain
}

let mergedata = {
    "mergedata": {
        "keywordid": {
            "data": [],
            "dependsfield": "keywordid",
            "dependstable": "leads_keywords_lines",
            "maintablefield": "id",
            "operator": "in"
        }
    }
}
export const Search = ({ ...params }) => {
    const { fields, domain, context } = ReadXml({ view: params.view })
    const SearchPass = params.passsearchdata
    const [filter, setFilter] = useState(false)
    const [dependsdata, setDependsData] = useState({
        "state": null
    })
    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: 160, // Set the width of the dropdown
            height: 2, // Set the height of the dropdown
        }),
    }
    useEffect(() => {
        const info = params.FieldsData()
        Object.keys(info).map((statekey) => {
            info[statekey]().then((response) => {
                var userdata = response.data
                if (userdata._code == 200) {
                    setDependsData(preState => ({
                        ...preState,
                        [statekey]: userdata.data
                    }))
                }
            })
        })
        GetKeywords().then((response) => {
            var data = response.data
            if (data._code == 200) {
                setDependsData(preState => ({
                    ...preState,
                    ["keywords"]: data.data
                }))
            }
        })
    }, [])
    const PopupHeight = () => {
        let popupheight = 0
        fields.map((response) => {
            if (!isNaN(params.getsearchdata())) {
                if (response.type == "number") {
                    popupheight += 1
                }
            }
            else if (response.type == "text") {
                popupheight += 1
            }
        })
        return popupheight
    }
    const FilterPopupHeight = () => {
        let popupheight = 0
        fields.map((response) => {
            if (response.isfilter) {
                popupheight += 1
            }
        })
        return popupheight
    }
    var popover = $("#myPopover");
    var cardbody = $(".card-body")
    const Managepopup = () => {
        const display = popover.css("display")
        if (display == "none") {
            popover.fadeTo(200, 1)
            setFilter(true)
            cardbody.css("z-index", 9999)
        }
        else {
            setFilter(false)
            popover.css("display", "none")
            cardbody.css("z-index", 0)
        }
    };
    const [selectedsearchinfo, setSelectedSearchInfo] = useState("")
    const SelectedSearch = ({ ...params }) => {
        const searchparams = SearchCondition([params])
        SearchPass({ searchds: searchparams, domain: domain, context: context, dependsentities: Object.values(mergedata.mergedata) })
    }
    const MultiSearchSubmit = (event) => {
        event.preventDefault()
        let searchdata = new FormData(event.target)
        searchdata = Object.fromEntries(searchdata)
        searchdata = Object.entries(searchdata).filter(([key, value]) => value.trim() !== "" && key != "keywordid")
        if (searchdata.length > 0) {
            searchdata = Object.fromEntries(searchdata)
            var data = Array.from(fields)
            data.map((response) => {
                response.value = searchdata[response.name]
                return response
            })
            const searchparams = SearchCondition(data)
            SearchPass({ searchds: searchparams, domain: domain, context: context, dependsentities: Object.values(mergedata.mergedata) })
        }
    }
    const setOnChange = (field) => {
        return field.anydepends ? { onChange: handleChange } : {}
    }
    const handleChange = (event) => {
        setDependsData(preState => ({
            ...preState,
            [event.target.name]: event.target.value
        })
        )
    }
    const ProvideOptions = (field) => {
        const data = dependsdata.hasOwnProperty(field.dependsstateapi) ?
            dependsdata[field.dependsstateapi] :
            variables[field.importname]
        return data
    }
    return (
        <div id="container" className="mt-2">
            <div id="childcontainer">
                <i id="searchicon"></i>
                <div id="searchpart">
                    {selectedsearchinfo && (
                        <div style={{ width: 482, display: "flex" }} id="searchselected">
                            <div id="selectedsearch" style={{ backgroundColor: "Grey", borderRadius: 4, color: "white", width: 10 * selectedsearchinfo.length }}>
                                {selectedsearchinfo}
                                <a style={{ marginRight: 0, cursor: "pointer", color: "white", textDecoration: "none" }} onClick={() => {
                                    setSelectedSearchInfo("")
                                    params.clearstate()
                                }}><small>✕</small></a>
                            </div>
                        </div>
                    )}
                    {!selectedsearchinfo &&
                        (<input type="text" onChange={params.setsearchdata} onClick={() => { setFilter(false) }} id="searchinput" placeholder="Search" />
                        )}
                </div>
                <div id="arrowdiv">
                    <button id="downarrow" onClick={Managepopup}><i className="caret-down"></i></button>
                </div>
                <div className="popoverpass" style={{ top: 80, height: filter ? (fields.length == 1 ? 89 : 44) * FilterPopupHeight() : 30 * PopupHeight() }} id="myPopover">
                    <div className="popover-content" id="myPopover">
                        <ul style={{ listStyle: "none" }} id="myPopover">
                            <>
                                <form onSubmit={MultiSearchSubmit}>
                                    {fields.map((field) => {
                                        const FilterFields = () => {
                                            if (!isNaN(params.getsearchdata())) {
                                                if (field.type == "number") {
                                                    return (<li>
                                                        <a style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                                                            onClick={() => {
                                                                const searchdata = field.text + ":- " + params.getsearchdata()
                                                                setSelectedSearchInfo(searchdata)
                                                                SelectedSearch({ value: params.getsearchdata(), type: field.type, name: field.name })
                                                            }}>
                                                            <b>Search </b>{field.text} :-{params.getsearchdata()}
                                                        </a></li>)
                                                }
                                                return
                                            } else {
                                                if (field.type == "text") {
                                                    return (
                                                        <li>
                                                            <a style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    const searchdata = field.text + ":- " + params.getsearchdata()
                                                                    setSelectedSearchInfo(searchdata)
                                                                    SelectedSearch({ value: params.getsearchdata(), type: field.type, name: field.name })
                                                                }}
                                                            >
                                                                <b>Search </b>{field.text} :-{params.getsearchdata()}
                                                            </a>
                                                        </li>)
                                                }
                                            }
                                        }
                                        return (
                                            filter ?
                                                field.isfilter == true ?
                                                    <div style={{ marginTop: 3 }} id="myPopover">
                                                        {field.dropdown == true ?
                                                            field.depends ?
                                                                dependsdata[field.depends] ?
                                                                    (
                                                                        <>
                                                                            <lable for={field.name}>{field.text} :- </lable>
                                                                            <select id="myPopover" name={field.name}>
                                                                                {variables[field.importname]?.[dependsdata[field.depends]].map((response) => {
                                                                                    return <option value={response}>{response}</option>
                                                                                })}
                                                                            </select>
                                                                        </>
                                                                    ) : null :
                                                                field.reactselect ?
                                                                    <div className="keywordscontainer" id="myPopover">
                                                                        <lable for={field.name}>{field.text} :- </lable>
                                                                        <br />
                                                                        {dependsdata.keywords.map((response, index) => {
                                                                            return <>{(index + 1) % 4 == 0 ? <br /> : null}{response.label}:- <input type="checkbox" value={response.value} name={field.name} id="myPopover" onChange={(event) => {
                                                                                let data = mergedata.mergedata[event.target.name].data
                                                                                if (event.target.checked) {
                                                                                    mergedata.mergedata[event.target.name].data.push(Number(event.target.value))
                                                                                }
                                                                                else {
                                                                                    mergedata.mergedata[event.target.name].data = data.filter((response) => response != Number(event.target.value))
                                                                                }
                                                                            }} /> </>
                                                                        })
                                                                        }
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        <lable for={field.name}>{field.text} :- </lable>
                                                                        <select id="myPopover" name={field.name} {...setOnChange(field)}>
                                                                            {field.anydepends && !dependsdata[field.name] && (<option value="">--- Select Option ---</option>)}
                                                                            {ProvideOptions(field)?.map((response) => {
                                                                                if (field.filterfield) {
                                                                                    if (response[field.filterfield] == field.filtervalue) {
                                                                                        return <option value={field.value ? response[field.value] : response}>
                                                                                            {field.showdata ? response[field.showdata] : response}
                                                                                        </option>
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    return <option value={field.value ? response[field.value] : response}>{field.showdata ? response[field.showdata] : response}</option>
                                                                                }
                                                                            })}
                                                                        </select>
                                                                    </>
                                                            :
                                                            <input type={field.type} id="myPopover" name={field.name} />
                                                        }
                                                    </div> :
                                                    null
                                                :
                                                <FilterFields />
                                        )
                                    })}
                                    {filter && (
                                        <div className="row mt-2">
                                            <button id="downarrow" type="submit" className="bg-gradient-primary mt-2" style={{ width: 80, marginLeft: 12 }}>Apply</button>
                                            <button id="downarrow" type="button" className="bg-gradient-primary mt-2" onClick={() => {
                                                params.clearstate()
                                            }} style={{ width: 80, marginLeft: 12 }}>
                                                Clear
                                            </button>
                                        </div>
                                    )
                                    }
                                </form>
                            </>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}