import axios from "axios";
import {message} from "antd";

const host="http://localhost:8081"
const version="20220101"

let config

export function InitConfig(token){
    config={
        headers:{
            "Authorization":token
        }
    }
}

function onError(){
    message.error("服务器错误")
}

export async function GetUserInfo() {
    try{
        return await axios.get(host + "/v1?Action=GetUserInfo&Version=" + version, config)
    }catch (e){
        console.log(e)
        onError()
    }
}

export async function GetFriendList(){
    try{
        return await axios.get(host+"/v1?Action=ListFriend&Version="+version,config)
    }catch (e) {
        console.log(e)
        onError()
    }
}

export async function GetToken(values){
    try{
        return await axios.post(host+"/login",{
            Phone:values.phone,
            Password:values.password
        })
    }catch (e){
        console.log(e)
        onError()
    }
}