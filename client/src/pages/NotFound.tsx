import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="container">
    <h2>404 - Page Not Found</h2>
    <p>The page you're looking for doesn’t exist.</p>
    <Link to="/">Return Home</Link>
  </div>
);

export default NotFound;