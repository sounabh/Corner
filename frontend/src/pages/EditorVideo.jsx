"use client"
import EditorComponent from "../Editor"
import VideoConference from "./room&Editor/call"

const CombinedEditorVideo = () => {
  return (
    <div className="relative w-full h-full">
      {/* Editor container */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <EditorComponent />
      </div>

      {/* Video container */}
      <div
        className="absolute top-5 right-5 z-10"
        style={{
          maxWidth: "300px", // Limit the size of the video container
          maxHeight: "200px",
          pointerEvents: "auto", // Ensure it captures pointer events
        }}
      >
        <VideoConference />
      </div>

      {/* Optional overlay for visual feedback */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full border-2 border-red-500 opacity-50" />
      </div>
    </div>
  )
}

export default CombinedEditorVideo