const router=require('express').Router()
const blogController=require('../controllers/blog.controller')



//blog
router.post('/blog/create',blogController.createBlog)
router.get('/blog/getById/:id',blogController.getBlogById)
router.get('/blog/getAll',blogController.getAllBlog)
router.put('/blog/update/:id',blogController.updateBlogById)
router.delete('/blog/delete/:id',blogController.deleteBlogById)


//categtory
router.post('/category/create',blogController.createCategory)
router.get('/category/getAll',blogController.getAllCategory)
router.put('/category/update/:id',blogController.updateCategory) 
router.delete('/category/delete/:id',blogController.deleteCategory)




module.exports=router