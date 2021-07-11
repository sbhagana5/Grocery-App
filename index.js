const dotenv = require("dotenv");
const express =require("express");
const {user,findUser,insertUser,fetchUser,fetchEdibles,fetchEdibleById,findEdible,createEdible,updatequantity} = require("./database/mongoose")
const auth =require("./src/middleware/auth")
const jwt = require('jsonwebtoken');
const { json } = require("express");
const app= express()
const port = process.env.PORT || 7000
app.use(express.json())

// signup user
app.post("/signup",async(req,res)=>{
    
  const result = await findUser(req.body.email)
  console.log(result)
  if(result){
      res.status(406).send("email already exist.")
  }else{
    const me =  await insertUser(req.body)
    res.send(`user created:${req.body.email}`)
  }
    
})

// signin user

app.get("/signin",async(req,res)=>{
  const user= await fetchUser(req.body)
  
    const token = jwt.sign({_id:user._id.toString()},'secret')
    
  user.tokens= user.tokens.concat({token})
  await user.save()
    res.send({user,token})

})
// purchase edible

app.post("/purchaseEdible",auth,async(req,res)=>{
    id=req.body.id
    quantity=req.body.quantity
    const result = await fetchEdibleById(id)
    console.log(result)
    const user =req.user
    const date = new Date();
    const day = date.getDate()
    const month =date.getMonth() +1
    const year = date.getFullYear()
    const data = `${month}/${day}/${year}`
    user.purchases= user.purchases.concat({ edible_id:id,quantity,date:data})
    await user.save()
  const price=result.price

if(quantity < result.quantity){
    const total = price* quantity
    result.quantity =result.quantity - quantity
    await result.save() 
    res.send(`your total billing amount is : ${total}`)
}
else{
    res.send(`Sorry! this much quantity is not available. please order under ${result.quantity}`)
}
})

// to check the  purchase
app.get("/checkPurchase",auth,async(req,res)=>{
    const id  = req.body.id
     const  customerId = req.user._id
console.log("id",id,req.user._id)
    const result =await user.findOne({_id:customerId,'purchases.edible_id':id})
    if (result) {
        res.send("TRUE")
    } else {
        res.send("FALSE")
    }
})

// to fetch the array list of edibles
app.get("/fetchEdibles",async(req,res)=>{
 const result=await fetchEdibles()
res.send(result)
})

//to  store a new edible in database
app.post("/createEdible",async(req,res)=>{
    const detail = req.body
    const result =await findEdible(detail.name)
    console.log(result)
    if (result) {
      return  res.status(406).send("already in the store.")
    } else {
     const data =   await createEdible(detail)
       return res.send(`stored:${data}`)     
    }
   
})

// to update the quantity of any edible.
app.post("/updateQuantity",async(req,res)=>{
const result=await updatequantity(req.body.id,req.body.quantity)
res.send(`quantity updated:${result}`)

})


app.listen(port,()=>{
    console.log("server is on:",port)
})