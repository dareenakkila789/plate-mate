import React from 'react';
import { Utensils, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../index.css';

function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/home" className="logo">
          <Utensils className="h-6 w-6" />
          <span className="logo-text">PlateMate</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/browse" className="nav-link">Browse</Link>
          <Link to="/my-listings" className="nav-link">My Listings</Link>
        </div>

        {/* Profile Icon */}
        <Link to="/profile" className="profile-button">
          <User className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}

export default Header;
