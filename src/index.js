const express=require('express')
const app=express()
const saketh=require('./models/task')
const User=require('./models/user')
const userRouter=require('./routers/users')
const fs=require('fs')

const taskRouter=require('./routers/tasks')

const port=process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const multer=require('multer')
const upload=multer({
    dest: 'images'
})

app.post('/upload', upload.single('upload') , async (req,res) =>{
    res.send()
})
app.listen(port, () =>{
    console.log('server is up on ' + port) 
})