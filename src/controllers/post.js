const { channel } = require("diagnostics_channel");
const Post = require("../models/Post");
const Io = require("../utils/Io");
const Posts = new Io(process.cwd() + "/database/posts.json");
const Users = new Io(process.cwd() + "/database/users.json")
const path = require("path")

const createPost = async (req, res) => {
  const {title, description, channel} = req.body;
  const photo = req.files?.photo;

  const posts = await getPosts(Posts);

  const mimetype = path.extname(photo.name)
  const imageName = photo.md5 + "_" + Date.now() + mimetype;
  photo.mv(`${process.cwd()}/uploads/${imageName}`)

  const id = (posts[posts.length - 1]?.id || 0) + 1;

  const newPost = new Post(id, imageName, title, description, channel)
  
  const result = posts.length ? [...posts, newPost] : [newPost];

  Posts.write(result)

  res.status(201).json({message: "CREATED"})
};

const getAllPosts = async (req, res) => {
  const posts = await getPosts(Posts);
  const users = await getPosts(Users)

  const find = posts.map((post) =>{
    post.channel = users.find((user) => user.id == post.channel);
    return post
  })

  res.json({posts: find})
};

const getOnePost = async (req, res) => {
  const {id} = req.params;
  const posts = await getPosts(Posts);
  const users = await getPosts(Users)

  const post = posts.find((post) => post.id == id);

  post.channel = users.find((user) => user.id == post.channel);

  res.json({post})
};

async function getPosts(db) {
  return await db.read()
} 

module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
};