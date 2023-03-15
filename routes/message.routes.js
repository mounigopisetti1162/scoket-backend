import express from 'express';
import { auth } from '../middleware/auth.js';
import { allconversation, allmessage, conversation, findconversation, idconversation, message, message_convo } from '../services/message.service.js';
const router=express.Router()

router.post('/',async function(req,res)
{
    const conversations=await conversation(req)
    // console.log("conversation")
    // console.log(conversation)

    res.send(conversations)

})

router.get('/',auth,async function (req,res)
{
const all_convo=await allconversation()
res.send(all_convo)
})

router.get("/convo/:user_id",auth,async function(req,res)
{
    try {
        // console.log('pagessss')
        const conversations=await idconversation(req)
        res.send(conversations)
        
    }
    catch(err)
    {
res.send(err)
    }
})
router.get("/convo/:user_id/:another_id",auth,async function(req,res)
{
    try {
        // console.log('findconversation with 2 ids')
        // console.log(req.params)
        const conversations=await findconversation(req)
        res.send(conversations)
        // console.log(conversation)

        
    }
    catch(err)
    {
res.send({message:"empty"})
    }
})

router.post('/convo',async function (req,res)
{
    const newMessage=await message(req.body)
    res.send(newMessage)
})
router.get('/singlemsg/:conversationid',auth,async function (req,res)
{
    try {
        // console.log("hello this is that msg")
        const messages=await message_convo(req)
        // console.log(messages)
        res.send(messages)
    } catch (error) {
        res.send(error)
        
    }
})
router.get('/conversations',auth,async function(req,res)
{
    const message=await allmessage()
    res.send(message)
})



export default router;
