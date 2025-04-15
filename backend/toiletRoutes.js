const express = require('express');
const database = require('./connect');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let toiletRoutes = express.Router();

// Get today's toilet session for user
toiletRoutes.route('/toilet/today').get(verifyToken, async (req, res) => {
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

// Increment toilet use count
toiletRoutes.route('/toilet/use').post(verifyToken, async (req, res) => {
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
        toiletUses: 1,
        complaints: 0,
        conflict: false
      };
      
      await db.collection('toiletSessions').insertOne(session);
    } else {
      // Update
      const newToiletUses = session.toiletUses + 1;
      
      let complaints = 0;
      if (newToiletUses >= 3) {
        complaints = newToiletUses - 2; 
      }

      const conflict = complaints >= 3;
      
      await db.collection('toiletSessions').updateOne(
        { _id: session._id },
        { $set: {
            toiletUses: newToiletUses,
            complaints: complaints,
            conflict: conflict
          }
        }
      );
      
      session = {
        ...session,
        toiletUses: newToiletUses,
        complaints: complaints,
        conflict: conflict
      };
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error updating toilet use:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get toilet usage history
toiletRoutes.route('/toilet/history').get(verifyToken, async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    
    const sessions = await db.collection('toiletSessions')
      .find({ userId: userId })
      .sort({ date: -1 })
      .limit(7)
      .toArray();
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching toilet history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Auth middleware
function verifyToken(req, res, next) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

module.exports = toiletRoutes;