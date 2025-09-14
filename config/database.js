const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Build MongoDB URI from environment variables or use direct URI
    let mongoURI;

    if (process.env.MONGODB_URI) {
      mongoURI = process.env.MONGODB_URI;
    } else if (
      process.env.MONGODB_USERNAME &&
      process.env.MONGODB_PASSWORD &&
      process.env.MONGODB_CLUSTER
    ) {
      // Build connection string from individual components
      const username = encodeURIComponent(process.env.MONGODB_USERNAME);
      const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
      const cluster = process.env.MONGODB_CLUSTER;
      const database =
        process.env.MONGODB_DATABASE || process.env.DB_NAME || "ecommerce";

      mongoURI = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority&appName=${cluster}`;
    } else {
      // Fallback to default (for development only)
      console.warn(
        "⚠️  Using default MongoDB connection string. Please set MONGODB_URI or individual MongoDB credentials in environment variables."
      );
      mongoURI =
        "mongodb+srv://ecomm_mock:QUSAEpWfeg1aSWAA@cluster0.wttchje.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed through app termination");
  process.exit(0);
});

module.exports = connectDB;
