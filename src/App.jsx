import React from "react";
import "antd/dist/antd.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Message from "./Message";

class App extends React.Component{
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/main" element={<Message/>}/>
            </Routes>
        </BrowserRouter>
    }
}

export default App;