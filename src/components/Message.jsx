import { auth } from "../services/firebase";
import { motion } from "framer-motion";

function Message({
  text,
  fileURL,
  fileName,
  uid,
  photoURL,
  displayName,
  time,
  reactions = [],
  seenBy = [],
  handleReact = () => {},
}) {
  const isOwn = uid === auth.currentUser?.uid;
  const alignClass = isOwn ? "text-end" : "text-start";
  const bubbleStyle = isOwn ? "bg-primary text-white" : "bg-light";

  return (
    <motion.div
      className={`my-3 d-flex ${isOwn ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <img
        src={photoURL}
        alt="avatar"
        className="rounded-circle mx-2"
        style={{ width: "40px", height: "40px" }}
      />

      <div className={`${alignClass} flex-grow-1`}>
        {!isOwn && (
          <strong className="d-block text-muted small mb-1">
            {displayName || "Anonymous"}
          </strong>
        )}

        <div className={`p-2 rounded-3 ${bubbleStyle}`}>
          {text && <p className="mb-1">{text}</p>}

          {fileURL && (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-underline"
            >
              {fileName || "Download File"}
            </a>
          )}
        </div>

        {time && <small className="text-muted d-block mt-1">{time}</small>}

        {reactions.length > 0 && (
          <div className="mt-1 small">
            {reactions.map((r, i) => (
              <span key={i} className="me-2">{r.emoji}</span>
            ))}
          </div>
        )}

        {!isOwn && (
          <div className="mt-1">
            {["👍", "❤️", "😂"].map((emoji) => (
              <button
                key={emoji}
                className="btn btn-sm btn-outline-secondary me-1"
                onClick={() => handleReact(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {isOwn && (
          <small className="text-muted d-block mt-1">
            {seenBy.length > 1
              ? `Seen by ${seenBy.length - 1} other${seenBy.length > 2 ? "s" : ""}`
              : "Delivered"}
          </small>
        )}
      </div>
    </motion.div>
  );
}

export default Message;
