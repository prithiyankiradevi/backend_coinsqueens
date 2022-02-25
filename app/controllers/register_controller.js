const register = require("../model/register_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const create = (req, res) => {
  console.log(req.body);
  try {
    register.admin.countDocuments(
      { userName: req.body.userName },
      async (err, num) => {
        console.log("line 9", num);
        if (num == 0) {
          console.log("inside if");
          req.body.password = await bcrypt.hashSync(req.body.password, 10);
          register.admin.create(req.body, (err, data) => {
            if (err) {
              res.status(400).send({ message: err });
            } else {
              res.status(200).send({ data: data });
            }
          });
        } else {
          res.status(400).send({ message: "Data already exists", error: err });
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};

const adminLogin = (req, res) => {
  console.log(req.body.userName);
  try {
    register.admin.findOne(
      { userName: req.body.userName },
      async (err, data) => {
        console.log(data);
        if (data) {
          console.log(data);
          const password = await bcrypt.compare(
            req.body.password,
            data.password
          );
          if (password === true) {
            const payload = {
              id: data._id,
              userName: data.userName,
            };
            const token = await jwt.sign(payload, process.env.SECRET_KEY);
            // const text = `http://localhost:8300/post/${data._id}/${token}`
            // postMail(data.email, 'welcome again', text)
            res.status(200).send({ role: data.role, token });
          } else {
            res.status(400).send("invalid ");
          }
        } else {
          res.status(400).send({
            message: "invalid username/password ",
          });
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};

const createBlogImage = (req, res) => {
  try{
    console.log("line no 70", req.body);
    if (req.body.blogImage) {
      const token = jwt.decode(req.headers.authorization);
      req.body.userName = token.userName;
      console.log(req.file.filename);
      req.body.blogImage = `http://192.168.0.112:8099/uploads/${req.file.filename}`;
    } else {
      req.body.uploadFiles = `http://192.168.0.112:8099/uploads/${req.file.filename}`;
    }
    register.blogImage.create(req.body, (err, data) => {
      console.log(data);
      if (err) {
        throw err;
      } else {
        console.log("inside else");
        res.status(200).send(data);
      }
    });
  }catch(e){
    res.status(500).send('internal server error')
  }
};

const createUploadFiles = (req, res) => {
  try{
    req.body.UploadFiles = `http://192.168.0.112:8099/uploads/${req.file.filename}`;
    register.uploadFiles.create(req.body, (err, data) => {
      console.log(data);
      if (err) {
        throw err;
      } else {
        console.log("inside else");
        res.status(200).send(data.UploadFiles);
      }
    });
  }catch(e){
    res.status(500).send('internal server error')
  }
};

const createIpAddress = (req, res) => {
  try{
    register.ipAddress.countDocuments(
      { ipAddress: req.body.ipAddress },
      (err, data) => {
        if (err) {
          res.status(400).send({ message: "already exists" });
        } else {
          register.ipAddress.create(req.body, (err, data) => {
            if (err) {
              throw err;
            } else {
              res.status(200).send({ message: "successfull" });
            }
          });
        }
      }
    );
  }catch(e){
    res.status(500).send('internal server error')
  }
};

module.exports = {
  create,
  adminLogin,
  createBlogImage,
  createIpAddress,
  createUploadFiles,
};
