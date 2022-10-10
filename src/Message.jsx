import {Button, Input, List} from "antd";
import React, {forwardRef, useImperativeHandle, useState} from "react";


class Message extends React.Component{

    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     console.log(nextProps)
    //     return true
    // }

    render() {
        return (<div>
            <div style={{margin: '16px 0',}}/>
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    minHeight: 700,
                }}
            >
                <List
                    size="large"
                    dataSource={this.props.data}
                    split={false}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />
            </div>
            <div style={{margin: '16px 0'}}/>
            <Input.Group compact>
                <Input style={{ width: 'calc(100% - 70px)' }}
                       placeholder="请输入信息"
                       id="message_input"/>
                <Button type="primary" onClick={this.props.onSendClick}>发送</Button>
            </Input.Group>
        </div>)
    }
}

export default Message