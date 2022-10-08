import "./css/message.css"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Button, Empty, Input, Layout, Menu, Space} from 'antd';
import React, {useImperativeHandle, useRef, useState} from 'react';
import Cookies from "js-cookie";
import Message from "./Message";

const { Header, Content, Footer, Sider } = Layout;

function Main(props){
    let data = [];
    const [collapsed, setCollapsed] = useState(false);
    const [friend,setFriend]=useState({});
    let messageChild=React.createRef();

    console.log('friend:',friend)

    const onMenuClick=(e)=>{
        console.log('click',e)
        console.log(e.item.props.info)
        setFriend(e.item.props.info)
    }

    const onSendClick=()=>{
        const msg=document.getElementById("message_input").value
        messageChild.current.addMsg("<--  "+msg)
        const message={
            Type:"word",
            Data:{
                To:friend.Friend.Phone,
                Content:msg,
                SendTime:"2022-10-07T15:28:05+08:00"
            }
        }
        props.sendMessage(message)
    }

    const onMessageReceive=(message)=>{
        messageChild.current.addMsg("--> "+message.Data.Content)

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
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={onMenuClick} items={props.friends} />
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
                    {Object.keys(friend).length===0 ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />:
                        <Message data={data} onRef={messageChild} onSendClick={onSendClick}/>
                    }
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