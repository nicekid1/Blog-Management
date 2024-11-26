//requires
const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./src/models");
const User = require("./src/models/user");
const Blog = require("./src/models/blog");
const Comment = require("./src/models/comment");

dotenv.config();
const app = express();

//database setting
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

//middlewares
app.use(express.json());

//port setting
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
