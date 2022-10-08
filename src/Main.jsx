import "./css/message.css"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Button, Input, Layout, Menu, Space} from 'antd';
import React, {useImperativeHandle, useRef, useState} from 'react';
import Cookies from "js-cookie";
import Message from "./Message";

const { Header, Content, Footer, Sider } = Layout;

function Main(props){
    let data = [];
    const [collapsed, setCollapsed] = useState(false);
    // const [friend,setFriend]=useState(null);
    let contentSub=React.createRef();

    const onMenuClick=(e)=>{
        console.log('click',e)
    }

    const onSendClick=()=>{
        const msg=document.getElementById("message_input").value
        contentSub.current.addMsg("<--  "+msg)
        //TODO: 根据不同好友生成to字段
        const message={
            Type:"word",
            Data:{
                To:"b",
                Content:msg,
                SendTime:"2022-10-07T15:28:05+08:00"
            }
        }
        props.sendMessage(message)
    }

    const onMessageReceive=(message)=>{
        contentSub.current.addMsg("--> "+message.Data.Content)

    }

    useImperativeHandle(props.onRef,()=>({
        onMessageReceive:onMessageReceive
    }))

    return <div>
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo">Mesence</div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={onMenuClick} items={[props.friends]} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    {props.userInfo!=null ?
                    <Space>
                        欢迎用户 {props.userInfo.Name}
                        <Button danger onClick={()=>{
                            Cookies.remove("userToken")
                            localStorage.clear()
                            window.location.href=`${window.location.origin}`
                        }}>退出登录</Button>
                    </Space> : <div/>}
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <div style={{margin: '16px 0',}}/>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 700,
                        }}
                    >
                        <Message data={data} onRef={contentSub}/>
                    </div>
                    <div style={{margin: '12px 0'}}/>
                    <Input.Group compact>
                        <Input style={{ width: 'calc(100% - 100px)' }}
                               placeholder="请输入信息"
                               id="message_input"/>
                        <Button type="primary" onClick={onSendClick}>发送</Button>
                    </Input.Group>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                </Footer>
            </Layout>
        </Layout>
    </div>
}

export default Main