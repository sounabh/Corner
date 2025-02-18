import { app, PORT } from "./index.js"; 
import http from 'http'; 
import { Server } from 'socket.io'; 
import axios from "axios";   

// Create HTTP server
const server = http.createServer(app);   

// Configure Socket.IO with CORS
const io = new Server(server, {   
  cors: {     
    origin: "*",     
    methods: ["GET", "POST"]   
  } 
});   

// Store room states
const roomStates = new Map(); 

// Helper function to get or create room state
const getRoomState = (roomId) => {   
  if (!roomStates.has(roomId)) {     
    roomStates.set(roomId, {       
      users: new Set(),       
      code: {},       
      currentTab: 'html'     
    });   
  }   
  return roomStates.get(roomId); 
};   

// Socket connection handler
io.on("connection", (socket) => {   
  console.log("User Connected:", socket.id);     

  // Join room handler   
  socket.on("join", ({ roomId, userName }) => {     
    // Leave previous room if exists     
    if (socket.currentRoom) {       
      handleUserLeave(socket);     
    }      

    // Join new room     
    socket.currentRoom = roomId;     
    socket.currentUser = userName;     
    socket.join(roomId);      

    // Update room state     
    const roomState = getRoomState(roomId);     
    roomState.users.add(userName);      

    // Broadcast updated user list     
    io.to(roomId).emit("userList", Array.from(roomState.users));      

    // Send current code state to new user     
    if (roomState.code) {       
      Object.entries(roomState.code).forEach(([language, code]) => {         
        socket.emit("codeUpdate", { language, code });       
      });     
    }      

    // Sync current tab     
    socket.emit("tabChange", { newTab: roomState.currentTab });   
  });     

  // Code change handler - IMPROVED   
  socket.on("codeChange", ({ roomId, language, code }) => {     
    const roomState = getRoomState(roomId);     
    roomState.code[language] = code;     
    
    // Broadcast to ALL clients in the room, including the sender
    io.to(roomId).emit("codeUpdate", { language, code });   
  });     

  // Tab change handler   
  socket.on("tabChange", ({ roomId, newTab }) => {     
    const roomState = getRoomState(roomId);     
    roomState.currentTab = newTab;     
    socket.to(roomId).emit("tabChange", { newTab });   
  });     

  // Compilation handler
  socket.on("compile", async ({ code, roomId, language, version }) => {     
    try {
      if (roomStates.has(roomId)) {       
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {           
            language,           
            version,           
            files: [             
              {               
                content: code,             
              },           
            ],         
          }
        );          

        // Emit compilation result to ALL clients in the room
        io.to(roomId).emit("codeResponse", response.data);     
      }
    } catch (error) {
      // Error handling for compilation
      io.to(roomId).emit("codeResponse", { 
        error: "Compilation failed", 
        details: error.message 
      });
    }
  });      

  // Disconnect handler   
  socket.on("disconnect", () => {     
    handleUserLeave(socket);   
  }); 
});   

// Helper function to handle user leaving 
const handleUserLeave = (socket) => {   
  if (socket.currentRoom) {     
    const roomState = roomStates.get(socket.currentRoom);     
    if (roomState) {       
      roomState.users.delete(socket.currentUser);       
      io.to(socket.currentRoom).emit("userList", Array.from(roomState.users));              
      // Clean up empty rooms       
      if (roomState.users.size === 0) {         
        roomStates.delete(socket.currentRoom);       
      }     
    }   
  } 
};   

// Start server 
server.listen(PORT, () => {   
  console.log(`Server running on port ${PORT}`); 
});