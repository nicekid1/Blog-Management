
//requires
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./src/models');

dotenv.config();
const app = express();

//middlewares
app.use(express.json());











//port setting
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`);
});