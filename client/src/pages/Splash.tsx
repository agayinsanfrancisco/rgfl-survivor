import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Splash: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("Splash component mounted, user:", user);
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  console.log("Splash component rendering");

  return (
    <div className="container">
      <h1>Reality Games: Survivor Fantasy League</h1>
      <p>Draft, rank, and play along with every episode of Survivor 49.</p>
      <p>
        <strong>Sign up</strong> to join the game and make your picks. If you're already registered, just log in to start playing!
      </p>
    </div>
  );
};

export default Splash;