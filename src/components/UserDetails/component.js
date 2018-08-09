import React from 'react';
import './UserDetails.css';

export default class UserDetails extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    return (
      <div className="user-details-container">
        {this.props.displayName &&
          this.props.userImage && (
            <React.Fragment>
              <img
                alt="user"
                className="user-image"
                src={this.props.userImage}
              />
              <p className="user-name">{this.props.displayName}</p>
            </React.Fragment>
          )}
      </div>
    );
  }
}
