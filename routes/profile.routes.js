import express from 'express';
import { generatehashedpassword } from '../index.js';
import { delete_profile, update_profile } from '../services/profile.services.js';
// import {addnewuser,getuser,getuser1, getuserbyid,updatepass,otps,getotp,update_verification,deleteotps} from '../services/user.services.js'
import { getuserbyid } from '../services/user.services.js';

const router=express.Router()

router.post('/:id',async function (req,res)
{
    const {id}=req.params
    console.log(id)
    const user=await getuserbyid(id)
    // console.log(user)
    console.log("profile updaingh")
    try {
        
    
    if(user|| user.isAdmin)
    {
        if(req.body.password)
        {
            try {
                console.log("this is the password")
                req.body.password=await generatehashedpassword(req.body.password)
            } catch (error) {
                res.status(500).send(error)
            }
        }
        try{
            console.log("this is thr updta")
            await update_profile(req);
            // await updating(req);
            res.status(200).send({message:'updated sucessfully'})
        }
        catch(err)
        {
            res.status(500).send(err)

        }
}
} catch (error) {
        
    
            res.status(403).send({message:'the user does not exist'})
        
}
})

router.delete('/:id',async function (req,res)
{
    const {id}=req.params
    console.log("deleting id")
    console.log(id)
    const user=await getuserbyid(id)
    console.log(user)
    console.log("profile deleting")
    try {
        
    
    if(user|| user.isAdmin)
    {
       
        try{
            console.log("this is thr updta")
            await delete_profile(req);
            // await updating(req);
            res.status(200).send({message:'deleted sucessfully'})
        }
        catch(err)
        {
            res.status(500).send(err)

        }
}
    }
    catch(err)
    {

    

    console.log("this is the othe page")
        res.status(403).send({message:'you can delete only ur acccount'})
    
}
})


 router.get('/:id', async function (req,res)
 {
try {
    console.log(req.params.id)
    const user=await getuserbyid(req.params.id)
    //used when u dont want to include some parts
    // const {password,createdAt, ...other}=user._doc
    res.status(200).json(user)
} catch (error) {
    console.log("no user")

    res.status(500).send({message:"error"})
    
}
 })

export default router;
