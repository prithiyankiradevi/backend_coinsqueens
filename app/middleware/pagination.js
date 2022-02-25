function paginated(model, req, res) {
  // return async(req,res,next) => {
  console.log(typeof model);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
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
console.log(result)
  // result.result = await model.find().limit(limit).skip(startIndex).exec()
  result.result= model.slice(startIndex,endIndex)
  // console.log(result,'line 23')
  // res.paginated=result
  return result;
  // next()
  // }
}

module.exports = {
  paginated,
};
