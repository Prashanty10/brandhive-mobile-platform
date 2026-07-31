import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "BrandHive",
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    process.on("SIGNIT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
        process.exit(0);
      } catch (error) {
        console.error("Error while closing MongoDB:", error.message);
        process.exit(1);
      }
    });

    console.log(`Database connection ${connection.connection.host}`);
  } catch (error) {
    console.log("Database connection error :", error.message);
    process.exit(1);
  }
};

export default connectDB;