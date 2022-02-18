const router=require('express').Router()
const userController=require('../controllers/user_controller')
const blogController=require('../controllers/blog.controller')

router.get('/getById/:id',userController.getById)
router.get('/getAllBlog',userController.getAllBlog)
router.get('/getAllCategory',userController.getAllCategory)
router.get('/blog/getRecentUpdate/:blogId',blogController.getRecentUpdate)
router.get('/blog/getRecentCreate',blogController.getRecentCreate)
router.get('/category/getBycategoryName/:categoryName',blogController.getCategoryByName)



module.exports=router
