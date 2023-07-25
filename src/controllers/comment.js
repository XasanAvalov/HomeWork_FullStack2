const Comment = require("../models/Comment");
const Io = require("../utils/Io");
const Comments = new Io(process.cwd() + "/database/comments.json");
const Posts = new Io(process.cwd() + "/database/comments.json");
const Users = new Io(process.cwd() + "/database/users.json")


const createComment = async (req, res) => {
  const {text, author, post} = req.body;

  const comments = await getComment(Comments)

  const id = (comments[comments.length - 1]?.id || 0) + 1;

  const newComent = new Comment(id, text, author, post)
  
  const result = comments.length ? [...comments, newComent] : [newComent];

  Comments.write(result)

  res.status(201).json({message: "CREATED"})
};

const getAllComments = async (req, res) => {
    const posts = await getComment(Posts);
    const users = await getComment(Users);
    const comments = await getComment(Comments)

    const find = comments.map((comment) =>{
      comment.author = users.find((user) => user.id == comment.author);
      comment.post = posts.find((post) => post.id == comment.post);
      return comment;
    })

    res.json({comments: find})
};

const getOneComment = async (req, res) => {
  const {id} = req.params;
  const posts = await getComment(Posts);
  const users = await getComment(Users);
  const comments = await getComment(Comments)

  const comment = comments.find((comment) => comment.id == id);

  comment.author = users.find((user) => user.id == comment.author);

  comment.post = posts.find((post) => post.id == comment.post);

  res.json({comment})
};

const deleteOneComment = async (req, res) => {
  const {id} = req.params;

  const comments = await getComment(Comments);

  const filterComments = comments.filter((comment) => comment.id != id);

  await Comments.write(filterComments);

  res.json({message: "Successfully Deleted"})
};

async function getComment(db) {
  return await db.read()
} 
module.exports = {
  createComment,
  getAllComments,
  getOneComment,
  deleteOneComment,
};
