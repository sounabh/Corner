/* eslint-disable no-unused-vars */


export async function createRoom(formData) {
  // Simulate creating a room
  const roomName = formData.get("roomName");
  const roomCode = Math.random().toString(36).substring(7).toUpperCase();

  return {
    id: "1",
    name: roomName,
    code: roomCode,
    users: [],
  };
}

/*export async function joinRoom(formData) {
  // Simulate joining a room
  const code = formData.get("code");
  const name = formData.get("name");
  const email = formData.get("email");

  return {
    id: Math.random().toString(),
   // name,
   // email,
   // avatar: `/placeholder.svg?height=40&width=40`,
  };
}*/

export async function inviteToRoom(formData) {
  // Simulate sending invite
  const emails = formData.get("emails");
  const roomCode = formData.get("roomCode");

  return {
    success: true,
    message: `Invites sent to ${emails}`,
    roomCode
  };
}
