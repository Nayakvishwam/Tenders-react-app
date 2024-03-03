import { Routes, Route } from "react-router";
import App from "./App";
import Login from "./Pages/login";
import { RequestAuthenticator } from "./tools/tools";
import Page404  from "./Pages/Error404";

const CustomRouter = () => {
    return (
        <Routes>
            <Route exact path='app/' element={< Login />}></Route>
            <Route path="app/*" element={
                <RequestAuthenticator>
                    <App />
                </RequestAuthenticator>
            }>
            </Route>
            {/* <Route path="*" element={< Page404 />}></Route> */}
        </Routes>
    )
}
export default CustomRouter