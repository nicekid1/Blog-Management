const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

//create post
/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog post
 *     description: Create a new blog post by providing title and content
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Blog Post"
 *               content:
 *                 type: string
 *                 example: "This is the content of the new blog post."
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Bad request, invalid input
 */
router.post("/", authenticate, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    const blog = await Blog.create({ title, content, userId});
    res.status(201).json({ message: "Blog post created successfully", blog });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
//receive all posts
/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blog posts
 *     description: Retrieve all blog posts
 *     tags:
 *       - Blog
 *     responses:
 *       200:
 *         description: List of blog posts
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
        as: "author",
        attributes: ["username"],
      },
    });
    res.status(200).json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// receive a specific post
/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a specific blog post
 *     description: Retrieve a single blog post by its ID
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog to retrieve
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog post"
 *                 blog:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     title:
 *                       type: string
 *                       example: "My First Blog Post"
 *                     content:
 *                       type: string
 *                       example: "This is the content of the blog post."
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       example: "2024-11-27T10:45:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-11-27T12:00:00.000Z"
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ message: "Blog post ", blog });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
//edit post
/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog post
 *     description: Edit a blog post by providing the updated title and/or content
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog to be updated
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
 *               title:
 *                 type: string
 *                 example: "Updated Blog Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the blog post"
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog post updated"
 *                 blog:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     title:
 *                       type: string
 *                       example: "Updated Blog Title"
 *                     content:
 *                       type: string
 *                       example: "Updated content of the blog post"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-11-25T10:45:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-11-26T12:00:00.000Z"
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticate, async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();
    res.status(200).json({ message: "Blog post updated", blog });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
//delete post
/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Remove a blog post by its ID
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog to be deleted
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog post deleted"
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    await blog.destroy();
    res.status(200).json({ message: "Blog post deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
