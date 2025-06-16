const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const app = express();  
const posts = require('./postRoutes');
const users = require('./userRoutes');
const mongoose = require('mongoose');
const toiletRoutes = require('./toiletRoutes');



const PORT = 3003;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'  
    ? ['https://your-vercel-app.vercel.app'] 
    : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toilet_war', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Toilet War API is running!' });
});

//debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

app.use('/api', posts);
app.use('/api', users);
app.use('/api', toiletRoutes);


module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3003;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

