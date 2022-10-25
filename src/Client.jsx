import React from "react";
import Login from "./Login";
import Main from "./Main";
import Cookies from "js-cookie";
import {GetFriendList, GetToken, GetUserInfo} from "./services/global";
import {UserOutlined} from "@ant-design/icons";
import {message} from "antd";
import P2PVideoCall from "./P2PVideoCall";
import RemoteVideoView from "./RemoteVideoView";
import LocalVideoView from "./LocalVideoView";

class Client extends React.Component{

    constructor(props) {
        super(props);
        this.p2pVideoCall=null
        this.socket=null
        this.mainChild=React.createRef()
        this.state={
            host:"http://localhost:8081",
            wsHost:"ws://localhost:8081/ws",
            turnUrl:"http://localhost:9000/api/turn?service=turn&username=sample",
            userInfo:null,
            friendList:null,

            isVideoCall:false,
            localStream:null,
            remoteStream:null,
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
            this.p2pVideoCall=new P2PVideoCall(this.socket,this.state.turnUrl)
            this.p2pVideoCall.on('newCall',()=>{
                this.setState({isVideoCall:true})
            })
            this.p2pVideoCall.on('localstream',(stream)=>{
                this.setState({localStream:stream})
            })
            this.p2pVideoCall.on('addstream',(stream)=>{
                this.setState({remoteStream:stream})
            })

        }
    }

    handleStartVideoCall=(remoteUserPhone,mediaType)=>{
        this.p2pVideoCall.startCall(remoteUserPhone,mediaType)
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

        this.p2pVideoCall=new P2PVideoCall(this.socket,this.state.turnUrl)
        this.p2pVideoCall.on('newCall',()=>{
            this.setState({isVideoCall:true})
        })
        this.p2pVideoCall.on('localstream',(stream)=>{
            this.setState({localStream:stream})
        })
        this.p2pVideoCall.on('addstream',(stream)=>{
            this.setState({remoteStream:stream})
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
            switch (message.Type){
                case "word":
                    this.mainChild.current.onMessageReceive(message)
                    break
                case "offer":
                    this.p2pVideoCall.onOffer(message)
                    break
                case "answer":
                    this.p2pVideoCall.onAnswer(message)
                    break
                case "candidate":
                    this.p2pVideoCall.onCandidate(message)
                    break
                case 'heartPackage':
                    console.log('收到心跳包')
                    break
                default:
                    console.log('收到未知消息',message)
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
                this.state.isVideoCall?
                    <div>
                        {
                            this.state.remoteStream!=null?<RemoteVideoView stream={this.state.remoteStream} id={'remoteView'} />:null
                        }
                        {
                            this.state.localStream!=null?<LocalVideoView stream={this.state.localStream} id={'localView'}/>:null
                        }
                    </div>:
                <Main friends={this.state.friendList}
                      userInfo={this.state.userInfo}
                      sendMessage={this.sendMessage}
                      onRef={this.mainChild}
                      onStartVideoCall={this.handleStartVideoCall}
                      isVideoCall={this.state.isVideoCall}
                      localStream={this.state.localStream}
                      remoteStream={this.state.remoteStream}/>
            }
        </div>
    }
}

export default Client