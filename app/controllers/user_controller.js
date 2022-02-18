const blogController = require('../model/blog.model')

const getById = (req, res) => {
    blogController.blogSchema.findById({ _id: req.params.id, deleteFlag: false }, (err, data) => {
        if (err) { throw err }
        else {
            console.log(data)
            res.status(200).send({ data: data })
        }
    })
}


const getAllBlog = (req, res) => {
    blogController.blogSchema.find({ deleteFlag: false }, (err, data) => {
        if (data) {
            const arr = []
            for (var i = 0; i < data.length; i++) {
                if (data[i].publish == 'true') {
                    arr.push(data[i])
                }
            }
            console.log(arr.length)
            res.status(200).send({ data: arr })
        }
        else {
            res.status(400).send({ message: 'your data is already deleted' })
        }
    })
}

const getAllCategory = (req, res) => {
    blogController.categorySchema.find({ deleteFlag: false }, (err, data) => {
        if (err) { throw err }
        else {
            res.status(200).send({ data: data })
        }
    })
}

module.exports = {
    getById,
    getAllBlog,
    getAllCategory
}