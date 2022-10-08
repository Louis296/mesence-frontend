import React from "react";
import "antd/dist/antd.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Client from "./Client";

class App extends React.Component{
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<Client/>}/>
            </Routes>
        </BrowserRouter>
    }
}

export default App;