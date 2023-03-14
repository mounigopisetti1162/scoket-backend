import express from 'express'
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import * as dotenv from "dotenv"
import { mail,generatehashedpassword } from '../index.js';
import {addnewuser,getuser,getuser1, getuserbyid,updatepass,otps,getotp,update_verification,deleteotps} from '../services/user.services.js'
// import {getuser,getuser1, getuserbyid,updatepass,otps,getotp,update_verification,deleteotps} from '../services/user.services.js'
import randomstring from 'randomstring';
import { auth } from '../middleware/auth.js'; 

const router=express.Router()
 async function otpverification(id,email){
    
const otp=`${Math.floor(1000+Math.random()*9000)}`
const hashotp=await generatehashedpassword(otp)

const token2=randomstring.generate(15);
const link=`${process.env.BASE_URL}/mail-verification/${token2}`

   const verification_otp=`<p> enter the ${otp} in the app to do the verification process  enter in this ${link}</p>`
   // this objectid need to be chnaged from new ObjectId to general number
await mail(email,'verification mail',verification_otp)
const otpsstore=await otps(hashotp,id,token2)

 }
router.get('/users',auth,async function(request,responce)
{
    console.log('i');
    const user=await getuser1()
    // console.log(user);
    responce.send(user)
})
router.get('/users/:id',async function(request,responce)
{
    console.log("first")
    const {id}=request.params
    console.log(id)
console.log("the frdsid")
    const user=await getuserbyid(id)
    console.log("getuser")
    responce.send(user)
})

router.post('/signup',async function(req,res)
{
    const {firstname,email,lastname,password,confrimpassword,profile}=req.body;
    const found=await getuser(email)
    // console.log(found)
    if(found)
    {
        console.log("not")
        res.status(401).send({message:"user alredy exist"})
    }
    else{
    const hashpassword=await generatehashedpassword(password)
    // const hashpassword2=await generatehashedpassword(confrimpassword)
      //  db.movies.insertMany(data)
     
    const newuser = await addnewuser(firstname,lastname,email,hashpassword,profile)
    
    const id=newuser.insertedId.toString()
   
    otpverification(id,email)

    const token=jwt.sign({id:id},process.env.SCRETE_TOKEN)
    // console.log(newuser.insertedId.toString())
      res.send({message:"signup processs",token:token})
    }
})

router.post('/otpverification/:token',async function (request,responce)
{
    // console.log("hello thhis is verification page")
    const {token}=request.params
    const {otp}=request.body
    const otp_found=await getotp(token)

    // console.log(otp_found)
    
    if(otp_found)
    {
        const {expiresAt}=otp_found
        const hashedotp=otp_found.otps
        // console.log(hashedotp)
        if(expiresAt<Date.now())
        {
            await deleteotps(token)
            responce.status(403).send({message:'otp has expired'})
        }
        else{
        const otp_verify=await bcrypt.compare(otp,hashedotp)

            if(otp_verify)
            {
        const name=await update_verification(otp_found.user_id)
        responce.status(200).send({message:'the verification is done'})
        await deleteotps(token)
            }
            else{
                responce.status(404).send({message:'wrong otp entered'})
            }
        }
    }
    else{
        responce.send({message:'the otp is not valid'})
    }
})

router.post('/login',async function(request,responce)
{
    const {email,password}=request.body;
    const emailfound=await getuser(email)
    // console.log("login")
    // console.log(emailfound._id)
    // console.log("emailfound._id")

    if(!emailfound)
    {
        
        responce.status(401).send({message:'user not found'})
    }
    else if(!(emailfound.verified)){
    const id=emailfound._id.toString()

        responce.status(402).send({message:'do the verification process'})
        otpverification(id,email)

    }
    else{
        const pass=await bcrypt.compare(password,emailfound.password)
        // console.log(pass)
        if(pass)
        {
            // console.log('first');
            const token=jwt.sign({id:emailfound._id},process.env.SCRETE_TOKEN)
            // console.log('second');
            // responce.status.send({m:"slkfjsdlfj"})
            responce.status(200).send({message:"logged in sucessfully",
                                       token:token,
                                       emailfound})
                                       

        }
        else{
            responce.status(401).send({message:'invalid credentials'})
          }
    }
})


router.post('/forgotpass',async function(request,responce)
{
    // console.log(request.body)
    const {email}=request.body
    const userfound=await getuser(email)
    // responce.send({monika:"very very inteligent girl"})
    if(!userfound)
    {
        responce.send({message:'this user is not found'})
    }
    else{
        console.log("found")
        const token=jwt.sign({id:userfound._id},process.env.SCRETE,{expiresIn:'15m'})
        const link=`${process.env.BASE_URL}/user/reset-password/${userfound._id}`
        await mail(userfound.email,'verification mail',link)
        // console.log(link)
        responce.send({message:"password rest link ui ssent to mail"}) 
    }
})

router.get(`/reset-password/:id`,auth,async function(request,responce)
{
    const {id}=request.params
    // console.log(id)
    const useridfound=await getuserbyid(id)
    if(!useridfound)
    {
        responce.send({message:"this link is not for valid person"})
    }
    else{

responce.send({message:'we will reset the password'})
 
    }
})

router.post(`/reset-password`,async function(request,responce)
{
    // console.log("this is the reset page")
    const {email,password}=request.body
    const userfound=await getuser(email)
    // console.log("dataaa")
    // console.log(password)
        const newpass=await generatehashedpassword(password)
        const newpassword=await updatepass(userfound._id,newpass)
        // console.log(newpass)
        responce.send(newpassword)
        console.log("newpassword")

})


export default router;

async function updating(req) {
    const id=req.params.id
    const value=req.body
    // console.log(value)
    return client.db('chatting').collection('user').updateOne({_id:ObjectId(id)},{$set: req.body });
}
