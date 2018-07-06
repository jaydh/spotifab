import React from 'react';
import UserDetails from '../UserDetails';
import TrackSearch from '../TrackSearch';
import './Header.css';

const Header = () => {
  return (
    <div id="header">
      <div className="header">
        <TrackSearch />
        <UserDetails />
      </div>
    </div>
  );
};

export default Header;
