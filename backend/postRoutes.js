const express = require('express');
const router = express.Router();
const database = require('./connect');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


let postRoutes = express.Router();

//#1 Retreive all 
//http://localhost:3000/posts
postRoutes.route('/posts').get(verifyToken, async (req, res) => {
  let db = database.getDb()
  let data = await db.collection('posts').find({}).toArray()
  if (data.length > 0) {
    res.json(data)
  } else {
    throw new Error("No data found")
  }
})

//#2 Retreive One 
//http://localhost:3000/posts/12345
postRoutes.route('/posts/:id').get(verifyToken, async (req, res) => {
  let db = database.getDb()
  let data = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) })
  if (Object.keys(data).length > 0) {
    res.json(data)
  } else {
    throw new Error("No data found")
  }
})

//#3 Create one 
postRoutes.route('/posts').post(verifyToken, async (req, res) => {
  const authorId = req.user._id || req.user.id || req.user.userId;
  if (!authorId) {
    console.log("User payload:", req.user); // Debug what's available
    return res.status(400).json({ message: "User ID not found in token" });
  }

  let db = database.getDb()
  let mongoObject = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    author: authorId,
    dateCreated: req.body.dateCreated,
    imageId: req.body.imageId
  }
  let data = await db.collection('posts').insertOne(mongoObject)
  res.json(data)
})


//#4 update one 
postRoutes.route('/posts/:id').put(verifyToken, async (req, res) => {
  let db = database.getDb()
  let mongoObject = {
    $set: {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author:  req.body.author,
      dateCreated: req.body.dateCreated,
      imageId: req.body.imageId
    }

  }
  let data = await db.collection('posts').updateOne({ _id: new ObjectId(req.params.id) }, mongoObject)
  res.json(data)
})


//#5 delete one
postRoutes.route('/posts/:id').delete(verifyToken, async (req, res) => {
  let db = database.getDb()
  let data = await db.collection('posts').deleteOne({ _id: new ObjectId(req.params.id) })
  res.json(data)
})

//verify token
function verifyToken(req, res, next) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(' ')[1];
  //Bearer 1234

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" })
  }

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "invalid token" })
    }
    console.log("JWT payload", user);
    
    req.user = user;
    next(); 
  })

}

module.exports = postRoutes;