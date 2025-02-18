import Room from "../models/roomModel.js"; // Import your Room model
import User from "../models/userAuthModel.js";

const createRoom = async (req, res) => {
  try {
    const { room } = req.body; // Extract room name from request body
    const user = req.user; // Get the authenticated user

   

    // Validate input
    if (!room) {
      return res.status(400).json({ success: false, message: "Room name is required" });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ name: room.code });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: "Room already exists" });
    }

    // Create a new room
    const newRoom = new Room({
      name: room.name,
      code:room.code,
      createdBy: user._id, // Store the user ID who created the room
      participants: [user._id], // Add the creator as the first member
    });

    // Save the room to the database
    await newRoom.save();

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const saveCode = async (req, res) => {
  try {
    const { codes } = req.body; // Object containing language keys and code values
    const { roomId } = req.params;
    const userId = req.user?.id;

    console.log('Received Codes:', codes);
    console.log('Room ID:', roomId);
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Find the room by its ID
    const room = await Room.findOne({ code: roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the user is a participant
    if (!room.participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied: User not a participant" });
    }

    // Ensure room.coding is a Map
    if (!(room.coding instanceof Map)) {
      room.coding = new Map();
    }

    // Update the coding map with each language-specific code
    for (const [language, code] of Object.entries(codes)) {
      room.coding.set(language, code);
    }

    room.lastUpdated = Date.now();

    // Save the updated room
    await room.save();

    res.status(200).json({ message: "Code saved successfully", room });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const user = req.user;

console.log('====================================');
console.log(typeof roomCode);
console.log('====================================');

    // Validate input
    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "Room code is required"
      });
    }

    // Find the room
    const room = await Room.findOne({ code: roomCode });
   // console.log('====================================');
   // console.log(room);
    //console.log('====================================');
    // Check if room exists
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Room not found"
      });
    }
    

    // Check if user is already a participant
    if (room.participants?.includes(user._id)) {
      return res.status(200).json({
        success: true,
        message: "You are already a participant in this room"
      });
    }

    // Add user to participants
    room.participants.push(user._id);
    
    // Save the updated room
    await room.save();

    return res.status(200).json({
      success: true,
      message: "Successfully joined the room",
      room: {
        id: room._id,
        name: room.name,
        code: room.code,
        participants: room.participants
      }
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



const showProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find rooms where createdBy matches the logged-in user's ID
    const rooms = await Room.find({ createdBy: userId });

    if (!rooms || rooms.length === 0) {
      return res.status(200).json({ message: "No rooms found for this user" });
    }

    return res.status(200).json({ 
      success: true,
      data: rooms 
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching rooms",
      error: error.message
    });
  }
}



const getEditorCode = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const user_id = req.user._id

    // Find the room by ID (make sure 'code' is correct, otherwise use '_id')
    const room = await Room.findOne({ code: roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    // Ensure room.coding is defined and convert it to a plain object
    const codingData = room.coding ? Object.fromEntries(room.coding) : {};
    const user = await User.findById(user_id)

    // Return existing code
    return res.status(200).json({
      success: true,
      data: codingData,
      subscription:user.isSubscribed
    });

  } catch (error) {
    console.error("Error fetching editor code:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching editor code",
      error: error.message
    });
  }
};

export { createRoom ,saveCode,joinRoom,showProjects,getEditorCode};
