const multer=require('multer')
const fs=require('fs')

const storage=multer.diskStorage ({
    destination:'uploads'
        //  var k = fs.existsSync('/home/fbnode/uploads/coinQueens1');
        //         if(!k)
        //          fs.mkdir('/home/fbnode/uploads/coinQueens1',(err,path)=>{
        //         if(err){
        //             console.log(err)
        //         }
        //         else{
        //             console.log(path)
        //         }
        //         })
        //         cb(null,'/home/fbnode/uploads/coinQueens1')

        // cb(null,'/home/fbnode/uploads/coinQueens1')


    ,
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    },

})       

const fileFilters=(req,file,cb,next)=>{
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
        cb(null,true)

        next
    }else{
    cb(null,false)
    }
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}
