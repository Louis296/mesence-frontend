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
import {ListMessageRecord} from "./services/global";

const { Header, Content, Footer, Sider } = Layout;

function Main(props){
    const [messageList,setMessageList]=useState([])
    const [collapsed, setCollapsed] = useState(false)
    const [friend,setFriend]=useState({})
    let messageChild=React.createRef()

    console.log('friend:',friend)

    const onMenuClick=(e)=>{
        console.log('click',e)
        console.log(e.item.props.info)
        setFriend(e.item.props.info)
        ListMessageRecord(e.item.props.info.Friend.Phone).then((res)=>{
            const list=res.data.Data.List
            let messages=[]
            for (let i=0;i<list.length;i++){
                let item=list[i]
                if (item.From===props.userInfo.Phone){
                    messages.unshift("<-- "+item.Content)
                }else{
                    messages.unshift("--> "+item.Content)
                }
            }
            setMessageList(messages)
        })
    }

    const onSendClick=()=>{
        const msg=document.getElementById("message_input").value
        setMessageList(messageList.concat("<-- "+msg))
        const date=new Date()
        const message={
            Type:"word",
            Data:{
                To:friend.Friend.Phone,
                Content:msg,
                SendTime: date.toISOString()
            }
        }
        props.sendMessage(message)
    }

    const onMessageReceive=(message)=>{
        setMessageList(messageList.concat("--> "+message.Data.Content))
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
                        <Message data={messageList} ref={messageChild} onSendClick={onSendClick}/>
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