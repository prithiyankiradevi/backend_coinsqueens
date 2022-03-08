const register = require("../model/register_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const create = (req, res) => {
  try {
    register.admin.countDocuments(
      { userName: req.body.userName },
      async (err, num) => {
        if (num === 0) {
          req.body.password = await bcrypt.hashSync(req.body.password, 10);
          register.admin.create(req.body, (err, data) => {
            if (err) {
              res.status(400).send({ message: err });
            } else {
              res.status(200).send({ data: data });
            }
          });
        } else {
          res.status(302).send({ message: "Data already exists" });
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};

const adminLogin = (req, res) => {
  try {
    register.admin.findOne(
      { userName: req.body.userName },
      async (err, data) => {
        if (data) {
          const password = await bcrypt.compare(
            req.body.password,
            data.password
          );
          if (password == true) {
            res.status(200).send({ role: data.role, token: data.userName });
          } else {
            res
              .status(400)
              .send({ message: "invalid password" });
          }
        } else {
          res.status(400).send({
            message: "invalid username/password ",
            error: err.message,
          });
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};

const createBlogImage = (req, res) => {
  const token = req.headers.authorization;

  try {

    if (req.file && token) {
      req.body.userName = token;
      req.body.blogImage = `http://192.168.0.112:8099/uploads/${req.file.filename}`;
      register.blogImage.create(req.body, (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send(data);
        }
      });
    } else {
      res.status(302).send({ message: "please insert image/token" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const createUploadFiles = (req, res) => {
  try {
    if (req.file && req.headers.authorization) {
      req.body.UploadFiles = `http://192.168.0.112:8099/uploads/${req.file.filename}`;
      register.uploadFiles.create(req.body, (err, data) => {
        if (err) {
          throw err;
        } else {
          res.status(200).send(data.UploadFiles);
        }
      });
    } else {
      res.status(302).send({ message: "please insert uploadfiles/token" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

module.exports = {
  create,
  adminLogin,
  createBlogImage,
  createUploadFiles,
};
