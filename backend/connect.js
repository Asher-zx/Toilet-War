
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI, {
  tls: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database

module.exports = {
  connectToServer: async () => {
    try {
      await client.connect();
      database = client.db("blogData")
      console.log("Connected to MongoDB");
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getDb: () => {
    if (!database) {
      throw new Error("Database not initialized. Call connectToServer first.");
    }
    return database
  }
} 
