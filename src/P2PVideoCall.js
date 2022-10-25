import * as events from "events";
import axios from "axios";

let RTCPeerConnection
let RTCSessionDescription
let configuration

export default class P2PVideoCall extends events.EventEmitter{
    constructor(socket,turnUrl) {
        super();
        this.socket=socket
        this.userPhone=""
        this.turnUrl=turnUrl
        this.localStrem=null
        this.peerConnection=null

        RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection
        //RTCSessionDescription兼容性处理
        RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription
        //getUserMedia兼容性处理
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia

        configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

        axios.get(this.turnUrl, {}).then(res => {
            if(res.status === 200){
                let _turnCredential = res.data;
                configuration = { "iceServers": [
                        {
                            "url":  _turnCredential['uris'][0],
                            'username': _turnCredential['username'],
                            'credential': _turnCredential['password']
                        }
                    ]};
                console.log("configuration:" + JSON.stringify(configuration));
            }
        }).catch((error)=>{
            console.log('网络错误:请求不到TurnServer服务器');
        });
    }

    getLocalStream=(type)=>{
        return new Promise((pResolve,pReject)=>{
            let constraints={
                audio:true,
                video:(type==='video')?{width:1280,height:720}:false
            }
            if (type==='screen'){
                navigator.mediaDevices.getDisplayMedia({video:true}).then((mediaStream)=>{
                    pResolve(mediaStream)
                }).catch((err)=>{
                    console.log(err.name+": "+err.message())
                    pReject(err)
                })
            }else{
                navigator.mediaDevices.getUserMedia(constraints).then((mediaStream)=>{
                    pResolve(mediaStream)
                }).catch((err)=>{
                    console.log(err.name+": "+err.message())
                    pReject(err)
                })
            }
        })
    }

    createPeerConnection=(remoteUserPhone,mediaType,isOffer,localStream)=>{
        console.log("create PeerConnection")
        const pc=new RTCPeerConnection(configuration)
        this.peerConnection=pc
        pc.onicecandidate=(event)=>{
            console.log('onicecandidate',event)
            if (event.candidate){
                let message={
                    Type:'candidate',
                    Data:{
                        To:remoteUserPhone,
                        From:this.userPhone,
                        Content:{
                            Candidate:{
                                'sdpMLineIndex':event.candidate.sdpMLineIndex,
                                'sdpMid':event.candidate.sdpMid,
                                'candidate':event.candidate.candidate,
                            }
                        }
                    }
                }
                this.socket.send(JSON.stringify(message))
            }
        }

        pc.onnegotiationneeded=()=>{
            console.log('onnegotiationneeded')
        }

        pc.oniceconnectionstatechange=(event)=>{
            console.log('oniceconnectionstatechange',event)
        }

        pc.onsignalingstatechange=(event)=>{
            console.log('onsignalingstatechange',event)
        }

        pc.onaddstream=(event)=>{
            console.log('onaddstream',event)
            this.emit('addstream',event.stream)
        }

        pc.onremovestream=(event)=>{
            console.log('onremovestream',event)
            this.emit('removestream',event.stream)
        }

        pc.addStream(localStream)

        if (isOffer){
            this.createOffer(pc,remoteUserPhone,mediaType)
        }
        return pc
    }

    onError=(err)=>{
        console.log("Error: ",err)
    }

    createOffer=(pc,remoteUserPhone,mediaType)=>{
        pc.createOffer().then((describe)=>{
            console.log('createOffer: ',describe.sdp)
            pc.setLocalDescription(describe).then(()=>{
                console.log('setLocalDescription',pc.localDescription)
                let message={
                    Type:'offer',
                    Data:{
                        To:remoteUserPhone,
                        From:this.userPhone,
                        Content:{
                            Description:{
                                'sdp':describe.sdp,
                                'type':describe.type,
                            },
                            Media:mediaType,
                        },
                    }
                }
                this.socket.send(JSON.stringify(message))
            }).catch(this.onError)
        }).catch(this.onError)
    }

    onOffer=(message)=>{
        const data=message.Data
        const from=data.From
        console.log("data: "+data)
        const media=data.Content.Media
        this.emit('newCall',from)
        this.getLocalStream(media).then((stream)=>{
            this.localStrem=stream
            this.emit('localstream',stream)
            const pc=this.createPeerConnection(from,media,false,stream)
            if (pc&&data.Content.Description){
                pc.setRemoteDescription(new RTCSessionDescription(data.Content.Description)).then(()=>{
                    if (pc.remoteDescription.type==="offer"){
                        pc.createAnswer().then((describe)=>{
                            console.log('createAnswer: ',describe)
                            pc.setLocalDescription(describe).then(()=>{
                                console.log('setLocalDescription',pc.localDescription)
                                let message={
                                    Type:'answer',
                                    Data:{
                                        To:from,
                                        From:this.userPhone,
                                        Content:{
                                            Description: {
                                                'sdp':describe.sdp,
                                                'type':describe.type,
                                            }
                                        }
                                    }
                                }
                                this.socket.send(JSON.stringify(message))
                            }).catch(this.onError)
                        }).catch(this.onError)
                    }
                }).catch(this.onError)
            }
        }).catch(this.onError)
    }

    onAnswer=(message)=>{
        const data=message.Data
        const from=data.From
        const pc=this.peerConnection
        if (pc&&data.Content.Description){
            pc.setRemoteDescription(new RTCSessionDescription(data.Content.Description)).then(()=>{}).catch(this.onError)
        }
    }

    onCandidate=(message)=>{
        const data=message.Data
        const from=data.From
        const pc=this.peerConnection
        if (pc&&data.Content.Candidate){
            pc.addIceCandidate(new RTCIceCandidate(data.Content.Candidate)).then(()=>{}).catch(this.onError)
        }
    }

    startCall=(remoteUserPhone,mediaType)=>{
        this.getLocalStream(mediaType).then((stream)=>{
            this.localStrem=stream
            this.createPeerConnection(remoteUserPhone,mediaType,true,stream)
            this.emit('localstream',stream)
            this.emit('newCall',this.userPhone)
        })
    }
}