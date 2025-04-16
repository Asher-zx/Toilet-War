const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const app = express();  
const posts = require('./postRoutes');
const users = require('./userRoutes');

const toiletRoutes = require('./toiletRoutes');



const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(upload.any())

//debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

app.use(posts);
app.use(users);
app.use(toiletRoutes);

app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
});

