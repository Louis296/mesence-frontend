import React from "react";
import Login from "./Login";
import Main from "./Main";
import Cookies from "js-cookie";
import {GetFriendList, GetToken, GetUserInfo} from "./services/global";
import {UserOutlined} from "@ant-design/icons";
import {message} from "antd";

class Client extends React.Component{

    constructor(props) {
        super(props);
        this.socket=null
        this.mainChild=React.createRef()
        this.state={
            host:"http://localhost:8081",
            wsHost:"ws://localhost:8081/ws",
            userInfo:null,
            friendList:null,
        }

        if (Cookies.get("userToken")){
            this.getFriendsItem().then((res)=>{
                this.setState({
                    friendList:res,
                })
            })
            this.getUserInfo().then((res)=>{
                this.setState({
                    userInfo:res,
                })
            })
            this.connWebSocket(Cookies.get('userToken'))
        }
    }

    userLogin = async (values) => {
        console.log(values);

        const resp = await GetToken(values)
        if(resp.data.Status==="Error"){
            message.error("用户名或密码错误")
            return
        }
        const token = resp.data.Data.Token
        Cookies.set("userToken",token)

        this.connWebSocket(token)

        this.setState({
            friendList:await this.getFriendsItem(),
            userInfo:await this.getUserInfo(),
        })
    }

    connWebSocket=(token)=>{

        this.socket=new WebSocket(this.state.wsHost+"?token="+token)

        this.socket.onopen=()=>{
            console.log("连接websocket成功")
        }

        this.socket.onmessage=(e)=>{
            console.log("收到websocket消息",e)
            const message=JSON.parse(e.data)
            if (message.Type==="word"){
                this.mainChild.current.onMessageReceive(message)
            }
        }
    }

    getFriendsItem = async () => {
        const resp = await GetFriendList()
        const list=resp.data.Data.List
        let res = []
        for (let i = 0; i < list.length; i++) {
            let name = list[i].FriendNoteName
            if (name === "") {
                name = list[i].Friend.Name
            }
            res.push({label: name, key: i, icon: <UserOutlined/>, info:list[i]})
        }
        // return {key: 'sub1', icon: <UserOutlined/>, children: res, label: 'Friends'}
        return res
    }

    getUserInfo=async () => {
        const resp=await GetUserInfo()
        return resp.data.Data.Info
    }

    sendMessage=(msg)=>{
        console.log("发送websocket消息",msg)
        this.socket.send(JSON.stringify(msg))
    }


    render() {
        return <div>
            {!Cookies.get("userToken") ?
                <Login loginHandler={this.userLogin}/>
                :
                <Main friends={this.state.friendList}
                      userInfo={this.state.userInfo}
                      sendMessage={this.sendMessage}
                      onRef={this.mainChild}/>
            }
        </div>
    }
}

export default Client