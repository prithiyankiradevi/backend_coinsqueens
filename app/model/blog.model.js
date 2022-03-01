const mongoose = require('mongoose')


const blogSchemas = mongoose.Schema({
    userName:String,
    altTitle: String,
    blog: String,
    blogTitle: String,
    blogImage: String,
    content: String,
    pageTitle: String,
    description: String,
    keyword: String,
    deleteFlag: {
        type: String,
        default: false
    },
    category: [String],
    tags: [String],
    ip:[String],
    pageUrl: String,
    createdAt: {
        type: String,
        default: Date.now()
    },
    publish:String
})

const categorySchemas = mongoose.Schema({
    category: String,
    userName:String,
    deleteFlag: {
        type: String,
        default: false
    },
})


const updateBlogSchema=mongoose.Schema({
    blogId:String,
    userName:String,
    updatedAt:[]
})


const blogSchema = mongoose.model('blogSchema', blogSchemas)
const categorySchema = mongoose.model('categorySchema', categorySchemas)
const updateBlog = mongoose.model('updateBlogSchema', updateBlogSchema)

module.exports = {
    blogSchema,
    categorySchema,
    updateBlog
}