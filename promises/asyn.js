


const doingtask=require('../src/models/task')


const updateAgeAndcount= async (id,age) =>{
    const user=await doingtask.findByIdAndDelete(id)
    const count=doingtask.countDocuments({age})
    return count
}

updateAgeAndcount('5df54e703a23e03600b3855d',2).then((count) =>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})