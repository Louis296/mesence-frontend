import {Button, List} from "antd";
import {forwardRef, useImperativeHandle, useState} from "react";


function CommunicateContent(props){
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
        <List
            size="large"
            dataSource={state.data}
            split={false}
            renderItem={item => <List.Item>{item}</List.Item>}
        />
    </div>)
}

export default CommunicateContent