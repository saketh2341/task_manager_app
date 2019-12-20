const mongoose=require('mongoose')
const validater=require('validate')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const user=mongoose.model('user',{
    name:{
        type:String,
        required:true

    },
    email:{
       type:String,
       required:true,
       trim:true
    },
    password:{
       type:String,
       required:true,
       minlength:7,
       trim:true,
       validate(value) {
           if(value.toLowerCase()==='password'){
               throw new Error('password should not be password itself')
           }
       }

    },
    completed:{
        type:Boolean,
        default:false
    }
})

const me=new user({
    description:"going to bed",
    email:'sakethreddy2341@gmail.com  ',
    password:'ass  '
})
me.save().then((me) => {
    console.log(me)
}).catch((error) => {
    console.log(error)
})