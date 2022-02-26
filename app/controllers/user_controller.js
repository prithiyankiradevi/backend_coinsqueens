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
          if (data[i].publish == "true") {
            arr.push(data[i]);
          }
        }
        const a = pagination.paginated(arr, 4, req, res);
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


const textSearch = async (req, res) => {

pagination.pagination(blogController.blogSchema, 4, req, res, 'textSearchQuery')
};



module.exports = {
  getById,
  getAllUserBlog,
  getAllCategory,
  getIpAddress,
  textSearch,
};
