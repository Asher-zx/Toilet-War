const express = require('express');
const router = express.Router();
const database = require('./connect');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;
const jwt = require('jsonwebtoken');
require('dotenv').config();

let userRoutes = express.Router();

//#1 Retreive all 
//http://localhost:3000/users
userRoutes.route('/api/users').get(async (req, res) => {
  let db = database.getDb()
  let data = await db.collection('users').find({}).toArray()
  if (data.length > 0) {
    res.json(data)
  } else {
    throw new Error("No data found")
  }
})

//#2 Retreive One 
//http://localhost:3000/users/12345
userRoutes.route('/api/users/:id').get(async (req, res) => {
  let db = database.getDb()
  let data = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) })
  if (Object.keys(data).length > 0) {
    res.json(data)
  } else {
    throw new Error("No data found")
  }
})

//#3 Create one 
userRoutes.route('/api/users').post(async (req, res) => {
  let db = database.getDb()

  const takenEmail = await db.collection("users").findOne({ email: req.body.email })
  if (takenEmail) {
    return res.status(400).json({ message: "Email already taken" })
  } else {

    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS)

    let mongoObject = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      joinDate:  new Date(),
      posts: []
    }
    let data = await db.collection('users').insertOne(mongoObject)
    res.json(data)
  }
})


//#4 update one 
userRoutes.route('/api/users/:id').put(async (req, res) => {
  let db = database.getDb()
  let mongoObject = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    joinDate:  req.body.joinDate,
    posts: req.body.posts
  }

  
  let data = await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) }, mongoObject)
  res.json(data)
})


//#5 delete one
userRoutes.route('/api/users/:id').delete(async (req, res) => {
  let db = database.getDb()
  let data = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) })
  res.json(data)
})

//#6 Login 
userRoutes.route('/api/users/login').post(async (req, res) => {
  let db = database.getDb()

  const user = await db.collection("users").findOne({ email: req.body.email })
  

  if (user) {
    let confirmation = await bcrypt.compare(req.body.password, user.password)
    if (confirmation) {
      const token = jwt.sign(user, process.env.SECRETKEY, { expiresIn: '1h' })
      res.json({success: true, token})
    } else {
      res.json({success: false, message: "password does not match"})
    }
  } else {
    res.json({ message: "user not found" })
  }
})

//toilet session
userRoutes.route('/api/users/session').get(async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let session = await db.collection('toiletSessions').findOne({
      userId: userId,
      date: { $gte: today }
    });
    
    if (!session) {
      session = {
        userId: userId,
        date: today,
        toiletUses: 0,
        complaints: 0,
        conflict: false
      };
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching toilet session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = userRoutes;