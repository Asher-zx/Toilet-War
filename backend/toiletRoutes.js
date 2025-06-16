const express = require('express');
const database = require('./connect');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let toiletRoutes = express.Router();

// Get today's date
// Add this route if it's not there already
toiletRoutes.route('/api/toilet/today').get(verifyToken, async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    
    let session = await db.collection('toiletSessions').findOne({
      userId: userId,
      date: { $gte: today, $lt: nextDay }
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

// toilet use routes
toiletRoutes.route('/api/toilet/use').post(verifyToken, async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    
    let session = await db.collection('toiletSessions').findOne({
      userId: userId,
      date: { $gte: today, $lt: nextDay }
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
      
      session = await db.collection('toiletSessions').findOne({
        userId: userId,
        date: { $gte: today, $lt: nextDay }
      });
    } else {
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

// Get toilet session for user
toiletRoutes.route('/api/toilet/date/:date').get(verifyToken, async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    const dateStr = req.params.date;
    
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    let session = await db.collection('toiletSessions').findOne({
      userId: userId,
      date: {  
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1))
      }
    });
    
    if (!session) {
      session = {
        userId: userId,
        date: selectedDate,
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

// record toilet use for a specific date
toiletRoutes.route('/api/toilet/date/:date/use').post(verifyToken, async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    const dateStr = req.params.date;
  
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    let session = await db.collection('toiletSessions').findOne({
      userId: userId,
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)) 
      }
    });
    
    if (!session) {
      session = {
        userId: userId,
        date: selectedDate,
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

//Decrease toilet use
toiletRoutes.route('/api/toilet/decrease').post(verifyToken, async (req, res) => {  
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    
    let selectedDate;
    if (req.body.date) {
      selectedDate = new Date(req.body.date);
    } else {
      selectedDate = new Date();
    }
    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    let session = await db.collection('toiletSessions').findOne({
      userId: userId,
      date: {   
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)) 
      }
    });
    
    if (!session || session.toiletUses <= 0) {
      return res.status(400).json({ message: 'No toilet use to decrease' });
    }

    const newToiletUses = Math.max(0, session.toiletUses -1);

    let complaints = 0;
    if (newToiletUses >= 3) {
      complaints = newToiletUses - 2;
    }

    const conflict = complaints >= 3;
    
    await db.collection('toiletSessions').updateOne(
      { _id: session._id },
      {
         $set: {
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

    res.json(session);
  } catch (error) {
    console.error('Error fetching toilet session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Delete toilet session
toiletRoutes.route('/api/toilet/session').delete(verifyToken, async (req, res) => {
  try {
    const db = database.getDb();
    const userId = req.user._id.toString();
    
    let selectedDate;
    if (req.body.date) {
      selectedDate = new Date(req.body.date);
    } else {
      selectedDate = new Date();
    }
    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const result = await db.collection('toiletSessions').deleteOne({
      userId: userId,
      date: { 
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)) 
      }
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error fetching toilet session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get toilet usage history
toiletRoutes.route('/api/toilet/history').get(verifyToken, async (req, res) => {
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