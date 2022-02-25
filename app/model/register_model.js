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
    uploadFiles:String,
    deleteFlag: {
        type: String,
        default: 'false'
    }
})

const uploadImage = mongoose.Schema({
    UploadFiles: String,
    deleteFlag: {
        type: String,
        default: 'false'
    }
})


const ipSchema = mongoose.Schema({
    ipAddress: String,
    deleteFlag: {
        type: String,
        default: 'false'
    }
})



const admin = mongoose.model('admin', coinQueens)
const blogImage = mongoose.model('blogImage', blogsImage)
const ipAddress = mongoose.model('ipAddress', ipSchema)
const uploadFiles = mongoose.model('uploadImage', uploadImage)


module.exports = {
    admin,
    blogImage,
    ipAddress,
    uploadFiles
}


