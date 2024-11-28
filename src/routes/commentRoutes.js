const express = require("express");
const Comment = require("../models/comment");
const User = require("../models/user");
const Blog = require("../models/blog");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// create comment
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment to a blog
 *     description: Create a new comment by providing content, userId, and blogId
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a great blog post!"
 *               userId:
 *                 type: integer
 *                 example: 1
 *               blogId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment added"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     content:
 *                       type: string
 *                       example: "This is a great blog post!"
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     blogId:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       example: "2024-11-26T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-11-26T12:34:56.789Z"
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Blog or user not found
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticate, async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params; 
  const userId = req.user.id;
  try {
    const comment = await Comment.create({ content, userId, blogId });
    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// receive comments fo a blog
/**
 * @swagger
 * /comments/{blogId}:
 *   get:
 *     summary: Retrieve all comments for a specific blog
 *     description: Fetch all comments associated with a given blog ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The ID of the blog
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       content:
 *                         type: string
 *                         example: "This is a great blog post!"
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       blogId:
 *                         type: integer
 *                         example: 5
 *                       author:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: "john_doe"
 *                       createdAt:
 *                         type: string
 *                         example: "2024-11-26T12:34:56.789Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-11-26T12:34:56.789Z"
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { blogId },
      include: {
        model: User,
        as: "author",
        attributes: ["username"],
      },
    });
    res.status(200).json({ comments });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
