import {client} from '../index.js'
import { ObjectId } from "mongodb";
export async function conversation(req)
{
    return client.db("chatting").collection("conversation").insertOne({members:[req.body.recid,req.body.senid]},{timestamps:true})
}
export async function allconversation()
{
    return client.db("chatting").collection("conversation").find({ }).toArray();
}
export async function idconversation(req)
{
    return client.db("chatting").collection("conversation").find({members:{$in:[req.params.user_id]} }).toArray();
}
export async function findconversation(req)
{
    return client.db("chatting").collection("conversation").find({members:{$all:[req.params.user_id,req.params.another_id]} }).toArray();
}
export async function message(body)
{
    return client.db("chatting").collection("message").insertOne(body,{createdAt:Date.now()})
}
export async function message_convo(req)
{
    // console.log(req.params)
    // console.log("req.params.conversationid")
    return client.db("chatting").collection("message").find({conversation_id:req.params.conversationid}).toArray()
}
export async function allmessage()
{
    // console.log("req.params.conversationid")
    return client.db("chatting").collection("message").find({ }).toArray()
}