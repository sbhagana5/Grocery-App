const jwt = require('jsonwebtoken')
const {user}= require("../../database/mongoose")
const auth =async(req,res,next)=>{
   try{
      const token =req.header('Authorization').replace('Bearer ','')
      const decode= jwt.verify(token,'secret')

      const User= await user.findOne({_id:decode._id,'tokens.token':token})
     
      if(!User){
         throw new Error()
      }
      else{
         req.user= User
         next()
      }
   }catch{
      res.status(401).send({error:"please authenticate"})
   }
}
module.exports= auth