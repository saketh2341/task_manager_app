const mongoose=require('mongoose')
const validater=require('validate')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const TaskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true

    },
    
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'user'
    }
},{
    timestamps:true
})

const task=mongoose.model('task',TaskSchema
  
)

module.exports=task