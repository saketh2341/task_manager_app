const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

const connectionUrl=('mongodb://127.0.0.1:27017')
const databasename=('task-manager')
const ObjectId=mongodb.ObjectID
MongoClient.connect(connectionUrl,{useNewUrlParser:true,useUnifiedTopology:true},(error,client) =>{
    if(error){
        return console.log('unable to connect database')
    }
    const db=client.db(databasename)
    // db.collection('tasks').insertMany([
    //  {
    //      task:'sleep',
    //      completed:false
    //  },{
    //      task:'watching movie',
    //      completed:false
    //  },{
    //      task:'eating fruits',
    //      completed:true
    //  }
    // ],(error,result) =>{
    //     if(error){
    //        return console.log('unable to insert')
    //     }
    //     console.log(result.ops)
    // })
   db.collection('tasks').deleteMany({completed:true}).then((result) =>{
       console.log(result)
   }).catch((error) => {
     console.log('deleted not done')
   })
})