const express = require('express');
const router = express.Router();
const database = require('./connect');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const{ S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

require('dotenv').config();


let awsRoutes = express.Router();
const s3Bucket = 'blogstorage1128'

const s2Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

//#1 Retreive One 
//http://localhost:3000/posts/12345
awsRoutes.route('/images/:id').get(verifyToken, async (req, res) => {
  const id = req.params.id
  const bucketParams = {
    Bucket: s3Bucket,
    Key: id,
  }

  const data = await s3Client.sent(new GetObjectCommand(bucketParams))


  const contentType = data.ContentType
  const srcString = await data.Body.transformtoString('base64')
  const imageSource = `data:${contentType};base64, ${srcString}`
  res.json(data)
})

//#2 Create one 
awsRoutes.route('/images').post(verifyToken, async (req, res) => {
  const file = req.files[0]
  const bucketParams = {
    Bucket: s3Bucket,
    Key: file.originalname,
    Body: file.buffer
  }

  const data = await s3Client.sent(new PutObjectCommand(bucketParams))
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

module.exports = awsRoutes;