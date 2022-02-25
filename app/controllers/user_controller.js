const ipController = require("../model/register_model");
const blogController = require("../model/blog.model");
const pagination = require("../middleware/pagination");

const getById = (req, res) => {
  blogController.blogSchema.findById(
    { _id: req.params.id, deleteFlag: false },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.log(data);
        res.status(200).send({ data: data });
      }
    }
  );
};

const getAllBlog = (req, res) => {
  blogController.blogSchema.find({ deleteFlag: false }, (err, data) => {
    // console.log(data)
    if (data) {
      const arr = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].publish == "true") {
          arr.push(data[i]);
        }
      }
      console.log(typeof arr);
      // const z = Object.values(arr);
      const a = pagination.paginated(arr, req, res);
      console.log(a);
      // res.status(200).send(res.paginated)
      res.status(200).send({ data: a });
    } else {
      res.status(400).send({ message: "your data is already deleted" });
    }
  });
};

const getAllCategory = (req, res) => {
  blogController.categorySchema.find({ deleteFlag: false }, (err, data) => {
    if (err) {
      throw err;
    } else {
      const b = pagination.paginated(data, req, res);
      res.status(200).send({ data: b });
    }
  });
};

const getIpAddress = (req, res) => {
  ipController.ipAddress.find({ deleteFlag: "false" }, (err, data) => {
    if (err) {
      throw err;
    } else {
      const length = data.length;
      res.status(200).send({ data: data.length });
    }
  });
};

module.exports = {
  getById,
  getAllBlog,
  getAllCategory,
  getIpAddress,
};
