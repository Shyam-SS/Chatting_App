import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
  }, [darkMode]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Authentication error:${error.code}\n${error.message}");
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <motion.div
        className="text-center border p-5 rounded shadow bg-white bg-opacity-75"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="mb-4">Welcome to Chat App</h2>
        <button className="btn btn-outline-primary mb-3" onClick={handleLogin}>
          <i className="bi bi-google me-2"></i> Sign in with Google
        </button>
        <div>
          <button
            className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"}`}
            onClick={toggleTheme}
          >
            Switch to {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
