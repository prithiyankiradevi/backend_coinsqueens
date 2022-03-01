const ipController = require("../model/register_model");
const blogController = require("../model/blog.model");
const pagination = require("../middleware/pagination");
const req = require("express/lib/request");
const { cbrt } = require("math");

const getById = (req, res) => {
  try {
    blogController.blogSchema.findById(
      { _id: req.params.id, deleteFlag: false },
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

const getAllUserBlog = (req, res) => {
  try {
    blogController.blogSchema.find({ deleteFlag: false }, (err, data) => {
      if (data) {
        const arr = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].publish == "publish") {
            arr.push(data[i]);
          }
        }
        const a = pagination.paginated(arr, 10, req, res);
        res.status(200).send({ data: a });
      } else {
        res.status(400).send({ message: "your data is already deleted" });
      }
    });
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getAllCategory = (req, res) => {
  try {
    blogController.categorySchema.find({ deleteFlag: false }, (err, data) => {
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

const createIp = async (req, res) => {
  try {
    ipController.ipAddress.create(req.body, (err, data) => {
      if (err) {
        res.status(200).send({ message: "ip does not create properly" });
      } else {
        blogController.blogSchema.findOne(
          { _id: req.body.id, deleteFlag: "false" },
          (err, data) => {
            if (data.ip.includes(req.body.ipAddress)) {
              res.status(400).send({ message: "ip already exists" });
            } else {
              data["ip"].push(req.body.ipAddress);
              blogController.blogSchema.findByIdAndUpdate(
                { _id: req.body.id },
                data,
                { new: true },
                (err, result) => {
                  if (result) {
                    req.body.blogId = result._id;
                    req.body.updatedAt = Date.now();
                    blogController.updateBlog.create(req.body, (err, data) => {
                      if (err) {
                        throw err;
                      } else {
                        res
                          .status(200)
                          .send({ message: "successfully updated" });
                      }
                    });
                  } else {
                    res.status(400).send({ message: "invalid id" });
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getIpAddress = (req, res) => {
  try {
    ipController.ipAddress.find({ deleteFlag: "false" }, (err, data) => {
      if (err) {
        throw err;
      } else {
        const length = data.length;
        res.status(200).send({ data: data.length });
      }
    });
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getBlogUrl = (req, res) => {
  blogController.blogSchema.findOne(
    { pageUrl: req.body.pageUrl },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        res.status(200).send({ data: data });
      }
    }
  );
};

const textSearch = async (req, res) => {
  console.log(req.query);

  pagination.pagination(
    blogController.blogSchema,
    10,
    req,
    res,
    "textSearchQuery"
  );
};

module.exports = {
  getById,
  getAllUserBlog,
  getAllCategory,
  createIp,
  getIpAddress,
  getBlogUrl,
  textSearch,
};
