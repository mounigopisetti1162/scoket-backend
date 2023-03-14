import {client} from '../index.js'
import { ObjectId } from "mongodb";


export async function update_profile(req) {
    console.log('update of profile')
    const id=req.params.id
    
    return client.db('chatting').collection('user').updateOne({_id:ObjectId(id)},{$set:req.body});

}
export async function delete_profile(req) {
    console.log('verication of otp done')
    const id=req.params.id
    
    return client.db('chatting').collection('user').deleteOne({_id:ObjectId(id)});

}