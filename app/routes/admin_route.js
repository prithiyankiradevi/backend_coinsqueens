const router=require('express').Router()
const multer=require('../middleware/multer')
const registerController=require('../controllers/register_controller')

// admin
router.post('/create',registerController.create)
router.post('/login',registerController.adminLogin)



//multer
router.post('/blogImage/create',multer.upload.single('blogImage'),registerController.createBlogImage)


module.exports=router

