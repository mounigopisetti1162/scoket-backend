import  express, { text } from "express";
import {  MongoClient, ObjectId } from "mongodb";
import cors from 'cors'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken";

import nodemailer from 'nodemailer'
import userRouter from './routes/user.route.js'
import profileRouter from './routes/profile.routes.js'
import messageRouter from './routes/message.routes.js'
import bodyParser from 'body-parser'
import http from 'http'
// import {socketio} from 'socket.io'
// import express from "express"
// const PORT=process.env.PORT||8900;
import { createServer } from "http";
import { Server } from "socket.io";
export const app=express()
// const httpServer = createServer().listen(8901);
const httpServer = createServer(app);

dotenv.config() 

const PORT=process.env.PORT||4000
const MONGO_URL=process.env.MONGO_URL
const client=new MongoClient(MONGO_URL)
await client.connect()
console.log("monggo connected")




app.use(cors())
app.use(express.json({limit:"50mb"}))
// app.use(cors(x => x
// 
//     
//      // allow any origin
//     ));
app.use(express.urlencoded({extended:false,parameterLimit:100000,limit:"100 mb"}))
app.set('view engine','ejs')
app.use('/user',userRouter)
app.use('/profile',profileRouter)
app.use('/message',messageRouter)

// export async function sendotp()
// {
//     try{
//         const otp=`${Math.floor(1000+Math.random()*9000)}`
//     }
//     catch{
        
//     }
// }

const io=new Server(httpServer
    ,{
    cors:{
        origin:"https://magnificent-kashata-c33ff9.netlify.app",
        // origin:"*",
        // origin:"http://localhost:5173",
        allowedHeaders: ["my-custom-header"],
        credentials: true,
        withCredentials: true,
        allowRequest: (req, callback) => {
            const noOriginHeader = req.headers.origin === undefined;
            callback(null, noOriginHeader); // only allow requests without 'origin' header
          }
    },
}
);
let users=[]
console.log(users)
const adduser=(userid,socketid)=>{
    console.log(userid)
    console.log(socketid)
    console.log("adduser")
    users.filter((user)=>user.userid!==userid) && //change
    users.push({userid,socketid})
    console.log(users)
}
const removeuser=(socketid)=>{
    users=users.filter((user)=>user.socketid !==socketid)
}

const getuser=(userid)=>{
    return users.find((user)=>user.userid === userid)
}


//for conncetion esdtablishment
io.on("connection", (socket) => {
    console.log("socket.id")
    io.emit("welcome","this is the socket server")
    socket.on("adduser",(userid)=>{
        adduser(userid,socket.id)
        io.emit("getuser",users)
         console.log("adduser")
         console.log(adduser)
    })
    // console.log(users)
//send msg
socket.on("sendmessage",({senderid,receiverid,text})=>{
    console.log(receiverid)
    console.log(senderid)
    // console.log(text)
    const user=getuser(receiverid)
    console.log("the send msg user")
    // console.log(user)
    // io.to(user.socketid).emit("getmessage",{
        if(user)
{io.to(user.socketid).emit("getmessage",         
            {
                senderid,text
            })
        }
})


    //for the dissconnection
    socket.on("disconnect",()=>{
        console.log("a user disconnecrted")
        removeuser(socket.id)
        io.emit("getuser",users)

    })
})

 export async function mail(email,subject,text)
{
    try {
let mailtransporter=nodemailer.createTransport({
    host:process.env.HOST,
    service:process.env.SERVICE,
    port:Number(process.env.EMAIL_PORT),
    secure:Boolean(process.env.SECURE),
    
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })
    await mailtransporter.sendMail({
        from:process.env.USER,
        to:email,
        subject:subject,
        text:text
    })
    console.log("email sent sucessfully")
    } catch (error) {
        console.log("the mail is not sent",error)
    }
}
   



export async function generatehashedpassword(password){
    const no_of_rounds=10;
    const salt=await bcrypt.genSalt(no_of_rounds)
    const hashedpassword=await bcrypt.hash(password,salt)
    return hashedpassword
}  
app.get('/',function(request,responce)
{
    responce.send("this is the chatting app page")
})


httpServer.listen(PORT,()=>console.log(`server ${PORT}`))
export {client}