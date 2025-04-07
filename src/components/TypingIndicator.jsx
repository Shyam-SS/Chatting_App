import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { AnimatePresence, motion } from "framer-motion";

function TypingIndicator({ roomId }) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rooms", roomId, "typingStatus"), (snapshot) => {
      const names = snapshot.docs
        .map(doc => doc.data().displayName)
        .filter(name => name !== auth.currentUser?.displayName);
      setTypingUsers(names);
    });
    return unsub;
  }, [roomId]);

  return (
    <AnimatePresence>
      {typingUsers.length > 0 && (
        <motion.small
          className="text-muted d-block mt-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {typingUsers.join(", ")} is typing...
        </motion.small>
      )}
    </AnimatePresence>
  );
}

export default TypingIndicator;
