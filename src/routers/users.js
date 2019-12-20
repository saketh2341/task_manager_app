const express=require('express')
const User=require('../models/user')
const router=new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const hogan=require('hogan.js')
const fs=require('fs')
const path=require('path')


// const template=fs.readFileSync('/send.hbs','utf-8')
// const compileTemplate=hogan.compile(template)

const { sendwelcomeEmail, sendcancelationEmail} = require('../emails/account')

const sgmail=require('@sendgrid/mail')
const sendgridApiKey=process.env.SEND_GRID_API_KEY





sgmail.setApiKey(sendgridApiKey)


router.post('/users', async (req,res) =>{
    const user=new User(req.body)
     try{

         await user.save()
         console.log(user.email,user.name)
         const email=user.email
         const name=user.name
        //  sendwelcomeEmail(email,name) 
         const token=await user.generateAuthtoken()
          res.status(201).send({ user, token })
          sgmail.send({
            to:user.email,
            from:'sakethreddy2341@gmail.com',
            subject:'Thanks for joining in!',
            text:`welcome to the app, ${user.name}.let me know you get along with app`
            // html: compileTemplate.render()
        })
     }
     catch(e)
     {
         res.status(500).send(e)
     }
  })

  router.post('/users/login', async (req,res) =>{
      try{
          const user=await User.findByCredentials(req.body.email, req.body.password)
          const token=await user.generateAuthtoken()
          res.send({ user, token })
      }
      catch(e){
          res.status(400).send()
      }
  })

  router.post('/users/logout', auth , async (req,res) =>{
      try{
          req.user.tokens=req.user.tokens.filter((token) =>{
              return token.token !== req.token
          })
          await req.user.save()
          res.send()
      }
      catch(e){
          res.status(500).send(e)
      }
  })

  router.post('/users/logoutall', auth ,async (req,res) => {
      try{
         req.user.tokens= []
         await req.user.save()
         res.send() 
      }
      catch(e){
          res.status(500).send(e)
      }
  })


  router.get('/users/me', auth ,async (req,res) => {
   
    res.send(req.user)
    // try{
    //   const Users=await User.find({})
    //   res.send(Users)
    // }
    // catch(e){
    //     res.status(500).send(e)
    // }
   
    // User.find({name:'saketh'}).then((users) =>{
    //     res.send(users)
    // }).catch((e) =>{
    //     res.status(500).send(e)
    // })
})

router.get('/users/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const user= await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
         res.send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
        
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.patch('/users/me', auth ,async (req,res) =>{
    const updates=Object.keys(req.body)
    const allowedupdates=['name','email','password','age']
    const isvalid=updates.every((update)=>{
        return allowedupdates.includes(update)
    })
    if(!isvalid){
        res.status(400).send('invaid update')}

        try{
        //   const user=await User.findById(req.params.id)
          
          updates.forEach((update) =>{
              req.user[update]=req.body[update]
          })
          console.log(req.params.id)
          await req.user.save()
          res.send(req.user)
        }catch(e){
             res.status(500).send(e)
        }
    
})

router.delete('/users/me', auth , async (req,res) => {
    try{
        // const user= await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     res.status(404).send()
        // }
    await req.user.remove()
    sgmail.send({
        to:req.user.email,
        from:'sakethreddy2341@gmail.com',
        subject:'Thanks for joining in!',
        text:`welcome to the app, ${req.user.name}.let me know you get along with app`,
        html:'<image src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Suresh_Raina1.jpg/260px-Suresh_Raina1.jpg">'
    })
    // await sendcancelationEmail(req.user.email,req.user.name)
    res.send(req.user)
   
    }
    catch(e){
        res.status(500).send(e)
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file ,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please only upload jpg|jpeg|png'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth ,upload.single('avatar') , async (req,res) =>{
    const buffer=await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next) =>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar', auth , async (req,res) =>{
    req.user.avatar=undefined
    req.user.save()
    res.send()
})

router.get('/users/:id/avatar' , async (req,res) =>{
   try{
       const user= await User.findById(req.params.id)

       if(!user || !user.avatar)
       {
           throw new Error()
       }

       res.set('Content-Type','image/png')
       res.send(user.avatar)
   }
   catch(e){
       res.status(500).send(e)
   }
})
module.exports=router