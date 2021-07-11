const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
mongoose.connect(process.env.MONGODB_URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})

const edible = mongoose.model("Edible",{
    name:{
        type:String
    },
    type:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number
    },
    updated:{
        type:Number,
        default:0
    }
})
const userSchema = new mongoose.Schema({
        email:{
            type:String
        },
        password:{
            type:String
        },
        tokens:[
            {
                token:{
                    type:String
                }
            }
        ],
        purchases:[{
            edible_id:{
                type:String
            },
            quantity:{
                type:String
            },
            date:{
                type:Date
            }
        }]
        
    }
)
const user =new  mongoose.model("User",userSchema)

const findUser =async (email)=>{
    const result= await user.findOne({email})
return result
}
const insertUser = (detail)=>{

const me = new user({
    email:detail.email,
    password:detail.password
})
me.save().then(console.log("user saved.")).catch((err)=>{
    return err
})
return me 
}
const fetchUser =async(detail)=>{
   return await user.findOne({email:detail.email})
    
}


const fetchEdibles =async ()=>{
 return await edible.find().catch((err)=>{
     return console.log(err)
 })
}

const fetchEdibleById = async(id)=>{
    return await edible.findById(id).catch((err)=>{
        return err
    })
}

const findEdible=async(name)=>{
 const result =await edible.findOne({name})
 return result
}
const createEdible =(detail)=>{
    
    const data= new edible({
        name:detail.name,
        type:detail.type,
        price:detail.price,
        quantity:detail.quantity,
        updated:detail.updated
    }) 
    data.save().then(console.log("data saved successfully::",data)).catch((e)=>{console.log("error:::",e)})
return data
}


const updatequantity = async(id,quantity)=>{
    
    const data =await edible.findById(id)
    data.quantity=quantity
    data.updated =quantity+1
 data.save()
    return data
}
module.exports={user,findUser,findEdible,insertUser,fetchUser,fetchEdibles,fetchEdibleById,createEdible,updatequantity}