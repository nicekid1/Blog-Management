//requires
const express = require("express");
const dotenv = require("dotenv").config();
const sequelize = require("./src/models");
// const User = require("./src/models/user");
// const Blog = require("./src/models/blog");
// const Comment = require("./src/models/comment");
const authRoutes = require("./src/routes/authRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const setupSwagger = require("./swagger");

const app = express();

//Swagger Setting
setupSwagger(app);

//database setting
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs/comments", commentRoutes);

//port setting
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
