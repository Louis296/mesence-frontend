import React from "react";
import Login from "./Login";
import Message from "./Message";
import Cookies from "js-cookie";
import {GetFriendList, GetToken, GetUserInfo, InitConfig} from "./services/global";
import {UserOutlined} from "@ant-design/icons";

class Client extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            host:"http://localhost:8081"
        }
    }

    userLogin = async (values) => {
        console.log(values);

        const resp = await GetToken(values)
        const token = resp.data.Data.Token
        Cookies.set("userToken",token)
        console.log(token)

        InitConfig(token)

        const info=await GetUserInfo()
        localStorage.setItem("userInfo",JSON.stringify(info.data.Data.Info))

        const friends=await GetFriendList()
        localStorage.setItem("friends",JSON.stringify(friends.data.Data.List))

        this.setState({})
    }

    getFriendsItem = ()=>{
        const list=JSON.parse(localStorage.getItem("friends"))
        let children = []
        for (let i=0; i<list.length; i++){
            let name=list[i].FriendNoteName
            if(name===""){
                name=list[i].Friend.Name
            }
            children.push({label:name,key:i})
        }
        return {key:'sub1',icon:<UserOutlined />,children:children,label:'Friends'}
    }

    render() {
        return <div>
            {!Cookies.get("userToken") ?
                <Login loginHandler={this.userLogin}/>
                :
                <Message friends={this.getFriendsItem()}/>
            }
        </div>
    }
}

export default Client