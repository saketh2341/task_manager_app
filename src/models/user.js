const mongoose=require('mongoose')
const validater=require('validate')
const bcrypt=require('bcryptjs')
const uniquevalidator=require('mongoose-unique-validator')
const jwt=require('jsonwebtoken')
const Task=require('./task')
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const UserSchema=new  mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
       type:String,
       unique:true,
       required:true,
       trim:true,
       lowercase:true
    //    validate(value){
    //        if(!validater.isEmail(value))
    //        {
    //            throw new Error('not a valid email')
    //        }
    //    }
    },
    password:{
       type:String,
       required:true,
       minlength:7,
       trim:true,
       unique:true,
       validate(value) {
           if(value.toLowerCase()==='password'){
               throw new Error('password should not be password itself')
           }
       }

    },
    age:{
        type:Number,
        default:0
    },
    tokens:[{
            token:{
                type:String,
                required:true
            }
        }],
        avatar:{
            type:Buffer
        }
},{
    timestamps:true
})

UserSchema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})

UserSchema.plugin(uniquevalidator)


UserSchema.methods.toJSON = function () {
     const user=this
     const userobjects=user.toObject()

     delete userobjects.password
     delete userobjects.tokens
     delete userobjects.avatar
     return userobjects
}

UserSchema.methods.generateAuthtoken = async function () {
    const user=this
    const token=jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.statics.findByCredentials= async (email,password) =>{
    console.log("hiigere")
    const User=await user.findOne({email})
    console.log(User)
    if(!User){console.log('hii')
        throw new Error('unable to login')
    }
    const ismatch=await bcrypt.compare(password,User.password)
    if(!ismatch){
        throw new Error('unable to login')
    }
    return User
}

UserSchema.pre('save', async function  (next) {
    const user=this
    
    console.log('just before saving')
     
    if(user.isModified('password')) {
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})  

UserSchema.pre('remove', async function(next) {
    const User=this
    await Task.deleteMany({owner : User._id})
    next()
})

const user=mongoose.model('user',UserSchema)
module.exports=user