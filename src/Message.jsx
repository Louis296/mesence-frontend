import {Button, Input, List} from "antd";
import React, {forwardRef, useImperativeHandle, useState} from "react";


function Message(props){
    const [state,setState]=useState({data:props.data})
    const addMsg=(msg)=>{
        props.data.push(msg)
        console.log(props.data)
        setState({
            data:props.data
        })
    }
    useImperativeHandle(props.onRef,()=>({
        addMsg:addMsg
    }))
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
                dataSource={state.data}
                split={false}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
        </div>
        <div style={{margin: '16px 0'}}/>
        <Input.Group compact>
            <Input style={{ width: 'calc(100% - 70px)' }}
                   placeholder="请输入信息"
                   id="message_input"/>
            <Button type="primary" onClick={props.onSendClick}>发送</Button>
        </Input.Group>
    </div>)
}

export default Message