import axios from "axios";
import {message} from "antd";
import Cookies from "js-cookie";

const host="http://localhost:8081"
const version="20220101"



function onError(){
    message.error("服务器错误")
}

export async function GetUserInfo() {
    try{
        return await axios.get(host + "/v1?Action=GetUserInfo&Version=" + version, {
            headers:{
                "Authorization":Cookies.get("userToken")
            }
        })
    }catch (e){
        console.log(e)
        onError()
    }
}

export async function GetFriendList(){
    try{
        return await axios.get(host+"/v1?Action=ListFriend&Version="+version,{
            headers:{
                "Authorization":Cookies.get("userToken")
            }
        })
    }catch (e) {
        console.log(e)
        onError()
    }
}

export async function ListMessageRecord(friendPhone){
    try{
        return await axios.get(host+"/v1?Action=ListMessageRecord&Version="+version
            +"&Limit=10&Offset=1&AnotherUser="+friendPhone,{
            headers:{
                "Authorization":Cookies.get("userToken")
            }
        })
    }catch (e){
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