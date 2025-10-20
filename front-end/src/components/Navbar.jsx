import React, { useState } from 'react';
import { Link } from "react-router-dom";
import UoNLogo from "../assets/uonlogo.svg";
import useUser from '../useUser';
import UserMenu from "./UserMenu";
import "./Navbar.css";

function Navbar() {
  const { isLoading, user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav__left">
        <img src={UoNLogo} alt="UON Logo" className="nav__logoImg" />
        <h2 className="nav__logo">UON Community Marketplace</h2>
      </div>

      <button
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(o => !o)}
      >
        ☰
      </button>

      <div id="primary-nav" className="nav__links" data-open={open}>
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/create-listing">Create Listing</Link>
        <Link to="/messages">Messages</Link>
      </div>

      <div className="nav__profile">
        {!isLoading && user && <UserMenu />}
      </div>
    </nav>
  );
}

export default Navbar;
