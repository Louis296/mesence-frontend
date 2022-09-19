import React from "react";
import {Button, DatePicker, Space, version} from "antd";
import "antd/dist/antd.css"

class Home extends React.Component{
    render() {
        return <div className="Home">
            <h1>antd version: {version}</h1>
            <Space>
                <DatePicker />
                <Button type="primary">Primary Button</Button>
            </Space>
        </div>
    }
}

export default Home;