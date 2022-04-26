const ipController = require("../model/register_model");
const blogController = require("../model/blog.model");
const pagination = require("../middleware/pagination");
const { read } = require("fs");

const getById = (req, res) => {
  try {
    if (req.params.id.length == 24) {
      blogController.blogSchema.findById(
        { _id: req.params.id, deleteFlag: "false" },
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
      res.status(200).send({ message: "please provide a valid id" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getAllUserBlog = async (req, res) => {
  console.log('kjhiuohkljhnihnio')
  try {
    const data = await blogController.blogSchema.aggregate([
      { $match: { deleteFlag: "false" } },
    ]);
    console.log(data)
    if (data.length != 0) {
      const arr = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].publish === "publish") {
          arr.push(data[i]);
        }
      }
      console.log(arr)
      const a = pagination.paginated(arr, 10, req, res);
      console.log(a)
      if (a.length != 0) {
        res.status(200).send({ data: a });
      } else {
        res.status(302).send({ data: [] });
      }
    } else {
      res.status(302).send({ data: [] });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const getAllCategory = async (req, res) => {
  try {
    const data = await blogController.categorySchema.aggregate([
      { $match: { deleteFlag: "false" } },
    ]);
    if (data.length != 0) {
      res.status(200).send({ data: data });
    } else {
      res.status(302).send({ data: [] });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
};

const createIp = async (req, res) => {
  try {
    let data={
      ipAddress:req.body.ipAddress
    }
    ipController.ipAddress.create(data, (err, data) => {

      if (err) {
        res.status(200).send({ message: "ip does not create properly" });
      } else {
        // console.log('line 86',req.body.id)
        blogController.blogSchema.findOne(
          {_id:req.body.id,deleteFlag: "false" },
          (err, data) => {
            // console.log('line line 100',data)
            if (data.ip.includes(req.body.ipAddress)) {
              res.status(200).send({ message: "ip already exists" });
            } else {
              data["ip"].push(req.body.ipAddress);
              blogController.blogSchema.findByIdAndUpdate(
                { _id: req.body.id },
                data,
                { new: true },
                (err, result) => {
                  // console.log('line 100',result)
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

const getIpAddress = async (req, res) => {
  try {
      const data = await ipController.ipAddress.aggregate([
        { $match: { deleteFlag: "false" } },
      ]);
      if (data.length != 0) {
        res.status(200).send({ data: data.length });
      } else {
        res.status(302).send({ data: [] });
      }
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
        if (data != null) {
          res.status(200).send({ data: data });
        } else {
          res.status(200).send({ data: [] });
        }
      }
    }
  );
};

const getBlogByTagName=async(req,res)=>{
  try{
    if(req.params.tagName){
      const data=await blogController.blogSchema.aggregate([{$match:{$and:[{"tags":{"$in":[req.params.tagName]}},{"deleteFlag":"false"}]}},{$match:{"publish":"publish"}}])
      if(data){
        const usePagination=pagination.paginated(data,10,req,res)
        res.status(200).send({success:'true',message:'fetch data successfully',usePagination})
      }else{
        res.status(200).send({success:'false',message:'failed',data:[]})
      }
    }else{
      res.status(400).send({success:"false",message:'failed',data:[]})
    }
  }catch(e){
    res.status(500).send({message:'internal server error'})
  }
}

const textSearch = async (req, res) => {
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
  getBlogByTagName,
  textSearch,
};
