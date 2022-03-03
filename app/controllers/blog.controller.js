const paginated = require("../middleware/pagination");
const blogController = require("../model/blog.model");
const jwt = require("jsonwebtoken");

const createBlog = async (req, res) => {
  try {
    const token = req.headers.authorization
    req.body.userName = token;
    blogController.blogSchema.create(req.body, (err, data) => {
      if (err) {
        throw err;
      } else {
        res.status(200).send({ data: data });
      }
    });
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getBlogById = (req, res) => {
  try {
    blogController.blogSchema.findById(
      req.params.id,
      { deleteFlag: false },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send({ data: data });
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getAllBlog = (req, res) => {
  const token = req.headers.authorization
  try {
    if (token != undefined) {
      blogController.blogSchema.find(
        { deleteFlag: false, userName: token },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            data.sort().reverse();
            res.status(200).send({ data: data });
          }
        }
      );
    } else {
      res.status(400).send("UnAuthorized");
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const updateBlogById = async (req, res) => {
  const token = req.headers.authorization
  try {
    blogController.blogSchema.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (err, result) => {
        if (result) {
          const userName = token;
          if (userName == result.userName) {
            req.body.blogId = result._id;
            req.body.updatedAt = Date.now();
            blogController.updateBlog.create(req.body, (err, data) => {
              if (err) {
                throw err;
              } else {
                res.status(200).send({ message: "successfully updated" });
              }
            });
          }
        } else {
          res.status(400).send({ message: "invalid id" });
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getRecentCreate = (req, res) => {
  try {
    blogController.blogSchema.find({ deleteFlag: "false" }, (err, data) => {
      const emptyarr=[]
      if (err) {
        throw err;
      } else {
        for (var i = 0; i < data.length; i++) {
          if (data[i].publish == "publish") {
            emptyarr.push(data[i]);
          }
        }
        const z = emptyarr.slice(-4);
        res.status(200).send({ data: z });
      }
    });
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getRecentUpdate = (req, res) => {
  try {
    blogController.updateBlog.find(
      { BlogId: req.params.blogId ,deleteFlag: "false" },
      (err, data) => {
        if (data) {
          function getFields(input, field) {
            var output = [];
            for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
            return output;
          }

          var result = getFields(data, "updatedAt");
          const z = result.slice(-5);
          res.status(200).send({ data: z });
        } else {
          res.status(400).send({ message: "invalid blogid" });
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const deleteBlogById = (req, res) => {
  try {
    blogController.blogSchema.findByIdAndUpdate(
      req.params.id,
      { deleteFlag: "true" },
      { returnOriginal: false },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send({ message: "data deleted successfully" });
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const createCategory = (req, res) => {
  try {
    blogController.categorySchema.countDocuments(
      { category: req.body.category },
      (err, data) => {
        if (data == 0) {
          const token = req.headers.authorization
          req.body.userName = token;
          blogController.categorySchema.create(req.body, (err, data) => {
            if (err) {
              throw err;
            } else {
              res.status(200).send({ data: data });
            }
          });
        } else {
          res.status(400).send({ message: "category already exists" ,error:err.message});
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getCategoryByName = (req, res) => {
  try {
    const arr = [];
    blogController.categorySchema.findOne(
      { category: req.params.categoryName, deleteFlag: false },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          const z = data.category;
          blogController.blogSchema.find(
            {},
            { category: 1 },
            async (err, result) => {
              if (result) {
                for (var i = 0; i < result.length; i++) {
                  for (var j = 0; j < result[i].category.length; j++) {
                    if (result[i].category[j] == z) {
                      arr.push(result[i]);
                    }
                  }
                }
                res.status(200).send(arr);
              } else {
                res.status(400).send({ message: "data not found" });
              }
            }
          );
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getAllCategory = (req, res) => {
  const token = req.headers.authorization
  try {
    blogController.categorySchema.find(
      { deleteFlag: false, userName: token},
      (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send({ data: data });
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const updateCategory = (req, res) => {
  try {
    const token =req.headers.authorization
    const userName = token;
    if (userName) {
      blogController.categorySchema.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send({ data: data });
          }
        }
      );
    } else {
      res.status(400).send({ message: "unauthorized" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const deleteCategory = (req, res) => {
  try {
    blogController.blogSchema.findByIdAndUpdate(
      req.params.id,
      { deleteFlag: "true" },
      { returnOriginal: false },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send({ message: "data deleted successfully" });
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

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
  deleteCategory,
};
