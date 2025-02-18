/* eslint-disable no-unused-vars */
import { useState } from "react";
import { createRoom } from "./action.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../store/authStore.js";
import { useToast } from "@/hooks/use-toast" // Assuming you're using react-hot-toast for notifications

export default function RoomPage() {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();
  const {toast} = useToast()

  // Handle room creation
  async function handleCreateRoom(formData) {
    try {
      setIsLoading(true);
      const newRoom = await createRoom(formData);
      setRoom(newRoom);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_BASE_URL}/editor/room-create`,
        { room: newRoom },
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success("Room created successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle joining a room
  async function handleJoinRoom(formData) {
    try {
      setIsLoading(true);
      console.log('====================================');
      console.log(formData.get("code"));
      console.log('====================================');
      const roomCode = formData.get("code")
   
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_BASE_URL}/editor/room-join`,
        { roomCode },
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
       // toast.success("Successfully joined the room!");
        navigate(`/editor/${roomCode}`);
      }
    } catch (error) {
      console.error(error);
      //toast.error(error.response?.data?.message || "Failed to join room");
    } finally {
      setIsLoading(false);
    }
  }

  // Copy room code to clipboard
  function copyRoomCode() {
    if (room) {
      navigator.clipboard.writeText(room.code);
      toast.success("Room code copied to clipboard!");
    }
  }

  // Activate room and navigate to editor
  async function activateRoom() {
    if (room) {
      try {
        setIsLoading(true);
        navigate(`/editor/${room.code}`);
        toast.success("Room activated successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to activate room");
      } finally {
        setIsLoading(false);
      }
    }
  }

  // Rest of your component JSX remains the same, but update the buttons to show loading state:
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <main className="w-full max-w-3xl p-6">
        <div className="space-y-8">
          {room ? (
            <Card className="bg-slate-900 border-slate-800">
              {/* ... existing room display card ... */}
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-200">Room Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={room.code}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-slate-200"
                    />
                    <Button
                      onClick={copyRoomCode}
                      variant="secondary"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200"
                      disabled={isLoading}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={activateRoom}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Activating..." : "Activate Room"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900 border-slate-800">
              {/* ... existing create/join room card ... */}
              <CardContent>
                <Tabs defaultValue="create" className="space-y-4">
                  <TabsList className="bg-slate-800 text-slate-400">
                    <TabsTrigger value="create">Create Room</TabsTrigger>
                    <TabsTrigger value="join">Join Room</TabsTrigger>
                  </TabsList>
                  
                  {/* Create Room Tab */}
                  <TabsContent value="create">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateRoom(new FormData(e.target));
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-slate-200">Room Name</Label>
                        <Input
                          name="roomName"
                          placeholder="Enter room name"
                          className="bg-slate-800 border-slate-700 text-slate-200"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {isLoading ? "Creating..." : "Create Room"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Join Room Tab */}
                  <TabsContent value="join">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleJoinRoom(new FormData(e.target));
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-slate-200">Room Code</Label>
                        <Input
                          name="code"
                          placeholder="Enter room code"
                          className="bg-slate-800 border-slate-700 text-slate-200"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Joining..." : "Join Room"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}