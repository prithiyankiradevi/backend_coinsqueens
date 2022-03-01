const router=require('express').Router()
const multer=require('../middleware/multer')
const registerController=require('../controllers/register_controller')
const { uploadFiles } = require('../model/register_model')

// admin
router.post('/create',registerController.create)
router.post('/login',registerController.adminLogin)



//multer
router.post('/blogImage/create',multer.upload.single('blogImage'),registerController.createBlogImage)
router.post('/uploadFiles/create',multer.upload.single('UploadFiles'),registerController.createUploadFiles)


module.exports=router

