const mongoose = require('mongoose')

const coinQueens = mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    role: {
        type: String,
        default: 'admin'
    },
    deleteFlag: {
        type: String,
        default: 'false'
    }
})


const blogsImage = mongoose.Schema({
    blogImage: String,
    deleteFlag: {
        type: String,
        default: 'false'
    }
})




const admin = mongoose.model('admin', coinQueens)
const blogImage = mongoose.model('blogImage', blogsImage)

module.exports = {
    admin,
    blogImage}


