const bcrypt=require('bcryptjs')


const myfunction= async () =>{

    const password='saketh123'
const hashedpassword= await bcrypt.hash(password,8)
console.log(hashedpassword)

}

myfunction()
