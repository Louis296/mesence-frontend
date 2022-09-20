import React from "react";
import "antd/dist/antd.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Login";
import Message from "./Message";
import Client from "./Client";

class App extends React.Component{
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<Client/>}/>
                {/*<Route path="/login" element={<Login/>}/>*/}
                {/*<Route path="/main" element={<Message/>}/>*/}
            </Routes>
        </BrowserRouter>
    }
}

export default App;