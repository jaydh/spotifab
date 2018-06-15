import React from 'react';
import PropTypes from 'prop-types';
import './UserDetails.css';

const UserDetails = ({ userImage, displayName }) => {
  return (
    <div className="user-details-container">
      <img alt="user" className="user-image" src={userImage} />
      <p className="user-name">{displayName}</p>
    </div>
  );
};

export default UserDetails;
