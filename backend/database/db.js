import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.log("====================================");
    console.log("Unable to connect with Database", error);
    console.log("====================================");
  }
};


export default connectDB