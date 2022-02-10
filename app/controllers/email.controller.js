const { json } = require("express/lib/response");
const mailer = require("../config/mailer");

// Create and Save a new CountryList
exports.send = (req, res) => {

    const param= req.body;
    if (!req.body) {
        res.status(500).send({
            message:
              "please check your param details."
          });
    }else{       
        mailer.sendMailToClient(param, (err, result)=>{
            if(err){
                res.status(500).send({
                    message: result
                  });
            }else{
                res.status(200).send(result);
            }            
        });
    }
};

