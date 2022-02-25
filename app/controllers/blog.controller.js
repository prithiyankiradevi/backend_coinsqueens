const paginated=require('../middleware/pagination')
const blogController = require('../model/blog.model')
const jwt = require('jsonwebtoken')

const createBlog = (req, res) => {
    console.log(req.headers.authorization)
    const token = jwt.decode(req.headers.authorization)
    req.body.userName = token.userName
    console.log(token)
    blogController.blogSchema.create(req.body, (err, data) => {
        console.log(data)
        if (err) { throw err }
        else {
            console.log(data)
            res.status(200).send({ data: data })
        }
    })
}

const getBlogById = (req, res) => {
    blogController.blogSchema.findById({ _id: req.params.id, deleteFlag: false }, (err, data) => {
        if (err) { throw err }
        else {
            console.log(data)
            res.status(200).send({ data: data })
        }
    })
}

const getAllBlog = (req, res) => {
    console.log('line 31 inside get all ')
     blogController.blogSchema.find({ deleteFlag: false },(err, data)  =>{
        if (err) { throw err }
        else {
            // const a=paginated.paginated(data,req,res)
            res.status(200).send({ data: data})
        }
    })
}

const updateBlogById = (req, res) => {
    blogController.blogSchema.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, result) => {
        if (result) {
            const token = jwt.decode(req.headers.authorization)
            const userName = token.userName
            if (userName == result.userName) {
                console.log(result)
                req.body.blogId = result._id
                req.body.updatedAt = Date.now()
                blogController.updateBlog.create(req.body, (err, data) => {
                    if (err) { throw err }
                    else {
                        console.log('updated 1st time')
                        res.status(200).send({ message: '1st time updated successfully', data })
                    }
                })
            }
        } else {
            res.status(400).send({ message: 'invalid id' })
        }
    })

}

const getRecentCreate = (req, res) => {
    blogController.blogSchema.find({ deleteFlag: 'false' }, (err, data) => {
        if (err) { throw err }
        else {
            // console.log('line 67',data)
            const z = data.slice(-4)
            console.log('line 69', z)
            res.status(200).send({ data: data })
        }
    })
}

const getRecentUpdate = (req, res) => {
    blogController.updateBlog.find({ BlogId: req.params.blogId }, (err, data) => {
        if (data) {
            function getFields(input, field) {
                var output = [];
                for (var i = 0; i < input.length; ++i)
                    output.push(input[i][field]);
                return output;
            }

            var result = getFields(data, "updatedAt")
            const z = result.slice(-5)
            res.status(200).send({ data: z })
        } else {
            res.status(400).send({ message: 'invalid blogid' })
        }
    })
}

const deleteBlogById = (req, res) => {
    console.log(req.params.id)
    blogController.blogSchema.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
        if (err) { throw err }
        else {
            console.log(data)
            res.status(200).send({ message: 'data deleted successfully' })
        }
    })
}



const createCategory = (req, res) => {
    blogController.categorySchema.countDocuments({ category: req.body.category }, (err, data) => {
        if (data == 0) {
            const token = jwt.decode(req.headers.authorization)
            req.body.userName = token.userName
            blogController.categorySchema.create(req.body, (err, data) => {
                if (err) { throw err }
                else {
                    console.log(data)
                    res.status(200).send({ data: data })
                }
            })
        } else {
            console.log('category already exists')
            res.status(400).send({ message: 'category already exists' })
        }
    })
}

const getCategoryByName = (req, res) => {
    const arr=[]
    blogController.categorySchema.find({ category: req.params.categoryName, deleteFlag: false }, (err, data) => {
        console.log('line 124', data)
        if (err) { console.log(err) }
        else {
            const z = data[0].category
            console.log(z)
            blogController.blogSchema.find({}, async (err, data) => {
                if (data) {
                    console.log(data.length)
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data[i].category.length; j++) {
                            if (data[i].category[j] == z) {
                                console.log('true');
                                console.log(data[i])
                                arr.push(data[i])
                            }
                        }
                    }res.status(200).send(arr)
                } else {
                    console.log(err)
                }
            })
        }
    })
}

const getAllCategory = (req, res) => {
    blogController.categorySchema.find({ deleteFlag: false }, (err, data) => {
        if (err) { throw err }
        else {
            console.log(data)
            res.status(200).send({ data: data })
        }
    })
}

const updateCategory = (req, res) => {
    const token = jwt.decode(req.headers.authorization)
    const userName = token.userName
    if (userName) {
        blogController.categorySchema.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, data) => {
            if (err) { throw err }
            else {
                console.log(data)
                res.status(200).send({ data: data })
            }
        })
    } else {
        res.status(400).send({ message: 'unauthorized' })
    }
}

const deleteCategory = (req, res) => {
    console.log(req.params.id)
    blogController.blogSchema.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
        if (err) { throw err }
        else {
            console.log(data)
            res.status(200).send({ message: 'data deleted successfully', data })
        }
    })
}





module.exports = {
    createBlog,
    getBlogById,
    getAllBlog,
    updateBlogById,
    getRecentCreate,
    getRecentUpdate,
    deleteBlogById,
    createCategory,
    getCategoryByName,
    getAllCategory,
    updateCategory,
    deleteCategory
}