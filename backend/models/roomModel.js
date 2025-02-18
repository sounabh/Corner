import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures room names are unique
  },
  code: {
    type: String,
    required: true,
    unique: true, // Ensures room names are unique
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
    },
  ],
  coding: {
    type: Map, // Dynamic storage for multiple languages
    of: String, // Each key (language) stores a string (code content)
    default: {}, // Empty object initially
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
