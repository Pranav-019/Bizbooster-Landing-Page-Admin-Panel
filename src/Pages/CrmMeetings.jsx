import React, { useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const CrmMeetings = () => {
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [meetingRoom, setMeetingRoom] = useState("");
  const [userName, setUserName] = useState("");

  const handleStartMeeting = () => {
    if (meetingRoom && userName) {
      setIsMeetingStarted(true);
    } else {
      alert("Please provide a meeting room name and your name.");
    }
  };

  return (
    <div>
      <h1>CRM Meetings</h1>
      {!isMeetingStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter Meeting Room Name"
            value={meetingRoom}
            onChange={(e) => setMeetingRoom(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <input
            type="text"
            placeholder="Enter Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <button
            onClick={handleStartMeeting}
            style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}
          >
            Start Meeting
          </button>
        </div>
      ) : (
        <div>
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={meetingRoom}
            userInfo={{ displayName: userName }}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: true,
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "600px";
              iframeRef.style.width = "100%";
            }}
          />
          <button
            onClick={() => setIsMeetingStarted(false)}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#ff0000",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            End Meeting
          </button>
        </div>
      )}
    </div>
  );
};

export default CrmMeetings;
