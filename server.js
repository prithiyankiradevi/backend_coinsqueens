const dotenv=require('dotenv').config()
const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const app = express();

const api=require('./app/routes/blog.route')
const regAndImage=require('./app/routes/admin_route')
const user=require('./app/routes/user_route')
require('./app/db.config/db.config')

// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 
// }
app.use(express.json()); /* bodyParser.json() is deprecated */
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
app.use(cors())
const bcrypt = require("bcrypt");


// app.use('/uploads',express.static('/home/fbnode/uploads/coinQueens1'))

// var corsOptions = {s
//   origin: "https://coinsqueens.com",
//   optionsSuccessStatus: 200, // For legacy browser support
//   methods: "GET, PUT"
// };

// app.use(cors(corsOptions));
app.use('/admin',api)
app.use('/admin',regAndImage)
app.use('/user',user)
app.get('',(req,res)=>{
  res.status(200).send('welcome Coinsqueens')
})

app.get('/hashpassword/:id',(req,res)=>{
  const password = bcrypt.hashSync(req.params.id, 10);
  res.status(200).send(password);
})

app.use('/uploads',express.static('uploads'))

// parse requests of content-type - application/json
// app.use(bodyParser)
// parse requests of content-type - application/x-www-form-urlencoded

// require("./app/routes/email.route")(app);

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
