const mongoose=require('mongoose')
const dbUrl=require('./url.config')


mongoose.connect(dbUrl.url,{dbName:'coinsQueens1'},(err,data)=>{
    console.log('db connected')
})


