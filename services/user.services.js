import {client} from '../index.js'
import { ObjectId } from "mongodb";

export async function addnewuser(firstname,lastname,email,hashpassword,profile) {
    return await client.db('chatting').collection('user').insertOne({ firstname:firstname,lastname:lastname,email: email, password: hashpassword,verified:false, profile:profile,isAdmin:false,createdAt:Date.now(),city:'',discription:'',});
}
 
export async function getuser(email) {
    return await client.db('chatting').collection('user').findOne({ email: email });
}
export async function update_user()
{
    return await client.db('chatting').collection('user').findByIdAndUpdate({ email: email });
}
export async function getuser1() {
    return await client.db('chatting').collection('user').find({ }).toArray();
}
export async function getuserbyid(id) {
    // console.log("user by id")
    // console.log(id);
    return await client.db('chatting').collection('user').findOne({_id:new ObjectId(id)});
}
export async function updatepass(id,newpass) {
    // console.log('password updTE')
    return client.db('chatting').collection('user').updateOne({_id:new ObjectId(id)},{$set:{password:newpass,verfication:'changed'}});
}
export async function update_verification(id) {
    // console.log('verication of otp done')
    return client.db('chatting').collection('user').updateOne({_id:new ObjectId(id)},{$set:{verified:true}});

}
export async function userbytoken(token)
{
    return await client.db('chatting').collection('user').findOne({token:token})
}

export async function otps(otps,id,token)
{return await client.db("chatting").collection('otps').insertOne({otps:otps,user_id:id,token:token,createdAt:Date.now(),expiresAt:Date.now()+3600000})

}
export async function getotp(token)
{
    return await client.db('chatting').collection('otps').findOne({token:token})
}
export async function deleteotps(token)
{
    return await client.db('chatting').collection('otps').deleteMany({token})
}