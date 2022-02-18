module.exports = app => {
    const EmailIns = require("../controllers/email.controller");
  
    var router = require("express").Router();
    
    // Retrieve all Tutorials

    router.post("/sendenquiry", EmailIns.send);
  
    app.use('/api/email', router);
  };
  