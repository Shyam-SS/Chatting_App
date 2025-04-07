import { useState, useRef } from "react";
import { db, auth, storage } from "../services/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { motion } from "framer-motion";

function ChatComposer({ roomId }) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const typingTimeoutRef = useRef(null);

  const user = auth.currentUser;
  const typingRef = doc(db, "rooms", roomId, "typingStatus", user.uid);

  const handleTyping = async () => {
    await setDoc(typingRef, { displayName: user.displayName });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      deleteDoc(typingRef);
    }, 2000);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim() !== "") handleTyping();
  };

  const handleTextSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text: trimmed,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    await deleteDoc(typingRef);
    setText("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(pct.toFixed(0));
        },
        (err) => {
          console.error("Upload error:", err);
          alert("Upload failed. Try again.");
          setUploading(false);
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "rooms", roomId, "messages"), {
            text,
            fileURL,
            fileName: file.name,
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
          });

          setText("");
          setProgress(0);
          setUploading(false);
          alert("File sent!");
        }
      );
    } catch (err) {
      console.error("Unexpected error:", err);
      setUploading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleTextSend}
      className="d-flex flex-column gap-2 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <textarea
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={handleTextChange}
      />
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          Send
        </button>
        <label className="btn btn-outline-secondary mb-0">
          📎 Upload
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            hidden
          />
        </label>
      </div>
      {uploading && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </motion.form>
  );
}

export default ChatComposer;
