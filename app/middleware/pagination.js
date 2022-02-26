const res = require("express/lib/response");
const blogController=require('../controllers/blog.controller')
const math = require("math");

function paginated(model, limits, req, res) {
  
  const page = parseInt(req.query.page);
  const limit = limits;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  if (endIndex < model.length) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  result.totalPages = math.ceil(model.length / limit);
  result.result = model.slice(startIndex, endIndex);
  return result;
}

async function pagination(model, limits, req, res, calledFrom) {
  var k = await model.countDocuments().exec();
  
  const page = parseInt(req.query.page);
  const limit = limits;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  
  if (endIndex < k) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  await textSearchQuery(model, limit, req, calledFrom, startIndex, result);

  
  res.status(200).send(result);
}

async function textSearchQuery(model, limit, req, calledFrom, startIndex, result){
  const z = await model.find(
    { deleteFlag: "false" }
  ).limit(limit).skip(startIndex)
  const emptyarr = [];

  for (var i = 0; i < z.length; i++) {

    if (z[i].blogTitle.toLowerCase().includes(req.query.search.toLowerCase())) {
      emptyarr.push(z[i]);

    }else{
      for (var j=0;j<z[i].tags.length;j++){
        if((z[i].tags[j].toLowerCase()).includes(req.query.search.toLowerCase())){
          emptyarr.push(z[i])
        }
      }
    }
  }
  result.total_no_od_data=emptyarr.length
  result.total_pages = Math.ceil(emptyarr.length/ limit);

  result.allDatas=emptyarr



}

 


module.exports = {
  paginated,
  pagination,
};
