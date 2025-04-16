const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const app = express();  
const posts = require('./postRoutes');
const users = require('./userRoutes');
const awsRoutes = require('./awsRoutes');
const multer = require('multer');
const upload = multer();

const toiletRoutes = require('./toiletRoutes');



const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(upload.any())
app.use(posts);
app.use(users);
app.use(awsRoutes);
app.use(toiletRoutes);

app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
});

//debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})