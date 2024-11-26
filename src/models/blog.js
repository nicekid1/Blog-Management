const { DataTypes, BelongsTo } = require("sequelize");
const sequelize = require("./index");
const User = require("./user");

const Blog = sequelize.define(
  "blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Blog.belongsTo('User',{foreignKey: 'userId', as: 'author'})
User.hasMany('Blog', {foreignKey: 'userId', as: 'blogs'})
module.exports = Blog;
