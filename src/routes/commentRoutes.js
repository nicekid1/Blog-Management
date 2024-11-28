const express = require("express");
const Comment = require("../models/comment");
const User = require("../models/user");
const Blog = require("../models/blog");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// add a comment
/**
 * @swagger
 * /comments/{blogId}:
 *   post:
 *     summary: Add a new comment to a specific blog
 *     description: Create a comment for a blog post by providing content. The user's ID is extracted from the authentication token.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The ID of the blog to which the comment belongs
 *         schema:
 *           type: integer
 *           example: 5
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
 *       500:
 *         description: Internal server error
 */
router.post("/:blogId", authenticate, async (req, res) => {
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

// fetching comments for a blog
/**
 * @swagger
 * /comments/{blogId}:
 *   get:
 *     summary: Retrieve all comments for a specific blog
 *     description: Fetch a list of comments associated with a given blog ID. The response includes the author's username for each comment.
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
 *         description: List of comments retrieved successfully
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

//edit comment
/**
 * @swagger
 * /comments/{blogId}/{commentId}:
 *   put:
 *     summary: Update a specific comment for a blog
 *     description: Edit the content of an existing comment for a specific blog. Requires authentication.
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
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to be updated
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment content"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     content:
 *                       type: string
 *                       example: "Updated comment content"
 *                     blogId:
 *                       type: integer
 *                       example: 5
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       example: "2024-11-26T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-11-27T14:23:12.456Z"
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Internal server error
 */
router.put("/:blogId/:commentId", authenticate, async (req, res) => {
  const { content } = req.body;
  const { blogId, commentId } = req.params;

  try {
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// delete comment
/**
 * @swagger
 * /comments/{blogId}/{commentId}:
 *   delete:
 *     summary: Delete a specific comment for a blog
 *     description: Remove a specific comment associated with a blog. Requires authentication.
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
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to be deleted
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:blogId/:commentId', authenticate, async (req, res) => {
  const { blogId, commentId } = req.params;

  try {
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
