const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
  try {
    // Only connect if DB_MODE is not 'sql'
    const dbMode = (process.env.DB_MODE || 'mongo').toLowerCase();
    if (dbMode === 'sql') {
      return;
    }
    const development = process.env.DATABASE;
    let conn;
    if (development === 'CLOUD') {
      if (!process.env.MONGODB_URI_C) throw new Error('MONGODB_URI_C is not set');
      conn = await mongoose.connect(process.env.MONGODB_URI_C, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
  } catch (error) {
    console.error("MongoDB disconnect error:", error)
  }
}

module.exports = {
  connectDB,
  disconnectDB,
}
