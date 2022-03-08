const paginated = require("../middleware/pagination");
const blogController = require("../model/blog.model");
const jwt = require("jsonwebtoken");

const createBlog = async (req, res) => {
  try {
    const token = req.headers.authorization;
    req.body.userName = token;
    if (token) {
      blogController.blogSchema.create(req.body, (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send({ data: data });
        }
      });
    } else {
      res.status(302).send({ message: "please provide token" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getBlogById = async (req, res) => {
  try {
    if (req.params.id.length == 24) {
      const data = await blogController.blogSchema.aggregate([
        { $match: { $and: [{ _id: req.params.id }, { deleteFlag: false }] } },
      ]);
      if (data != null) {
        res.status(200).send({ data: data });
      } else {
        res.status(302).send({ data: [] });
      }
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internal server error");
  }
};

const getAllBlog = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token != undefined) {
      const a = await blogController.blogSchema.aggregate([
        { $match: { deleteFlag: "false", userName: token } },
      ]);
      if (a.length != 0) {
        res.status(200).send({ data: a });
      } else {
        res.status(302).send({ data: [] });
      }
    } else {
      res.status(400).send("UnAuthorized");
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const updateBlogById = async (req, res) => {
  try {
    if (req.body._id == null && req.body._v == null) {
      blogController.blogSchema.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true },
        (err, result) => {
          if (result) {
            const token = req.headers.authorization;
            if (token) {
              const userName = token;
              if (userName == result.userName) {
                req.body.blogId = result._id;
                req.body.updatedAt = Date.now();
                blogController.updateBlog.create(req.body, (err, data) => {
                  if (err) {
                    throw err;
                  } else {
                    res
                      .status(200)
                      .send({ message: "successfully updated", data });
                  }
                });
              } else {
                res.status(400).send({ message: "invalid token" });
              }
            } else {
              res.status(400).send({ message: "unauthorized" });
            }
          } else {
            res.status(400).send({ message: "invalid id" });
          }
        }
      );
    } else {
      res.status(302).send({ message: "please avoid _id and_V" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("internal server error");
  }
};

const getRecentCreate = async (req, res) => {
  try {
    const data = await blogController.blogSchema.aggregate([
      { $match: { deleteFlag: "false" } },
    ]);
    const emptyarr = [];
    if (data.length != 0) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].publish == "publish") {
          emptyarr.push(data[i]);
        }
      }
      const z = emptyarr.slice(-4);
      res.status(200).send({ data: z });
    } else {
      res.status(302).send({ data: [] });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getRecentUpdate = async (req, res) => {
  try {
    if (req.params.blogId.length == 24) {
      const data = await blogController.updateBlog.aggregate([
        { $match: { blogId: req.params.blogId } },
      ]);
      if (data.length != 0) {
        var result = await getFields(data, "updatedAt");
        if (result) {
          const z = result.slice(-5);
          res.status(200).send({ data: z });
        } else {
          res.status(302).send({ data: [] });
        }
      } else {
        res.status(302).send({ data: [] });
      }
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

function getFields(input, field) {
  var output = [];
  for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
  return output;
}

const deleteBlogById = (req, res) => {
  try {
    if (req.params.id.length == 24) {
      blogController.blogSchema.findByIdAndUpdate(
        req.params.id,
        { deleteFlag: "true" },
        { returnOriginal: false },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            if (data != null) {
              res.status(200).send({ message: "data deleted successfully" });
            } else {
              res.status(400).send({ data: [] });
            }
          }
        }
      );
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
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
          const token = req.headers.authorization;
          if (token) {
            req.body.userName = token;
            blogController.categorySchema.create(req.body, (err, data) => {
              if (err) {
                throw err;
              } else {
                res.status(200).send({ data: data });
              }
            });
          } else {
            res.status(400).send({ message: "unauthorized" });
          }
        } else {
          res.status(400).send({ message: "category already exists" });
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
          if (data != null) {
            const z = data.category;
            blogController.blogSchema.find({}, async (err, result) => {
              if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                  for (var j = 0; j < result[i].category.length; j++) {
                    if (
                      result[i].category[j] == z &&
                      result[i].publish == "publish"
                    ) {
                      arr.push(result[i]);
                    }
                  }
                }
                res.status(200).send(arr);
              } else {
                res.status(302).send({ data: [] });
              }
            });
          } else {
            res.status(302).send({ data: [] });
          }
        }
      }
    );
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getAllCategory = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const data = await blogController.categorySchema.find({
      deleteFlag: "false",
      userName: token,
    });
    if (data.length != 0) {
      res.status(200).send({ data: data });
    } else {
      res.status(302).send({ data: [] });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const updateCategory = (req, res) => {
  try {
    if (req.params.id.length == 24) {
      const token = req.headers.authorization;
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
              if (data != null) {
                res.status(200).send({ data: data });
              } else {
                res.status(302).send({ data: [] });
              }
            }
          }
        );
      } else {
        res.status(400).send({ message: "unauthorized" });
      }
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const deleteCategory = (req, res) => {
  try {
    if (req.params.id.length == 24) {
      blogController.categorySchema.findByIdAndUpdate(
        req.params.id,
        { deleteFlag: "true" },
        { returnOriginal: false },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            if (data != null) {
              res.status(200).send({ message: "data deleted successfully" });
            } else {
              res.status(302).send({ data: [] });
            }
          }
        }
      );
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
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
