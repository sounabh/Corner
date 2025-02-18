/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function VideoConference() {
  // State Management
  const [participants, setParticipants] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Tracks Management
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteVideoTracks, setRemoteVideoTracks] = useState([]);

  // Refs
  const clientRef = useRef(null);
  const configRef = useRef({
    appId: "bf646020758b4d679ba794d53dca8e60",
    channel: "main-room",
    token: null
  });

  // Initialize Agora Client
  useEffect(() => {
    const initializeClient = async () => {
      try {
        clientRef.current = AgoraRTC.createClient({ 
          mode: "rtc", 
          codec: "vp8" 
        });
        setupEventListeners();
      } catch (err) {
        setError("Failed to initialize video client");
      }

      return () => {
        leaveCall();
      };
    };

    initializeClient();
  }, []);

  // Event Listeners
  const setupEventListeners = () => {
    const client = clientRef.current;
    if (!client) return;

    client.on("user-published", async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          setRemoteVideoTracks(prev => [
            ...prev, 
            { uid: user.uid, videoTrack: user.videoTrack }
          ]);
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }

        setParticipants(prev => {
          if (!prev.some(p => p.uid === user.uid)) {
            return [...prev, user];
          }
          return prev;
        });
      } catch (err) {
        setError("Failed to connect to remote user");
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        setRemoteVideoTracks(prev => 
          prev.filter(track => track.uid !== user.uid)
        );
      }
    });

    client.on("user-left", (user) => {
      setParticipants(prev => 
        prev.filter(participant => participant.uid !== user.uid)
      );
      setRemoteVideoTracks(prev => 
        prev.filter(track => track.uid !== user.uid)
      );
    });
  };

  // Join Call
  const joinCall = async () => {
    try {
      const client = clientRef.current;
      const { appId, channel, token } = configRef.current;

      // Reset previous state
      setError(null);
      
      // Join channel
      await client.join(appId, channel, token, null);

      // Create tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);

      // Update state
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);
      setIsConnected(true);
    } catch (err) {
      setError(err.message || "Failed to join call");
      await leaveCall();
    }
  };

  // Leave Call
  const leaveCall = async () => {
    try {
      // Stop and close local tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }

      // Leave channel
      if (clientRef.current) {
        await clientRef.current.leave();
      }

      // Reset states
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setRemoteVideoTracks([]);
      setParticipants([]);
      setIsConnected(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to leave call");
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (localVideoTrack) {
      const newState = !isCameraOn;
      localVideoTrack.setEnabled(newState);
      setIsCameraOn(newState);
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (localAudioTrack) {
      const newState = !isMicOn;
      localAudioTrack.setEnabled(newState);
      setIsMicOn(newState);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden">
        {/* Video Grid */}
        <div className={`grid gap-4 p-4 
          ${remoteVideoTracks.length === 0 ? "grid-cols-1" : "grid-cols-2"}
        `}>
          {/* Local Video */}
          {localVideoTrack && (
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video 
                id="local-video" 
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
                ref={(el) => el && localVideoTrack.play(el)} 
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                You {!isCameraOn && "(Camera Off)"}
              </div>
            </div>
          )}

          {/* Remote Videos */}
          {remoteVideoTracks.map(({ uid, videoTrack }) => (
            <div key={uid} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video 
                id={`video-${uid}`} 
                className="w-full h-full object-cover" 
                autoPlay 
                ref={(el) => el && videoTrack.play(el)} 
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                Remote User
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {!isConnected ? (
          <div className="flex justify-center p-4">
            <Button 
              onClick={joinCall} 
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Join Call
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-4 p-4 bg-gray-800">
            <Button 
              onClick={toggleCamera}
              variant={isCameraOn ? "outline" : "destructive"}
              className="rounded-full p-3"
            >
              {isCameraOn ? <Camera /> : <CameraOff />}
            </Button>
            <Button 
              onClick={toggleMic}
              variant={isMicOn ? "outline" : "destructive"}
              className="rounded-full p-3"
            >
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button 
              onClick={leaveCall}
              variant="destructive"
              className="rounded-full p-3"
            >
              <PhoneOff />
            </Button>
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="bg-red-500 text-white text-center p-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}