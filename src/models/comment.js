const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');
const Blog = require('./blog');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Comment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Blog.hasMany(Comment, { foreignKey: 'blogId', as: 'comments' });

module.exports = Comment;