/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AgoraRTC from "agora-rtc-sdk-ng";

// Direct import instead of lazy
import DraggableWrapper from "./Draggble.jsx";

export default function VideoConference() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteVideoTracks, setRemoteVideoTracks] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setupEventListeners();
    }
    return () => {
      leaveCall();
    };
  }, []);

  const setupEventListeners = () => {
    if (!clientRef.current) return;

    clientRef.current.on("user-published", async (user, mediaType) => {
      try {
        await clientRef.current.subscribe(user, mediaType);

        if (mediaType === "video") {
          setRemoteVideoTracks((prev) => [...prev, { uid: user.uid, videoTrack: user.videoTrack }]);
        }
        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
        }
      } catch (error) {
        console.error("Error subscribing to user:", error);
        setError("Failed to connect to remote user");
      }
    });

    clientRef.current.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        setRemoteVideoTracks((prev) => prev.filter((track) => track.uid !== user.uid));
      }
    });
  };

  const joinCall = async () => {
    try {
      setError(null);
      if (!clientRef.current) throw new Error("Agora client not initialized");
      if (isConnected) return;

      const appId = "bf646020758b4d679ba794d53dca8e60";
      const channelName = "main-room";
      const token = null;
      await clientRef.current.join(appId, channelName, token, null);

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);
      await clientRef.current.publish([audioTrack, videoTrack]);

      setLocalUser({ uid: clientRef.current.uid });
      setIsConnected(true);
    } catch (error) {
      console.error("Error joining call:", error);
      setError("Failed to join call");
      await leaveCall();
    }
  };

  const leaveCall = async () => {
    try {
      if (localVideoTrack) {
        await localVideoTrack.stop();
        await localVideoTrack.close();
      }
      if (localAudioTrack) {
        await localAudioTrack.stop();
        await localAudioTrack.close();
      }
      if (clientRef.current) {
        await clientRef.current.leave();
      }
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setLocalUser(null);
      setIsConnected(false);
      setError(null);
    } catch (error) {
      console.error("Error leaving call:", error);
      setError("Failed to leave call properly");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <DraggableWrapper handle=".drag-handle" bounds="parent" defaultPosition={{ x: 20, y: 20 }}>
        <div className="bg-background rounded-lg shadow-lg overflow-hidden w-[400px] h-[600px] flex flex-col">
          <div className="drag-handle flex items-center justify-between p-2 bg-muted/50">
            <span className="text-sm font-medium select-none">Video Conference</span>
          </div>

          <div className="relative flex-1 flex flex-col overflow-hidden">
            {error && <div className="text-red-500 text-center p-2">{error}</div>}

            {!isConnected && (
              <div className="flex items-center justify-center flex-1">
                <Button onClick={joinCall} disabled={isConnected}>Join Call</Button>
              </div>
            )}

            {isConnected && (
              <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
                <Card className="flex-1 relative overflow-hidden bg-muted">
                  <video 
                    id="local-video" 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    muted 
                    ref={(el) => el && localVideoTrack && localVideoTrack.play(el)} 
                  />
                </Card>

                <div className="grid grid-cols-1 gap-4 max-h-[40%]">
                  {remoteVideoTracks.map(({ uid, videoTrack }) => (
                    <Card key={uid} className="relative overflow-hidden bg-muted">
                      <video 
                        id={`video-${uid}`} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        ref={(el) => el && videoTrack && videoTrack.play(el)} 
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="sticky bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 p-2 rounded-full bg-background shadow-lg border">
              <Button 
                variant={isCameraOn ? "default" : "destructive"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsCameraOn(!isCameraOn)}
              >
                {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
              <Button 
                variant={isMicOn ? "default" : "destructive"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8" 
                onClick={leaveCall}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DraggableWrapper>
    </div>
  );
}