import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Message from "../components/Message";
import ChatComposer from "../components/ChatComposer";
import TypingIndicator from "../components/TypingIndicator";
import { useNavigate } from "react-router-dom";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const roomId = "general"; // or dynamic later
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const msgList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgList);
    });

    return unsubscribe;
  }, [roomId]);

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/login"));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Chat Room</h3>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="bg-white border rounded p-3" style={{ height: "65vh", overflowY: "auto" }}>
        {messages.map(msg => (
          <Message
            key={msg.id}
            text={msg.text}
            fileURL={msg.fileURL}
            fileName={msg.fileName}
            uid={msg.uid}
            photoURL={msg.photoURL}
            displayName={msg.displayName}
            time={msg.createdAt?.toDate().toLocaleTimeString()}
            reactions={msg.reactions || []}
            seenBy={msg.seenBy || []}
          />
        ))}
        <TypingIndicator roomId={roomId} />
      </div>

      <div className="mt-3">
        <ChatComposer roomId={roomId} />
      </div>
    </div>
  );
}

export default ChatRoom;
