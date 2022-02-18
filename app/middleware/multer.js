const multer=require('multer')
const fs=require('fs')

const storage=multer.diskStorage ({
    destination:(req,res,cb)=>{
         var k = fs.existsSync('/home/fbnode/uploads/coinQueens1');
         ///home/fbnode/uploads/coinQueens
            console.log(k);
                if(!k)
                 fs.mkdir('/home/fbnode/uploads/coinQueens1',(err,path)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(path)
                }
                })
                cb(null,'/home/fbnode/uploads/coinQueens1')

        cb(null,'/home/fbnode/uploads/coinQueens1')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now().toString() + file.originalname)
    },

})       

const fileFilters=(req,file,cb,next)=>{
    console.log('inside filefilter')
    // const fileTypes=/jpeg|jpg|png|zip/;
    console.log('req.files',req.files)
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
        cb(null,true)

        next
    }else{
    cb(null,false)
    }
    console.log('line 43',req.files)
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}
