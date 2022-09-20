import React from "react";
import Login from "./Login";
import Message from "./Message";
import axios from "axios";

class Client extends React.Component{

    constructor(props) {
        super(props);

        this.state={
            isLogin:false,
            token:"",
        }
    }

    userLogin = (values)=>{
        console.log(values);
        axios.post("http://localhost:8081/login",{
            Phone:values.phone,
            Password:values.password
        }).then(res=>{
            let token;
            token=res.data.Data.Token
            console.log(token)
            // localStorage.setItem("userToken",token)
            this.setState({
                isLogin:true,
                token:token,
            })
        })
    }

    render() {
        return <div>
            {!this.state.isLogin ?
                <Login loginHandler={this.userLogin}/>
                :
                <Message/>
            }
        </div>
    }
}

export default Client